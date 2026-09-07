import mongoose from 'mongoose';
import slugify from 'slugify';

const variantSchema = new mongoose.Schema(
  {
    variantName: { type: String, required: true, trim: true }, // e.g. "12W Cool Daylight", "1/2 inch Brass"
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    additionalPrice: { type: Number, default: 0 }, // added on top of product basePrice
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],
    attributes: {
      // free-form key/value pairs, e.g. { size: "12W", color: "Cool Daylight" }
      type: Map,
      of: String,
      default: {}
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, trim: true, default: '' },
    mainImage: { type: String, default: '' }, // primary thumbnail shown in listings before a variant is selected

    basePrice: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, min: 0, max: 100, default: 0 },
    finalPrice: { type: Number, min: 0 }, // computed: basePrice - discount

    variants: {
      type: [variantSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Product must have at least one variant'
      }
    },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    ratings: { type: Number, min: 0, max: 5, default: 0 },
    numReviews: { type: Number, min: 0, default: 0 }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

function computeFinalPrice(basePrice, discountPercentage) {
  const discount = (basePrice * (discountPercentage || 0)) / 100;
  return Math.round((basePrice - discount) * 100) / 100;
}

productSchema.pre('validate', function generateSlugAndPrice(next) {
  if (this.name && (this.isModified('name') || !this.slug)) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }
  this.finalPrice = computeFinalPrice(this.basePrice, this.discountPercentage);
  next();
});

// helper: price for a specific variant (base final price + variant additionalPrice)
productSchema.methods.getVariantPrice = function getVariantPrice(variantId) {
  const variant = this.variants.id(variantId);
  if (!variant) return null;
  const variantBase = this.basePrice + (variant.additionalPrice || 0);
  const discount = (variantBase * (this.discountPercentage || 0)) / 100;
  return Math.round((variantBase - discount) * 100) / 100;
};

export default mongoose.model('Product', productSchema);
