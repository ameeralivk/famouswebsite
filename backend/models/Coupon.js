import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, default: null }, // cap for percentage discounts
    validFrom: { type: Date, required: true, default: Date.now },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

couponSchema.methods.isValidNow = function isValidNow() {
  const now = new Date();
  if (!this.isActive) return false;
  if (now < this.validFrom || now > this.validUntil) return false;
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) return false;
  return true;
};

couponSchema.methods.calculateDiscount = function calculateDiscount(cartTotal) {
  if (cartTotal < this.minOrderValue) return 0;
  let discount =
    this.discountType === 'percentage' ? (cartTotal * this.discountValue) / 100 : this.discountValue;
  if (this.maxDiscountAmount != null) {
    discount = Math.min(discount, this.maxDiscountAmount);
  }
  return Math.min(Math.round(discount * 100) / 100, cartTotal);
};

export default mongoose.model('Coupon', couponSchema);
