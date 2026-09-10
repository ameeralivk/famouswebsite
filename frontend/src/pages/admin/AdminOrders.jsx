import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import Pagination from '../../components/admin/Pagination.jsx';

const STATUSES = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];

const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700',
  Confirmed: 'bg-blue-50 text-blue-700',
  Delivered: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700'
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    api
      .get('/orders/admin/all', { params: { status: statusFilter, page, limit: 10 } })
      .then(({ data }) => {
        setOrders(data.orders);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, [statusFilter, page]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-display font-bold text-ink-900">Orders</h1>

        <div className="flex gap-1.5 flex-wrap">
          {['All', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusFilterChange(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                statusFilter === s ? 'bg-brand-gradient text-white shadow-card' : 'bg-white border border-ink-200 text-ink-600 hover:border-brand-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-ink-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !orders.length ? (
        <div className="text-center py-16 bg-white border border-ink-100 rounded-2xl shadow-card">
          <p className="text-ink-500 font-medium">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order._id;
            return (
              <div key={order._id} className="bg-white border border-ink-100 rounded-2xl shadow-card overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                  className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-ink-50/60 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-800">
                      #{order._id.slice(-8).toUpperCase()}
                      <span className="text-ink-400 font-normal ml-2 text-sm">{order.user?.name || 'Unknown'}</span>
                    </p>
                    <p className="text-xs text-ink-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      {' · '}
                      {order.paymentMethod}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-display font-bold text-ink-900 tabular-nums hidden sm:inline">₹{order.grandTotal}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-4 h-4 text-ink-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-ink-100 p-5 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Items</p>
                        <div className="space-y-1.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm gap-3">
                              <span className="text-ink-600 truncate">{item.productName} — {item.variantName} &times;{item.quantity}</span>
                              <span className="text-ink-800 font-medium tabular-nums shrink-0">₹{item.lineTotal}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-ink-100 mt-3 pt-3 flex justify-between font-semibold text-ink-900 text-sm">
                          <span>Total</span>
                          <span className="tabular-nums">₹{order.grandTotal}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Delivery Address</p>
                        <p className="text-sm text-ink-600">
                          {order.shippingAddress.line1}
                          {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}, {order.shippingAddress.city},{' '}
                          {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>
                        <p className="text-sm text-ink-600 mt-1">Phone: {order.shippingAddress.phone}</p>
                        {order.user?.email && <p className="text-sm text-ink-600 mt-1">Email: {order.user.email}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-2">
                      <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Update Status</label>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="border border-ink-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition disabled:opacity-50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

export default AdminOrders;
