import express from 'express';
import {
  createApiKey,
  getProjectApiKeys,
  updateApiKey,
  deleteApiKey
} from '../Controllers/apiKeyController.js';
import { authenticateUser, authenticateApiKey } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:projectId', authenticateUser, createApiKey);
router.get('/:projectId', authenticateUser, getProjectApiKeys);
router.put('/:id', authenticateUser, updateApiKey);
router.delete('/:id', authenticateUser, deleteApiKey);

export default router;