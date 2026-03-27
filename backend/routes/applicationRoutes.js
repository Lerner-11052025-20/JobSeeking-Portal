import express from 'express';
import {
  applyToJob, getMyApplications, getJobApplications,
  updateApplicationStatus, checkApplication, getApplication,
  getRecentEmployerApplications, downloadResume
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public download proxy (Cloudinary files only)
router.get('/download', downloadResume);

// Job Seeker routes
router.post('/:jobId', protect, authorize('jobseeker'), upload.single('resume'), applyToJob);
router.get('/my', protect, authorize('jobseeker'), getMyApplications);
router.get('/check/:jobId', protect, checkApplication);
router.get('/:id', protect, getApplication);

// Employer routes
router.get('/employer/recent', protect, authorize('employer'), getRecentEmployerApplications);
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

export default router;
