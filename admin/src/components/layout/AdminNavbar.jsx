import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, LogOut, Radio, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSession } from '../../context/SessionContext';

export default function AdminNavbar() {
  const { faculty, logout } = useAuth();
  const { activeSession } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="admin-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
              justifyContent: 'center'
            }}
          >
            <QrCode size={22} />
          </div>
          <span>Digital Pass Portal</span>
          <span className="tag">FACULTY</span>
        </Link>

        {activeSession && (
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
            <span>SESSION LIVE: {activeSession.classId}</span>
          </Link>
        )}
      </div>

      <div className="admin-nav-right">
        {faculty && (
          <div className="faculty-pill">
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              {faculty.name ? faculty.name.charAt(0) : <User size={16} />}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.86rem', lineHeight: 1.2 }}>
                {faculty.name}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {faculty.department || 'Faculty'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title="Log out"
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
