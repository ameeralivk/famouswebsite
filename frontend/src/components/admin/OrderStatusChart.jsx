import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_COLORS = {
  Pending: '#f59e0b',
  Confirmed: '#3b82f6',
  Delivered: '#22c55e',
  Cancelled: '#ef4444'
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { status, count } = payload[0].payload;
  return (
    <div className="bg-white border border-ink-100 rounded-xl shadow-card-hover px-3.5 py-2 text-xs">
      <p className="font-semibold text-ink-800">
        {status}: {count}
      </p>
    </div>
  );
};

const OrderStatusChart = ({ data }) => {
  const total = data?.reduce((sum, d) => sum + d.count, 0) || 0;

  if (!total) {
    return <div className="h-64 flex items-center justify-center text-sm text-ink-400">No orders yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={256}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          iconType="circle"
          formatter={(value) => <span className="text-xs text-ink-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OrderStatusChart;
