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

router.post('/', authenticateUser, createProject);
router.get('/', authenticateUser, getUserProjects);
router.get('/:id', authenticateUser, getProject);
router.put('/:id', authenticateUser, updateProject);
router.delete('/:id', authenticateUser, deleteProject);

export default router;