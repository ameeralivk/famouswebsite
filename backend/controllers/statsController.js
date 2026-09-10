import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

const RANGE_DAYS = { '7': 7, '30': 30, '90': 90 };
const STATUSES = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];

// GET /api/stats/dashboard?range=7|30|90|all (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const { range = '30' } = req.query;
    const days = RANGE_DAYS[range];
    const dateFilter = days ? { createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } } : {};

    const [totalProducts, activeCoupons, statusCounts, revenueAgg, trendAgg] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Coupon.countDocuments({ isActive: true }),
      Order.aggregate([{ $match: dateFilter }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } }
      ]),
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            revenue: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 0, '$grandTotal'] } }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const statusMap = Object.fromEntries(statusCounts.map((s) => [s._id, s.count]));
    const statusBreakdown = STATUSES.map((status) => ({ status, count: statusMap[status] || 0 }));
    const totalOrders = statusCounts.reduce((sum, s) => sum + s.count, 0);
    const totalRevenue = Math.round((revenueAgg[0]?.total || 0) * 100) / 100;
    const trend = trendAgg.map((t) => ({
      date: t._id,
      orders: t.orders,
      revenue: Math.round(t.revenue * 100) / 100
    }));

    res.status(200).json({
      summary: {
        totalProducts,
        activeCoupons,
        totalOrders,
        totalRevenue,
        pendingOrders: statusMap.Pending || 0,
        confirmedOrders: statusMap.Confirmed || 0,
        deliveredOrders: statusMap.Delivered || 0,
        cancelledOrders: statusMap.Cancelled || 0
      },
      statusBreakdown,
      trend
    });
  } catch (err) {
    next(err);
  }
};
