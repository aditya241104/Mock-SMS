import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshToken,
  logoutUser
} from '../Controllers/authController.js';
import { authenticateUser, authenticateRefreshToken } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', authenticateRefreshToken, refreshToken);
router.post('/logout', authenticateUser, logoutUser);
router.get('/me', authenticateUser, getCurrentUser);

export default router;