import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', verifyToken, isAdmin, getDashboardStats);

export default router;
