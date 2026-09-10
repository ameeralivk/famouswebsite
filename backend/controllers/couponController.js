import Coupon from '../models/Coupon.js';

// POST /api/coupons (Admin)
export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountAmount,
      validFrom,
      validUntil,
      usageLimit
    } = req.body;

    if (!code || !discountType || discountValue == null || !validUntil) {
      return res
        .status(400)
        .json({ message: 'code, discountType, discountValue and validUntil are required' });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountAmount,
      validFrom,
      validUntil,
      usageLimit
    });

    res.status(201).json({ coupon });
  } catch (err) {
    next(err);
  }
};

// GET /api/coupons (Admin)
export const getCoupons = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const [coupons, total] = await Promise.all([
      Coupon.find()
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Coupon.countDocuments()
    ]);

    res.status(200).json({
      coupons,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum }
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/coupons/:id (Admin)
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json({ coupon });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/coupons/:id (Admin)
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json({ message: 'Coupon deactivated', coupon });
  } catch (err) {
    next(err);
  }
};

// POST /api/coupons/apply - validate coupon against cart value
export const applyCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || cartTotal == null) {
      return res.status(400).json({ message: 'code and cartTotal are required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.isValidNow()) {
      return res.status(400).json({ message: 'This coupon is not currently valid' });
    }

    if (cartTotal < coupon.minOrderValue) {
      return res
        .status(400)
        .json({ message: `Minimum order value of ${coupon.minOrderValue} required for this coupon` });
    }

    const discountAmount = coupon.calculateDiscount(cartTotal);

    res.status(200).json({
      valid: true,
      code: coupon.code,
      discountAmount,
      newTotal: Math.round((cartTotal - discountAmount) * 100) / 100
    });
  } catch (err) {
    next(err);
  }
};
