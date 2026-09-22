import { useEffect } from 'react';
import { Shield, Lock, ExternalLink } from 'lucide-react';

export default function AdminPortalPage() {
  useEffect(() => {
    document.title = 'Admin Portal - HackMe\'26';
  }, []);

  const handleAdminAccess = () => {
    // In development, redirect to the admin panel running on port 5174
    // In production, this would point to the deployed admin URL
    const adminUrl = import.meta.env.PROD 
      ? '/admin' 
      : 'http://localhost:5174';
    
    window.open(adminUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page-container" style={{ paddingTop: '6rem', minHeight: '100vh' }}>
      <div className="content-wrapper" style={{ maxWidth: '48rem', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div className="overmind-frame clip-pixel-corners" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <Shield size={48} color="#f26207" strokeWidth={1.5} />
            <Lock size={32} color="#d4af37" strokeWidth={1.5} />
          </div>

          <h1 className="font-pixel glitch-text" style={{ 
            fontSize: '2rem', 
            marginBottom: '1rem',
            color: '#f26207'
          }}>
            Admin Portal Access
          </h1>

          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '1.05rem',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Restricted area for HackMe'26 organizers and operations team.
            This portal provides access to live operations, participant management,
            and real-time event monitoring.
          </p>

          <div style={{ 
            background: 'rgba(242, 98, 7, 0.1)', 
            border: '1px solid rgba(242, 98, 7, 0.3)',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.85)', 
              fontSize: '0.9rem',
              margin: 0
            }}>
              <strong style={{ color: '#f26207' }}>⚠️ Authorization Required:</strong> You must have valid
              admin credentials to access this portal. Unauthorized access attempts are logged.
            </p>
          </div>

          <button
            onClick={handleAdminAccess}
            className="pixel-button-primary clip-pixel-corners"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: '#f26207',
              color: '#ffffff',
              border: '2px solid #d4af37',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d54d00';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(242, 98, 7, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f26207';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Lock size={18} />
            Access Admin Panel
            <ExternalLink size={18} />
          </button>
        </div>

        {/* Features Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div className="overmind-frame clip-pixel-corners" style={{ padding: '1.5rem' }}>
            <h3 className="font-pixel" style={{ 
              fontSize: '1.1rem', 
              marginBottom: '0.75rem',
              color: '#d4af37'
            }}>
              🎯 Live Operations
            </h3>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              Real-time participant tracking, hall pass management, and event monitoring.
            </p>
          </div>

          <div className="overmind-frame clip-pixel-corners" style={{ padding: '1.5rem' }}>
            <h3 className="font-pixel" style={{ 
              fontSize: '1.1rem', 
              marginBottom: '0.75rem',
              color: '#d4af37'
            }}>
              📊 Dashboard & Reports
            </h3>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              Comprehensive analytics, attendance reports, and activity insights.
            </p>
          </div>

          <div className="overmind-frame clip-pixel-corners" style={{ padding: '1.5rem' }}>
            <h3 className="font-pixel" style={{ 
              fontSize: '1.1rem', 
              marginBottom: '0.75rem',
              color: '#d4af37'
            }}>
              🍕 Food & Assistance
            </h3>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              Manage food requests, mentor assistance queue, and participant support.
            </p>
          </div>
        </div>

        {/* System Architecture */}
        <div className="overmind-frame clip-pixel-corners" style={{ 
          padding: '2rem', 
          marginTop: '2rem',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <h3 className="font-pixel" style={{ 
            fontSize: '1.1rem', 
            marginBottom: '1.5rem',
            color: '#d4af37',
            textAlign: 'center'
          }}>
            System Architecture
          </h3>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem',
            background: 'rgba(242, 98, 7, 0.05)',
            border: '1px solid rgba(242, 98, 7, 0.2)',
            fontFamily: 'monospace',
            fontSize: '0.85rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #4a9eff',
                marginBottom: '0.5rem'
              }}>
                <strong style={{ color: '#4a9eff' }}>Main Website</strong>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                  :5173
                </div>
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                Public Access
              </div>
            </div>

            <div style={{ color: '#d4af37', fontSize: '1.5rem' }}>⟷</div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #f26207',
                marginBottom: '0.5rem'
              }}>
                <strong style={{ color: '#f26207' }}>Admin Panel</strong>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                  :5174
                </div>
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                Staff Only
              </div>
            </div>

            <div style={{ color: '#d4af37', fontSize: '1.5rem' }}>⟷</div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #10b981',
                marginBottom: '0.5rem'
              }}>
                <strong style={{ color: '#10b981' }}>Backend API</strong>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
                  :4000
                </div>
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
                Django REST
              </div>
            </div>
          </div>

          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '0.85rem',
            textAlign: 'center',
            marginTop: '1rem',
            marginBottom: 0
          }}>
            All three services communicate via REST API and real-time WebSockets
          </p>
        </div>

        {/* Help Section */}
        <div className="overmind-frame clip-pixel-corners" style={{ 
          padding: '1.5rem', 
          marginTop: '2rem',
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          <h3 className="font-pixel" style={{ 
            fontSize: '1rem', 
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            Need Help?
          </h3>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '0.9rem',
            lineHeight: '1.6',
            marginBottom: '0.5rem'
          }}>
            If you're an organizer without credentials, contact the tech team lead.
            For technical issues with the admin portal, reach out to the development team.
          </p>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.5)', 
            fontSize: '0.85rem',
            margin: 0
          }}>
            🔗 Admin Portal: <code style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '2px 6px',
              borderRadius: '2px',
              color: '#d4af37'
            }}>
              {import.meta.env.PROD ? window.location.origin + '/admin' : 'localhost:5174'}
            </code>
          </p>
        </div>

      </div>
    </div>
  );
}
