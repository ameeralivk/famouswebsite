import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import OrderStatusTracker from '../components/orders/OrderStatusTracker.jsx';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-10 h-96 bg-ink-100 rounded-2xl animate-pulse" />;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-500 font-medium">Order not found.</p>
        <Link to="/orders" className="text-brand-600 font-semibold hover:underline mt-2 inline-block">
          Back to my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/orders" className="text-xs text-ink-400 hover:text-brand-600 transition-colors flex items-center gap-1 mb-6">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        My Orders
      </Link>

      <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-7">
          <div>
            <h1 className="text-xl font-display font-bold text-ink-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-xs text-ink-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 shrink-0">
            {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
          </span>
        </div>

        <div className="mb-8">
          <OrderStatusTracker status={order.status} />
        </div>

        <div className="border-t border-ink-100 pt-5">
          <h2 className="text-sm font-semibold text-ink-700 mb-3">Items</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-11 h-11 rounded-lg bg-ink-50 border border-ink-100 shrink-0 overflow-hidden">
                  {item.image && <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-ink-700 truncate">{item.productName}</p>
                  <p className="text-xs text-ink-400">{item.variantName} &times; {item.quantity}</p>
                </div>
                <span className="text-ink-800 font-medium tabular-nums shrink-0">₹{item.lineTotal}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-ink-100 mt-4 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-ink-500">
              <span>Subtotal</span>
              <span className="tabular-nums">₹{order.itemsSubtotal}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount {order.appliedCoupon?.code ? `(${order.appliedCoupon.code})` : ''}</span>
                <span className="tabular-nums">-₹{order.discountTotal}</span>
              </div>
            )}
            <div className="flex justify-between font-display font-bold text-ink-900 text-base pt-1">
              <span>Total</span>
              <span className="tabular-nums">₹{order.grandTotal}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-100 mt-6 pt-5 text-sm text-ink-600">
          <p className="font-semibold text-ink-800 mb-1">Delivery Address</p>
          <p>
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
          <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
