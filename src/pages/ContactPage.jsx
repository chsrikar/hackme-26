import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const contacts = [
    { name: 'Sal Sabeel', phone: '91882 68972' },
    { name: 'Parthiv Das', phone: '85476 37499' },
    { name: 'Nandhana Ajeesh', phone: '70125 87783' }
  ];

  return (
    <div style={{ backgroundColor: '#070708', minHeight: '100vh', color: '#f5f5f4', paddingTop: '40px', paddingBottom: '90px' }}>
      <div className="page-container">
        {/* Back breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#9ca3af',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} /> // HOME TERMINAL
          </Link>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span
              className="pixel-tag"
              style={{
                color: 'var(--color-overmind-orange)',
                borderColor: 'rgba(242, 98, 7, 0.4)',
                background: '#161210'
              }}
            >
              TEAM CONTACT // ENQUIRIES
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            For enquiries, contact:
          </h1>
        </div>

        {/* Contact Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          {contacts.map((contact, idx) => (
            <div
              key={idx}
              className="clip-pixel-corners glass-card glass-card-hover"
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'rgba(242, 98, 7, 0.2)',
                  border: '2px solid rgba(242, 98, 7, 0.4)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Phone size={28} color="var(--color-overmind-orange)" />
              </div>
              <div>
                <h3
                  style={{
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    marginBottom: '8px'
                  }}
                >
                  {contact.name}
                </h3>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  style={{
                    color: 'var(--color-overmind-orange)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ff8c42';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-overmind-orange)';
                  }}
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div
          className="clip-pixel-corners glass-card"
          style={{
            padding: 'clamp(28px, 5vw, 44px)',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <MapPin size={20} color="var(--color-overmind-orange)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Event Location
            </h2>
          </div>
          <p style={{ color: '#d1d5db', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '16px' }}>
            VISAT Engineering College<br />
            Ernakulam, Kerala
          </p>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Mail size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                General Inquiries
              </h3>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.6 }}>
              For sponsorship opportunities, partnership inquiries, or general questions about HackMe'26, please reach out to any of the team members listed above.
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', marginTop: '20px' }}>
            <p
              className="font-pixel"
              style={{
                color: '#00ff80',
                fontSize: '0.85rem',
                textAlign: 'center',
                letterSpacing: '0.05em',
                margin: 0
              }}
            >
              AVAILABLE 24/7 DURING THE EVENT // SEPTEMBER 25-26, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
