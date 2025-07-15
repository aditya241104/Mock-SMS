import express from 'express';
import {
  createApiKey,
  getProjectApiKeys,
  updateApiKey,
  deleteApiKey
} from '../Controllers/apiKeyController.js';
import { authenticateUser, authenticateApiKey } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/projects/:projectId/api-keys', authenticateUser, createApiKey);
router.get('/projects/:projectId/api-keys', authenticateUser, getProjectApiKeys);
router.put('/api-keys/:id', authenticateUser, updateApiKey);
router.delete('/api-keys/:id', authenticateUser, deleteApiKey);

export default router;