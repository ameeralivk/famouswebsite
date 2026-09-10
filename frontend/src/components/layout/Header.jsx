import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur sticky top-0 z-30 border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center gap-4 justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <span className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center shadow-card shrink-0 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-display font-extrabold text-ink-900 tracking-tight">
              Famous Hardware
            </span>
            <span className="text-[11px] text-brand-600 font-semibold tracking-widest uppercase">
              Kodinhi
            </span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl min-w-[200px] relative">
          <svg viewBox="0 0 24 24" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hardware, sanitary, lighting..."
            className="w-full bg-ink-50 border border-ink-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 focus:bg-white transition"
          />
        </form>

        <div className="flex items-center gap-5 text-sm">
          <Link to="/shop" className="text-ink-600 hover:text-brand-600 font-medium transition-colors hidden sm:inline">
            Shop
          </Link>

          <Link to="/cart" className="flex items-center gap-1.5 text-ink-600 hover:text-brand-600 font-medium transition-colors">
            <span className="relative">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-gradient text-white text-[10px] font-bold flex items-center justify-center shadow-card">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/orders" className="text-ink-600 hover:text-brand-600 font-medium transition-colors hidden sm:inline">
                My Orders
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-ink-600 hover:text-brand-600 font-medium transition-colors hidden sm:inline"
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 pl-3 border-l border-ink-200">
                <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-semibold text-xs flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-ink-500 hidden md:inline">{user.name.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="text-ink-500 hover:text-brand-600 font-medium transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white bg-brand-gradient hover:opacity-90 px-5 py-2.5 rounded-full font-semibold shadow-card transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
