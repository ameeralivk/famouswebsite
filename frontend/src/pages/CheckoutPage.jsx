import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const inputClass =
  'w-full border border-ink-200 rounded-lg px-3.5 py-2.5 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition';
const labelClass = 'block text-sm font-medium text-ink-700 mb-1.5';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, loading, fetchCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', { shippingAddress: form });
      await fetchCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/order-confirmation/${data.order._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-[1fr_320px] gap-6 animate-pulse">
        <div className="h-96 bg-ink-100 rounded-2xl" />
        <div className="h-56 bg-ink-100 rounded-2xl" />
      </div>
    );
  }

  if (!cart?.items.length) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-500 font-medium">Your cart is empty.</p>
        <Link to="/shop" className="text-brand-600 font-semibold hover:underline mt-2 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-display font-bold text-ink-900 mb-7">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-display font-bold text-ink-900 text-lg mb-1">Delivery Address</h2>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">{error}</div>}

          <div>
            <label className={labelClass}>Address Line 1</label>
            <input name="line1" value={form.line1} onChange={handleChange} required className={inputClass} placeholder="House name/number, street" />
          </div>

          <div>
            <label className={labelClass}>Address Line 2 (optional)</label>
            <input name="line2" value={form.line2} onChange={handleChange} className={inputClass} placeholder="Landmark, area" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input name="city" value={form.city} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input name="state" value={form.state} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pincode</label>
              <input name="pincode" value={form.pincode} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} required className={inputClass} placeholder="10-digit mobile number" />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-ink-700 mb-2">Payment Method</h3>
            <div className="flex items-center gap-2.5 border border-brand-200 bg-brand-50 rounded-lg px-3.5 py-3">
              <span className="w-4 h-4 rounded-full border-2 border-brand-600 bg-brand-600 flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
              <span className="text-sm font-medium text-ink-800">Cash on Delivery</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-6">
          <h2 className="font-display font-bold text-ink-900 text-lg mb-5">Order Summary</h2>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item._id} className="flex items-center gap-2.5 text-sm">
                <div className="w-9 h-9 rounded-lg bg-ink-50 border border-ink-100 shrink-0 overflow-hidden">
                  {item.image && <img src={item.image} alt={item.variantName} className="w-full h-full object-cover" />}
                </div>
                <span className="text-ink-600 line-clamp-1 flex-1 min-w-0">{item.variantName} &times; {item.quantity}</span>
                <span className="text-ink-800 font-medium tabular-nums shrink-0">₹{(item.priceAtAdd * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-ink-100 my-4" />

          <div className="flex justify-between text-sm text-ink-600 mb-2">
            <span>Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''})</span>
            <span className="font-medium text-ink-800 tabular-nums">₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-baseline mt-4 mb-6">
            <span className="font-display font-bold text-ink-900">Total</span>
            <span className="font-display font-extrabold text-xl text-ink-900 tabular-nums">₹{subtotal.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-brand-gradient hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-full shadow-card transition"
          >
            {submitting ? 'Placing Order...' : 'Place Order (COD)'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
