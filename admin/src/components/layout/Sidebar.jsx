import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, History, BarChart3, ShieldCheck, Footprints, Utensils } from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';

export default function Sidebar() {
  const { activeDay, activePasses, foodRequests } = useOpsSession();

  const pendingFood = foodRequests.filter((f) => f.status !== 'delivered').length;

  return (
    <aside className="admin-sidebar">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/live"
        className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
      >
        <Radio size={18} style={{ color: activeDay ? 'var(--status-present-solid)' : undefined }} />
        <span>Live Ops Console</span>
        {activeDay && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '999px',
              background: 'var(--status-present-solid)',
              color: '#fff'
            }}
          >
            LIVE
          </span>
        )}
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
      >
        <History size={18} />
        <span>Day Session History</span>
      </NavLink>

      <NavLink
        to="/reports"
        className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
      >
        <BarChart3 size={18} />
        <span>Reports & Analytics</span>
      </NavLink>

      {/* Real-time stats snapshot at bottom of sidebar */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          style={{
            padding: '12px',
            background: 'var(--bg-surface-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Footprints size={14} /> Active Passes
            </span>
            <strong style={{ color: activePasses.length > 0 ? 'var(--color-primary)' : 'var(--text-muted)' }}>
              {activePasses.length} Out
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Utensils size={14} /> Pending Food
            </span>
            <strong style={{ color: pendingFood > 0 ? 'var(--status-warning-solid)' : 'var(--text-muted)' }}>
              {pendingFood} Orders
            </strong>
          </div>
        </div>

        <div style={{ padding: '10px 12px', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
            <ShieldCheck size={14} style={{ color: 'var(--status-present-solid)' }} />
            <span>Venue Safety Protocol</span>
          </div>
          Left-venue passes strictly timeout at 60 mins with automatic escalation.
        </div>
      </div>
    </aside>
  );
}
