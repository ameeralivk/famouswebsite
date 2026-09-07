import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import AdminStats from '../../components/admin/AdminStats.jsx';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, pendingOrders: 0, activeCoupons: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/products', { params: { limit: 1 } }),
      api.get('/orders/admin/all'),
      api.get('/coupons')
    ]).then(([productsRes, ordersRes, couponsRes]) => {
      const orders = ordersRes.data.orders;
      setStats({
        totalProducts: productsRes.data.pagination.total,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === 'Pending').length,
        activeCoupons: couponsRes.data.coupons.filter((c) => c.isActive).length
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-display font-bold text-ink-900 mb-6">Dashboard Overview</h1>
      <AdminStats stats={stats} />
    </div>
  );
};

export default AdminDashboard;
