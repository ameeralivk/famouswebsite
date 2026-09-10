import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import AdminStats from '../../components/admin/AdminStats.jsx';
import RevenueChart from '../../components/admin/RevenueChart.jsx';
import OrderStatusChart from '../../components/admin/OrderStatusChart.jsx';

const RANGE_OPTIONS = [
  { value: '7', label: '7 Days' },
  { value: '30', label: '30 Days' },
  { value: '90', label: '90 Days' },
  { value: 'all', label: 'All Time' }
];

const emptySummary = {
  totalRevenue: 0,
  totalOrders: 0,
  pendingOrders: 0,
  totalProducts: 0,
  activeCoupons: 0
};

const AdminDashboard = () => {
  const [range, setRange] = useState('30');
  const [summary, setSummary] = useState(emptySummary);
  const [trend, setTrend] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/stats/dashboard', { params: { range } })
      .then(({ data }) => {
        setSummary(data.summary);
        setTrend(data.trend);
        setStatusBreakdown(data.statusBreakdown);
      })
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-display font-bold text-ink-900">Dashboard Overview</h1>

        <div className="flex gap-1.5 bg-white border border-ink-200 rounded-full p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                range === opt.value ? 'bg-brand-gradient text-white shadow-card' : 'text-ink-500 hover:text-ink-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-ink-100 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid lg:grid-cols-[1fr_320px] gap-4">
            <div className="h-72 bg-ink-100 rounded-2xl animate-pulse" />
            <div className="h-72 bg-ink-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          <AdminStats stats={summary} />

          <div className="grid lg:grid-cols-[1fr_320px] gap-4">
            <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-5 sm:p-6">
              <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wide mb-4">Revenue Trend</h2>
              <RevenueChart data={trend} />
            </div>

            <div className="bg-white border border-ink-100 rounded-2xl shadow-card p-5 sm:p-6">
              <h2 className="text-sm font-bold text-ink-900 uppercase tracking-wide mb-4">Orders by Status</h2>
              <OrderStatusChart data={statusBreakdown} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
