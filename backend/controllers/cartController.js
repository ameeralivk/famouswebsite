import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

// GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json({ cart });
  } catch (err) {
    next(err);
  }
};

// POST /api/cart/items
export const addItem = async (req, res, next) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const variant = product.variants.id(variantId);
    if (!variant || !variant.isActive) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    if (variant.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock for this variant' });
    }

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find((i) => i.variantId.toString() === variantId);

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        variantId: variant._id,
        variantName: variant.variantName,
        sku: variant.sku,
        image: variant.images?.[0] || product.mainImage || '',
        quantity,
        priceAtAdd: product.getVariantPrice(variant._id)
      });
    }

    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    next(err);
  }
};

// PUT /api/cart/items/:itemId
export const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'quantity must be at least 1' });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart/items/:itemId
export const removeItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.appliedCoupon = null;
    await cart.save();
    res.status(200).json({ cart });
  } catch (err) {
    next(err);
  }
};
