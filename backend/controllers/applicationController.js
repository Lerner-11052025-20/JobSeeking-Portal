import axios from 'axios';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { createNotification } from './notificationController.js';

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker)
export const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications.' });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job.' });
    }

    const applicationData = {
      job: req.params.jobId,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter || '',
    };

    // Handle resume - use uploaded file or user's existing resume
    if (req.file) {
      applicationData.resume = req.file.path; // Cloudinary URL
      applicationData.resumeUrl = req.file.path;
      applicationData.resumeName = req.file.originalname;
    } else if (req.user.resumeUrl || req.user.resume) {
      applicationData.resume = req.user.resumeUrl || req.user.resume;
      applicationData.resumeUrl = req.user.resumeUrl || req.user.resume;
      applicationData.resumeName = req.user.resumeName || 'Resume.pdf';
    } else {
      return res.status(400).json({ success: false, message: 'Please upload a resume.' });
    }

    const application = await Application.create(applicationData);

    // Notify Employer
    await createNotification(req, {
      recipient: job.postedBy,
      title: 'New Application',
      message: `${req.user.name} applied for your ${job.title} job.`,
      type: 'application',
      link: `/dashboard/applications/review/${job._id}`
    });

    // Notify Applicant (Self)
    await createNotification(req, {
      recipient: req.user._id,
      title: 'Application Submitted',
      message: `You successfully applied for "${job.title}".`,
      type: 'application',
      link: `/dashboard/applications`
    });

    // Increment applications count
    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicationsCount: 1 } });

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my applications (Job Seeker)
// @route   GET /api/applications/my
// @access  Private (Job Seeker)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'postedBy', select: 'companyName companyLogo' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job (Employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
export const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone skills experience education resume resumeUrl profilePicture')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Employer)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, employerNotes } = req.body;

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Only the employer who posted the job can update
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    application.status = status;
    if (employerNotes) application.employerNotes = employerNotes;
    await application.save();

    // Notify Applicant
    await createNotification(req, {
      recipient: application.applicant,
      title: 'Application Status Updated',
      message: `Your application status for ${application.job.title} has been updated to ${status}.`,
      type: 'status_update',
      link: `/applications/${application._id}`
    });

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if user has applied
// @route   GET /api/applications/check/:jobId
// @access  Private
export const checkApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    res.json({
      success: true,
      hasApplied: !!application,
      application: application || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'job',
        populate: { path: 'postedBy', select: 'companyName companyLogo' }
      })
      .populate('applicant', 'name email phone skills experience education resume resumeUrl profilePicture');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Check if authorized (either applicant or employer)
    const isApplicant = application.applicant._id.toString() === req.user._id.toString();
    const isEmployer = application.job.postedBy._id.toString() === req.user._id.toString();

    if (!isApplicant && !isEmployer) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};
// @desc    Get recent applications for all employer's jobs
// @route   GET /api/applications/employer/recent
// @access  Private (Employer)
export const getRecentEmployerApplications = async (req, res, next) => {
  try {
    // 1. Find all jobs posted by this employer
    const myJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = myJobs.map(j => j._id);

    // 2. Find applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title')
      .populate('applicant', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};
// @desc    Download resume with proxy to avoid corruption
// @route   GET /api/applications/download
// @access  Public (protected by signed URL logic if needed, but for now we trust the Cloudinary URL)
export const downloadResume = async (req, res, next) => {
  try {
    const { url, filename } = req.query;
    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    // Detect extension from URL or use provided filename
    const urlParts = url.split('.');
    const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split('?')[0] : 'pdf';
    
    const safeFilename = (filename || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
    const finalFilename = `${safeFilename}.${extension}`;

    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"`);
    
    response.data.pipe(res);
  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).json({ success: false, message: 'Failed to download file' });
  }
};
