import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, companyName, companyDescription } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email.',
      });
    }

    // Create user
    const userData = { name, email, password, role };
    if (phone) userData.phone = phone;
    if (role === 'employer') {
      userData.companyName = companyName;
      userData.companyDescription = companyDescription;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Always true for Render HTTPS
      sameSite: 'none', // Required for cross-domain prod cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully.' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'phone', 'bio', 'skills', 'experience',
      'education', 'location', 'companyName', 'companyWebsite',
      'companyDescription',
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Handle file uploads to Cloudinary (Multiple fields)
    if (req.files) {
      if (req.files.resume) {
        updateData.resume = req.files.resume[0].path;
        updateData.resumeUrl = req.files.resume[0].path;
        updateData.resumeName = req.files.resume[0].originalname;
      }
      if (req.files.profilePicture) {
        updateData.profilePicture = req.files.profilePicture[0].path;
      }
    } else if (req.file) {
      // Fallback for single file upload
      updateData.resume = req.file.path;
      updateData.resumeUrl = req.file.path;
      updateData.resumeName = req.file.originalname;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle save job
// @route   PUT /api/auth/save-job/:jobId
// @access  Private (Job Seeker)
export const toggleSaveJob = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;
    const index = user.savedJobs.indexOf(jobId);

    if (index > -1) {
      user.savedJobs.splice(index, 1);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    res.json({
      success: true,
      savedJobs: user.savedJobs,
      message: index > -1 ? 'Job removed from saved.' : 'Job saved successfully.',
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get dashboard statistics
// @route   GET /api/auth/stats
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let stats = {};

    if (req.user.role === 'jobseeker') {
      const applications = await Application.find({ applicant: userId });
      stats = {
        applications: applications.length,
        shortlisted: applications.filter(a => ['accepted', 'shortlisted'].includes(a.status)).length,
        pending: applications.filter(a => a.status === 'pending').length,
        savedJobs: req.user.savedJobs?.length || 0
      };
    } else {
      const myJobs = await Job.find({ postedBy: userId });
      const jobIds = myJobs.map(j => j._id);
      const applicants = await Application.find({ job: { $in: jobIds } });

      stats = {
        activeJobs: myJobs.filter(j => j.status === 'active').length,
        totalApplicants: applicants.length,
        shortlisted: applicants.filter(a => ['accepted', 'shortlisted'].includes(a.status)).length,
        totalPosts: myJobs.length
      };
    }

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies
// @route   GET /api/auth/companies
// @access  Public
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await User.find({ role: 'employer' })
      .select('name companyName companyDescription companyLogo companyWebsite location')
      .sort({ companyName: 1 });
    res.json({ success: true, companies });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  toggleSaveJob,
  getCompanies
};
