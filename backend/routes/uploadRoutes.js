import express from 'express';
import { uploadImages } from '../controllers/uploadController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/images', verifyToken, isAdmin, upload.array('images', 3), uploadImages);

export default router;
