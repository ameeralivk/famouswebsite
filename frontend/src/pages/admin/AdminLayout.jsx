import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { to: '/admin/dashboard', label: 'Overview', end: true, icon: 'M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6' },
  { to: '/admin/products', label: 'Products', icon: 'M20 7L12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { to: '/admin/categories', label: 'Categories', icon: 'M4 6h16M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z' },
  { to: '/admin/coupons', label: 'Coupons', icon: 'M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L3 3v6.59a2 2 0 0 0 .59 1.41l9.59 9.59a2 2 0 0 0 2.82 0l4.59-4.59a2 2 0 0 0 0-2.82zM7 7h.01' }
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-ink-50 font-sans">
      <header className="bg-ink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-lg bg-brand-gradient flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display font-bold text-sm">Famous Hardware</span>
              <span className="text-[10px] text-ink-400 uppercase tracking-widest">Admin Panel</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-ink-300 hover:text-white font-medium transition-colors">
              View Store
            </Link>
            <span className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 font-semibold text-xs flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
            <button onClick={handleLogout} className="text-ink-300 hover:text-white font-medium transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-brand-gradient text-white shadow-card' : 'text-ink-600 hover:bg-white hover:shadow-card'
                }`
              }
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
            </NavLink>
          ))}
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
