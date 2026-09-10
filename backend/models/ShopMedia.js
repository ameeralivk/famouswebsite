import mongoose from 'mongoose';

const shopMediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('ShopMedia', shopMediaSchema);
