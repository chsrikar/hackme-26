import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('ops.lead@hackme26.dev');
  const [password, setPassword] = useState('hackme_ops_2026');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/');
  };

  const handleQuickDemo = () => {
    setEmail('ops.lead@hackme26.dev');
    setPassword('hackme_ops_2026');
  };

  return (
    <div
      style={{
        maxWidth: '440px',
        width: '100%',
        margin: '0 auto',
        padding: '32px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 16px',
            borderRadius: '14px',
            background: 'var(--color-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)'
          }}
        >
          <QrCode size={30} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Hackathon Operations Panel</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
          Real-time participant check-in, movement passes & food fulfillment
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--status-absent-bg)',
            border: '1px solid var(--status-absent-border)',
            color: 'var(--status-absent-text)',
            fontSize: '0.86rem',
            marginBottom: '18px'
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="ops-email">
            Ops Staff Email
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="ops-email"
              type="email"
              required
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ops.lead@hackme26.dev"
            />
            <Mail
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="ops-password">
            Access Key / Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="ops-password"
              type="password"
              required
              className="form-input"
              style={{ width: '100%', paddingLeft: '38px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
            <Lock
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          icon={ArrowRight}
          style={{ width: '100%', marginTop: '8px' }}
        >
          {loading ? 'Authenticating...' : 'Enter Operations Console'}
        </Button>
      </form>

      <div
        style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem'
        }}
      >
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <ShieldCheck size={14} /> Organizer / Volunteer Access
        </span>
        <button
          type="button"
          onClick={handleQuickDemo}
          style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline' }}
        >
          Use Demo Credentials
        </button>
      </div>
    </div>
  );
}
