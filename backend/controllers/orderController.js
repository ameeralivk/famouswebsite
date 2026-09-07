import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// POST /api/orders - create order from the user's current cart
export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { shippingAddress, paymentMethod = 'COD' } = req.body;
    if (!shippingAddress) {
      return res.status(400).json({ message: 'shippingAddress is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    session.startTransaction();

    const orderItems = [];
    let itemsSubtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product).session(session);
      const variant = product?.variants.id(item.variantId);

      if (!product || !variant || !variant.isActive) {
        throw Object.assign(new Error(`Product/variant unavailable: ${item.variantName}`), {
          statusCode: 400
        });
      }
      if (variant.stockQuantity < item.quantity) {
        throw Object.assign(new Error(`Insufficient stock for ${variant.variantName}`), {
          statusCode: 400
        });
      }

      const unitPrice = product.getVariantPrice(variant._id);
      const lineTotal = Math.round(unitPrice * item.quantity * 100) / 100;

      variant.stockQuantity -= item.quantity;
      await product.save({ session });

      orderItems.push({
        product: product._id,
        variantId: variant._id,
        productName: product.name,
        variantName: variant.variantName,
        sku: variant.sku,
        quantity: item.quantity,
        unitPrice,
        lineTotal
      });

      itemsSubtotal += lineTotal;
    }
    itemsSubtotal = Math.round(itemsSubtotal * 100) / 100;

    let discountTotal = 0;
    let appliedCoupon = { code: null, discountAmount: 0 };

    if (cart.appliedCoupon) {
      const coupon = await Coupon.findById(cart.appliedCoupon).session(session);
      if (coupon && coupon.isValidNow() && itemsSubtotal >= coupon.minOrderValue) {
        discountTotal = coupon.calculateDiscount(itemsSubtotal);
        appliedCoupon = { code: coupon.code, discountAmount: discountTotal };
        coupon.usedCount += 1;
        await coupon.save({ session });
      }
    }

    const grandTotal = Math.round((itemsSubtotal - discountTotal) * 100) / 100;

    const [order] = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          shippingAddress,
          appliedCoupon,
          itemsSubtotal,
          discountTotal,
          grandTotal,
          paymentMethod,
          status: 'Pending'
        }
      ],
      { session }
    );

    cart.items = [];
    cart.appliedCoupon = null;
    await cart.save({ session });

    await session.commitTransaction();
    res.status(201).json({ order });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// GET /api/orders - current user's orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/admin/all (Admin)
export const getAllOrders = async (_req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ orders });
  } catch (err) {
    next(err);
  }
};

// PUT /api/orders/:id/status (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ order });
  } catch (err) {
    next(err);
  }
};
