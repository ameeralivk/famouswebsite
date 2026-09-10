import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import WhatsAppIcon from '../components/common/WhatsAppIcon.jsx';
import { buildOrderWhatsAppMessage, getWhatsAppUrl } from '../utils/whatsapp.js';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 h-80 bg-ink-100 rounded-2xl animate-pulse" />;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-500 font-medium">Order not found.</p>
        <Link to="/shop" className="text-brand-600 font-semibold hover:underline mt-2 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  const whatsappUrl = getWhatsAppUrl(buildOrderWhatsAppMessage(order));

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="text-2xl font-display font-bold text-ink-900 mb-1.5">Order Placed!</h1>
        <p className="text-sm text-ink-500 mb-6">
          Order #{order._id.slice(-8).toUpperCase()} &middot; Pay with Cash on Delivery
        </p>

        <div className="text-left bg-ink-50 rounded-xl p-5 space-y-3 mb-6">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center text-sm gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-ink-100 shrink-0 overflow-hidden">
                {item.image && <img src={item.image} alt={item.variantName} className="w-full h-full object-cover" />}
              </div>
              <span className="text-ink-600 flex-1 min-w-0">{item.variantName} &times; {item.quantity}</span>
              <span className="text-ink-800 font-medium tabular-nums shrink-0">₹{item.lineTotal}</span>
            </div>
          ))}
          <div className="border-t border-ink-200 pt-2.5 flex justify-between font-display font-bold text-ink-900">
            <span>Total</span>
            <span className="tabular-nums">₹{order.grandTotal}</span>
          </div>
        </div>

        <div className="text-left text-sm text-ink-600 mb-7">
          <p className="font-semibold text-ink-800 mb-1">Delivering to:</p>
          <p>
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
          <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:opacity-90 text-white font-semibold rounded-full shadow-card transition"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Confirm on WhatsApp
            </a>
          )}
          <Link
            to="/shop"
            className="flex-1 flex items-center justify-center py-3 border border-ink-200 text-ink-700 font-semibold rounded-full hover:bg-ink-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
