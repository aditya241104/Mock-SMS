import express from 'express';
import {
  createProject,
  getUserProjects,
  getProject,
  updateProject,
  deleteProject
} from '../Controllers/projectController.js';

import { authenticateUser} from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/projects', authenticateUser, createProject);
router.get('/projects', authenticateUser, getUserProjects);
router.get('/projects/:id', authenticateUser, getProject);
router.put('/projects/:id', authenticateUser, updateProject);
router.delete('/projects/:id', authenticateUser, deleteProject);

export default router;