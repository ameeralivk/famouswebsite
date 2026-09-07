import express from 'express';
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon
} from '../controllers/couponController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply', verifyToken, applyCoupon);
router.get('/', verifyToken, isAdmin, getCoupons);
router.post('/', verifyToken, isAdmin, createCoupon);
router.put('/:id', verifyToken, isAdmin, updateCoupon);
router.delete('/:id', verifyToken, isAdmin, deleteCoupon);

export default router;
