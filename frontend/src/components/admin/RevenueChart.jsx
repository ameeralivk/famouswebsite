import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-ink-100 rounded-xl shadow-card-hover px-3.5 py-2.5 text-xs">
      <p className="font-semibold text-ink-800 mb-1">{formatDate(label)}</p>
      <p className="text-brand-600 font-medium">Revenue: ₹{payload[0]?.value?.toLocaleString('en-IN')}</p>
      <p className="text-ink-500">Orders: {payload[0]?.payload?.orders}</p>
    </div>
  );
};

const RevenueChart = ({ data }) => {
  if (!data?.length) {
    return (
      <div className="h-72 flex items-center justify-center text-sm text-ink-400">
        No orders in this period yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={288}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2.5} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
