const STAT_META = {
  totalRevenue: {
    label: 'Revenue',
    color: 'bg-brand-50 text-brand-600',
    icon: 'M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 1 0-8 0v4h8z',
    format: (v) => `₹${v.toLocaleString('en-IN')}`
  },
  totalOrders: {
    label: 'Total Orders',
    color: 'bg-blue-50 text-blue-600',
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M17 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM9 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'
  },
  pendingOrders: {
    label: 'Pending Orders',
    color: 'bg-amber-50 text-amber-600',
    icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
  },
  totalProducts: {
    label: 'Active Products',
    color: 'bg-purple-50 text-purple-600',
    icon: 'M20 7L12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  activeCoupons: {
    label: 'Active Coupons',
    color: 'bg-green-50 text-green-600',
    icon: 'M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L3 3v6.59a2 2 0 0 0 .59 1.41l9.59 9.59a2 2 0 0 0 2.82 0l4.59-4.59a2 2 0 0 0 0-2.82zM7 7h.01'
  }
};

const StatCard = ({ statKey, value }) => {
  const meta = STAT_META[statKey];
  const display = meta.format ? meta.format(value) : value;
  return (
    <div className="bg-white border border-ink-100 rounded-2xl p-5 shadow-card flex items-start justify-between">
      <div className="min-w-0">
        <p className="text-sm text-ink-500 font-medium">{meta.label}</p>
        <p className="text-2xl sm:text-3xl font-display font-extrabold text-ink-900 mt-1.5 truncate">{display}</p>
      </div>
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={meta.icon} />
        </svg>
      </span>
    </div>
  );
};

const AdminStats = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    <StatCard statKey="totalRevenue" value={stats.totalRevenue} />
    <StatCard statKey="totalOrders" value={stats.totalOrders} />
    <StatCard statKey="pendingOrders" value={stats.pendingOrders} />
    <StatCard statKey="totalProducts" value={stats.totalProducts} />
    <StatCard statKey="activeCoupons" value={stats.activeCoupons} />
  </div>
);

export default AdminStats;
