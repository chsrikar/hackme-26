import { useEffect } from 'react';
import { Shield, Lock, ExternalLink, Activity, BarChart3, Utensils, HelpCircle } from 'lucide-react';

export default function AdminPortalPage() {
  useEffect(() => {
    document.title = 'Admin Portal - HackMe\'26';
  }, []);

  const handleAdminAccess = (e) => {
    if (e) e.preventDefault();
    window.location.href = 'https://admin-kappa-nine-10.vercel.app/login';
  };

  return (
    <div className="page-container admin-portal-page" style={{ paddingTop: '6rem', minHeight: '100vh' }}>
      <div className="content-wrapper admin-portal-wrapper">

        {/* Header Hero Section */}
        <div
          className="glass-card clip-pixel-corners admin-portal-hero"
          style={{
            padding: 'clamp(1.75rem, 5vw, 2.75rem) clamp(1rem, 4vw, 2.5rem)',
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.85rem',
              marginBottom: '1.25rem'
            }}
          >
            <Shield size={42} color="#f26207" strokeWidth={1.75} />
            <Lock size={28} color="#d4af37" strokeWidth={1.75} />
          </div>

          <h1
            className="font-pixel glitch-text"
            style={{
              fontSize: 'clamp(1.5rem, 6vw, 2.35rem)',
              marginBottom: '0.85rem',
              color: '#f26207',
              lineHeight: 1.25
            }}
          >
            Admin Portal Access
          </h1>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: 'clamp(0.92rem, 2.8vw, 1.05rem)',
              marginBottom: '1.75rem',
              lineHeight: 1.6,
              maxWidth: '38rem',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            Restricted operations command center for HackMe'26 organizers and faculty.
            Manage live badge check-ins, multi-type movement passes, and event fulfillment.
          </p>

          <div
            style={{
              background: 'rgba(242, 98, 7, 0.1)',
              border: '1px solid rgba(242, 98, 7, 0.35)',
              padding: 'clamp(0.75rem, 3vw, 1rem)',
              marginBottom: '1.75rem',
              textAlign: 'left',
              borderRadius: '4px'
            }}
          >
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.88)',
                fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                margin: 0,
                lineHeight: 1.5
              }}
            >
              <strong style={{ color: '#f26207' }}>⚠️ Authorization Required:</strong> Valid
              organizer credentials required. Direct authentication through secure JWT token session.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <a
              href="https://admin-kappa-nine-10.vercel.app/login"
              onClick={handleAdminAccess}
              className="admin-portal-btn clip-pixel-corners"
            >
              <Lock size={18} />
              <span>Access Admin Panel</span>
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        {/* Features Overview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          <div className="glass-card clip-pixel-corners" style={{ padding: '1.35rem 1.25rem' }}>
            <h3
              className="font-pixel"
              style={{
                fontSize: '1.05rem',
                marginBottom: '0.65rem',
                color: '#d4af37',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Activity size={18} color="#f26207" />
              <span>Live Operations</span>
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.88rem',
                lineHeight: 1.55,
                margin: 0
              }}
            >
              Real-time participant badge scans, multi-type movement passes (Washroom, Rest, Venue), and live desk.
            </p>
          </div>

          <div className="glass-card clip-pixel-corners" style={{ padding: '1.35rem 1.25rem' }}>
            <h3
              className="font-pixel"
              style={{
                fontSize: '1.05rem',
                marginBottom: '0.65rem',
                color: '#d4af37',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <BarChart3 size={18} color="#f26207" />
              <span>Analytics & Logs</span>
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.88rem',
                lineHeight: 1.55,
                margin: 0
              }}
            >
              Instant attendance records, overdue pass tracking, audit trails, and cohort completion stats.
            </p>
          </div>

          <div className="glass-card clip-pixel-corners" style={{ padding: '1.35rem 1.25rem' }}>
            <h3
              className="font-pixel"
              style={{
                fontSize: '1.05rem',
                marginBottom: '0.65rem',
                color: '#d4af37',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Utensils size={18} color="#f26207" />
              <span>Food & Support</span>
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.88rem',
                lineHeight: 1.55,
                margin: 0
              }}
            >
              Manage catering delivery queues, table allocations, and mentor dispatch for student teams.
            </p>
          </div>
        </div>

        {/* System Architecture */}
        <div
          className="glass-card clip-pixel-corners"
          style={{
            padding: 'clamp(1.25rem, 4vw, 2rem)',
            marginBottom: '2rem'
          }}
        >
          <h3
            className="font-pixel"
            style={{
              fontSize: '1.05rem',
              marginBottom: '1.25rem',
              color: '#d4af37',
              textAlign: 'center'
            }}
          >
            System Architecture
          </h3>

          <div className="admin-arch-container clip-pixel-corners">
            <div className="admin-arch-node">
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid #4a9eff',
                  marginBottom: '0.35rem',
                  borderRadius: '4px'
                }}
              >
                <strong style={{ color: '#4a9eff' }}>Main Website</strong>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                  Participant Hub
                </div>
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                Public Portal
              </div>
            </div>

            <div className="admin-arch-arrow-h">⟷</div>
            <div className="admin-arch-arrow-v">↓</div>

            <div className="admin-arch-node">
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid #f26207',
                  marginBottom: '0.35rem',
                  borderRadius: '4px'
                }}
              >
                <strong style={{ color: '#f26207' }}>Admin Ops Panel</strong>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                  QR Scanner & Deck
                </div>
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                Staff Only
              </div>
            </div>

            <div className="admin-arch-arrow-h">⟷</div>
            <div className="admin-arch-arrow-v">↓</div>

            <div className="admin-arch-node">
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid #10b981',
                  marginBottom: '0.35rem',
                  borderRadius: '4px'
                }}
              >
                <strong style={{ color: '#10b981' }}>Backend Engine</strong>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                  Real-time Database
                </div>
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                Live Verification
              </div>
            </div>
          </div>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.82rem',
              textAlign: 'center',
              marginTop: '1rem',
              marginBottom: 0
            }}
          >
            All services communicate via REST API and real-time WebSockets
          </p>
        </div>

        {/* Help & Direct Link Section */}
        <div
          className="glass-card clip-pixel-corners"
          style={{
            padding: 'clamp(1.25rem, 4vw, 1.75rem)',
            background: 'rgba(0, 0, 0, 0.35)'
          }}
        >
          <h3
            className="font-pixel"
            style={{
              fontSize: '0.98rem',
              marginBottom: '0.65rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <HelpCircle size={17} color="#d4af37" />
            <span>Need Help?</span>
          </h3>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              marginBottom: '0.85rem'
            }}
          >
            Authorized staff and organizers can access the ops console with credentials.
            For technical support or issues, reach out to the tech team.
          </p>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.65)',
              fontSize: '0.84rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🔗 Direct Portal:</span>
            <a
              href="https://admin-kappa-nine-10.vercel.app/login"
              onClick={handleAdminAccess}
              className="admin-help-link"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '4px 10px',
                borderRadius: '4px',
                color: '#d4af37',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono, monospace)',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}
            >
              https://admin-kappa-nine-10.vercel.app/login ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
