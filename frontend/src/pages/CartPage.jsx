import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    setLoading(true);
    api
      .get('/cart')
      .then(({ data }) => setCart(data.cart))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    await api.put(`/cart/items/${itemId}`, { quantity });
    loadCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/items/${itemId}`);
    loadCart();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4 animate-pulse">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-24 bg-ink-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  const total = cart?.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0).toFixed(2) || '0.00';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-display font-bold text-ink-900 mb-7">Your Cart</h1>

      {!cart?.items.length ? (
        <div className="flex flex-col items-center text-center py-16 gap-3 bg-white border border-ink-100 rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-ink-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-ink-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <p className="text-ink-600 font-medium">Your cart is empty</p>
          <Link to="/" className="text-brand-600 font-semibold hover:underline text-sm">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-white border border-ink-100 rounded-2xl p-4 shadow-card">
              <div>
                <p className="font-semibold text-ink-800">{item.variantName}</p>
                <p className="text-xs text-ink-400 mt-0.5">SKU: {item.sku}</p>
                <p className="text-sm font-medium text-ink-700 mt-1.5">₹{item.priceAtAdd} each</p>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                  className="w-16 border border-ink-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                />
                <button onClick={() => removeItem(item._id)} className="text-red-500 text-sm font-medium hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-5 mt-3 border-t border-ink-200">
            <span className="text-lg font-display font-bold text-ink-900">Total: ₹{total}</span>
            <button className="px-8 py-3 bg-brand-gradient hover:opacity-90 text-white font-semibold rounded-full shadow-card transition">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
