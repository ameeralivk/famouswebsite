import express from 'express';
import { getShopMedia, createShopMedia, deleteShopMedia } from '../controllers/shopMediaController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getShopMedia);
router.post('/', verifyToken, isAdmin, createShopMedia);
router.delete('/:id', verifyToken, isAdmin, deleteShopMedia);

export default router;
