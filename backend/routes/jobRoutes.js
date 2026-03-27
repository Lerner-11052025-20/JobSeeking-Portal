import express from 'express';
import {
  createJob, getJobs, getJob, updateJob, deleteJob,
  getMyJobs, getFeaturedJobs, getCategoryStats,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/featured/list', getFeaturedJobs);
router.get('/stats/categories', getCategoryStats);
router.get('/:id', getJob);

// Protected employer routes
router.post('/', protect, authorize('employer'), createJob);
router.get('/my/posted', protect, authorize('employer'), getMyJobs);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

export default router;
