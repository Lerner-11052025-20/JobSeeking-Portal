import express from 'express';
import { chatWithAI } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow public access to Chat, but you could optionally use 'protect' 
// depending on whether guests should use the AI or not.
// We'll allow public but use context if token is present.
router.post('/', chatWithAI);

export default router;
