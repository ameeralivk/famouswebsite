import Product from '../models/Product.js';
import Category from '../models/Category.js';

// GET /api/products
// Public catalog with category filtering, search, pagination, sorting.
export const getProducts = async (req, res, next) => {
  try {
    const {
      category, // slug or ObjectId
      search,
      minPrice,
      maxPrice,
      sort = '-createdAt',
      page = 1,
      limit = 12,
      featured,
      onSale,
      inStock
    } = req.query;

    const filter = { isActive: true };

    if (category) {
      const cat = await Category.findOne({
        $or: [{ slug: category }, { _id: /^[a-f\d]{24}$/i.test(category) ? category : null }]
      });
      if (cat) filter.category = cat._id;
      else filter.category = null; // no matching category -> empty result set
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter.finalPrice = {};
      if (minPrice) filter.finalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (onSale === 'true') {
      filter.discountPercentage = { $gt: 0 };
    }

    if (inStock === 'true') {
      filter['variants.stockQuantity'] = { $gt: 0 };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter)
    ]);

    res.status(200).json({
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
      'category',
      'name slug'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const variantsWithPrice = product.variants.map((v) => ({
      ...v.toObject(),
      price: product.getVariantPrice(v._id)
    }));

    res.status(200).json({ product: { ...product.toObject(), variants: variantsWithPrice } });
  } catch (err) {
    next(err);
  }
};

// POST /api/products (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, brand, mainImage, basePrice, discountPercentage, variants, isFeatured } =
      req.body;

    if (!name || !category || basePrice == null) {
      return res.status(400).json({ message: 'Name, category and basePrice are required' });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: 'At least one variant is required' });
    }

    for (const v of variants) {
      if (!v.variantName || !v.sku || v.stockQuantity == null) {
        return res
          .status(400)
          .json({ message: 'Each variant requires variantName, sku and stockQuantity' });
      }
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const product = await Product.create({
      name,
      description,
      category,
      brand,
      mainImage,
      basePrice,
      discountPercentage: discountPercentage || 0,
      variants,
      isFeatured: !!isFeatured
    });

    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id (Admin) - update product fields and/or variant inventory
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatableFields = [
      'name',
      'description',
      'category',
      'brand',
      'mainImage',
      'basePrice',
      'discountPercentage',
      'isFeatured',
      'isActive'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Full variant replacement
    if (Array.isArray(req.body.variants)) {
      product.variants = req.body.variants;
    }

    // Targeted inventory/price patch for a single variant, e.g.
    // { variantUpdate: { variantId, stockQuantity, additionalPrice } }
    if (req.body.variantUpdate) {
      const { variantId, stockQuantity, additionalPrice, isActive } = req.body.variantUpdate;
      const variant = product.variants.id(variantId);
      if (!variant) {
        return res.status(404).json({ message: 'Variant not found' });
      }
      if (stockQuantity !== undefined) variant.stockQuantity = stockQuantity;
      if (additionalPrice !== undefined) variant.additionalPrice = additionalPrice;
      if (isActive !== undefined) variant.isActive = isActive;
    }

    await product.save();
    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id (Admin) - soft delete by default, hard delete with ?hard=true
export const deleteProduct = async (req, res, next) => {
  try {
    if (req.query.hard === 'true') {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Product not found' });
      return res.status(200).json({ message: 'Product permanently deleted' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deactivated', product });
  } catch (err) {
    next(err);
  }
};
