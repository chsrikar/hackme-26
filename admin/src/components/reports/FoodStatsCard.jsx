import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { Utensils, TrendingUp } from 'lucide-react';

export default function FoodStatsCard({ data = [] }) {
  const totalOrders = data.reduce((acc, curr) => acc + (curr.orders || 0), 0);
  const totalDelivered = data.reduce((acc, curr) => acc + (curr.delivered || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ padding: '8px 14px', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Utensils size={18} style={{ color: 'var(--color-primary)' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Meals Served</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{totalDelivered} / {totalOrders} Orders</div>
          </div>
        </div>

        <div style={{ padding: '8px 14px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} style={{ color: '#f59e0b' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#f59e0b', textTransform: 'uppercase' }}>Demand Peak</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Midnight (12 AM - 3 AM)</div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={{ stroke: 'var(--border-strong)' }}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: 'var(--border-strong)' }}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <Tooltip
              formatter={(value, name) => [`${value} meals`, name === 'orders' ? 'Total Requests' : 'Delivered']}
              contentStyle={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '13px'
              }}
            />
            <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders Placed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
