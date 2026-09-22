import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, LogOut, Sun, Moon, Radio, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOpsSession } from '../../context/OpsSessionContext';

export default function OpsNavbar() {
  const { faculty, logout } = useAuth();
  const { activeDay, theme, toggleTheme, criticalLeftVenueOverdue } = useOpsSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="admin-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" className="admin-nav-brand">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--color-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
            }}
          >
            <QrCode size={22} />
          </div>
          <span>Hackathon Portal</span>
          <span className="tag">OPERATIONS</span>
        </Link>

        {activeDay && (
          <Link
            to="/live"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--status-present-bg)',
              color: 'var(--status-present-text)',
              border: '1px solid var(--status-present-border)',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <Radio size={14} className="animate-pulse" style={{ color: 'var(--status-present-solid)' }} />
            <span>LIVE: {activeDay.code}</span>
          </Link>
        )}

        {criticalLeftVenueOverdue.length > 0 && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #ef4444',
              fontSize: '0.78rem',
              fontWeight: 800,
              animation: 'pulse-red 2s infinite'
            }}
          >
            <ShieldAlert size={14} />
            <span>{criticalLeftVenueOverdue.length} LEFT VENUE OVERDUE</span>
          </div>
        )}
      </div>

      <div className="admin-nav-right">
        {/* Dark / Light Venue Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Venue Night Mode'}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 600
          }}
        >
          {theme === 'dark' ? <Sun size={16} style={{ color: '#f59e0b' }} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Night Mode' : 'Light Mode'}</span>
        </button>

        {/* User Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 12px',
            background: 'var(--bg-surface-secondary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.86rem',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.82rem'
            }}
          >
            A
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.84rem', lineHeight: 1.2 }}>
              {faculty?.name || 'Alex Mercer'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Operations Lead
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
