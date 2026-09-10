import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700',
  Confirmed: 'bg-blue-50 text-blue-700',
  Delivered: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700'
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders')
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-3 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-ink-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-display font-bold text-ink-900 mb-7">My Orders</h1>

      {!orders.length ? (
        <div className="flex flex-col items-center text-center py-20 gap-3 bg-white border border-ink-100 rounded-2xl shadow-card">
          <div className="w-14 h-14 rounded-full bg-ink-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-ink-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7L12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-ink-700 font-semibold">No orders yet</p>
          <Link to="/shop" className="mt-2 text-white bg-brand-gradient font-semibold px-6 py-2.5 rounded-full shadow-card hover:opacity-90 transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="flex items-center justify-between gap-4 bg-white border border-ink-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink-800">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-ink-400 mt-1">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' · '}
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="font-display font-bold text-ink-900 tabular-nums">₹{order.grandTotal}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
