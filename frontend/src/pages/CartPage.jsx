import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const QuantityStepper = ({ quantity, onChange }) => (
  <div className="flex items-center border border-ink-200 rounded-lg overflow-hidden shrink-0">
    <button
      type="button"
      onClick={() => onChange(quantity - 1)}
      disabled={quantity <= 1}
      className="w-8 h-8 flex items-center justify-center text-ink-500 hover:bg-ink-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      aria-label="Decrease quantity"
    >
      &minus;
    </button>
    <span className="w-9 text-center text-sm font-semibold text-ink-800 tabular-nums">{quantity}</span>
    <button
      type="button"
      onClick={() => onChange(quantity + 1)}
      className="w-8 h-8 flex items-center justify-center text-ink-500 hover:bg-ink-50 transition-colors"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
);

const CartPage = () => {
  const { cart, loading, updateItem, removeItem } = useCart();
  const { showToast } = useToast();

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    updateItem(itemId, quantity);
  };

  const handleRemove = async (item) => {
    try {
      await removeItem(item._id);
      showToast(`${item.variantName} removed from cart`, 'warning');
    } catch {
      showToast('Could not remove item. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1fr_360px] gap-6 animate-pulse">
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-24 bg-ink-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-56 bg-ink-100 rounded-2xl" />
      </div>
    );
  }

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-display font-bold text-ink-900 mb-1">Your Cart</h1>
      <p className="text-sm text-ink-500 mb-7">{itemCount > 0 ? `${itemCount} item${itemCount > 1 ? 's' : ''}` : 'No items yet'}</p>

      {!cart?.items.length ? (
        <div className="flex flex-col items-center text-center py-20 gap-3 bg-white border border-ink-100 rounded-2xl shadow-card">
          <div className="w-14 h-14 rounded-full bg-ink-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-ink-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <p className="text-ink-700 font-semibold">Your cart is empty</p>
          <p className="text-ink-400 text-sm max-w-xs">Browse our hardware, sanitary and lighting collections to find what you need.</p>
          <Link to="/" className="mt-2 text-white bg-brand-gradient font-semibold px-6 py-2.5 rounded-full shadow-card hover:opacity-90 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-white border border-ink-100 rounded-2xl p-4 shadow-card"
              >
                <div className="w-14 h-14 rounded-xl bg-ink-50 border border-ink-100 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-ink-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7L12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-800 truncate">{item.variantName}</p>
                  <p className="text-xs text-ink-400 mt-0.5">SKU: {item.sku}</p>
                  <p className="text-sm font-medium text-ink-700 mt-1">₹{item.priceAtAdd}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <QuantityStepper quantity={item.quantity} onChange={(qty) => updateQuantity(item._id, qty)} />
                  <button
                    onClick={() => handleRemove(item)}
                    className="flex items-center gap-1 text-red-500 text-xs font-medium hover:underline"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 bg-white border border-ink-100 rounded-2xl shadow-card p-6">
            <h2 className="font-display font-bold text-ink-900 text-lg mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''})</span>
                <span className="font-medium text-ink-800 tabular-nums">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-400">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-ink-100 my-5" />

            <div className="flex justify-between items-baseline mb-6">
              <span className="font-display font-bold text-ink-900">Total</span>
              <span className="font-display font-extrabold text-xl text-ink-900 tabular-nums">₹{subtotal.toFixed(2)}</span>
            </div>

            <button className="w-full py-3.5 bg-brand-gradient hover:opacity-90 text-white font-semibold rounded-full shadow-card transition">
              Proceed to Checkout
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-400">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secure checkout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
