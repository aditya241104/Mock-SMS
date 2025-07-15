import express from 'express';
import {
  sendMessage,
  sendOTP,
  verifyOTP,
  getProjectMessages
} from '../Controllers/messageController.js';
import { authenticateUser } from '../Middlewares/authMiddleware.js';
import { authenticateApiKey } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// API Key authenticated routes (external use)
router.post('/send', authenticateApiKey, sendMessage);
router.post('/send-otp', authenticateApiKey, sendOTP);
router.post('/verify-otp', authenticateApiKey, verifyOTP);

// User authenticated routes (internal dashboard use)
router.get('/project/:projectId', authenticateUser, getProjectMessages);

export default router;