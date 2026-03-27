import Job from '../models/Job.js';
import { createNotification } from './notificationController.js';

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Employer)
export const createJob = async (req, res, next) => {
  try {
    req.body.postedBy = req.user._id;
    req.body.company = req.user.companyName || req.body.company;
    req.body.companyLogo = req.user.companyLogo || req.body.companyLogo;

    const job = await Job.create(req.body);

    // Notify Employer (Self)
    await createNotification(req, {
      recipient: req.user._id,
      title: 'Job Posted',
      message: `Your job posting for "${job.title}" is now active.`,
      type: 'job_alert',
      link: `/jobs/${job._id}`
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (with search & filters)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      jobType,
      category,
      experience,
      salaryMin,
      salaryMax,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'active' };

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filters
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (category) query.category = category;
    if (experience) query.experience = experience;
    if (salaryMin || salaryMax) {
      query['salary.min'] = {};
      if (salaryMin) query['salary.min'].$gte = Number(salaryMin);
      if (salaryMax) query['salary.max'] = { $lte: Number(salaryMax) };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: latest
    if (sort === 'salary') sortOption = { 'salary.max': -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('postedBy', 'name companyName companyLogo')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      jobs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email companyName companyLogo companyDescription companyWebsite');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer - owner)
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job.' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Notify Employer (Self)
    await createNotification(req, {
      recipient: req.user._id,
      title: 'Job Updated',
      message: `Changes to "${job.title}" have been saved.`,
      type: 'job_alert',
      link: `/jobs/${job._id}`
    });

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer - owner)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job.' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/my/posted
// @access  Private (Employer)
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured/trending jobs
// @route   GET /api/jobs/featured/list
// @access  Public
export const getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'active' })
      .populate('postedBy', 'name companyName companyLogo')
      .sort({ applicationsCount: -1 })
      .limit(8);

    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job counts by category
// @route   GET /api/jobs/stats/categories
// @access  Public
export const getCategoryStats = async (req, res, next) => {
  try {
    const stats = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};
