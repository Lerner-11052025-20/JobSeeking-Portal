import express from 'express';
import { register, login, logout, getMe, updateProfile, toggleSaveJob, getCompanies, getStats } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }]), updateProfile);
router.put('/save-job/:jobId', protect, authorize('jobseeker'), toggleSaveJob);
router.get('/companies', getCompanies);
router.get('/stats', protect, getStats);

export default router;
