import { X, Phone } from 'lucide-react';
import { useEffect } from 'react';

export default function ContactModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contacts = [
    { name: 'Sal Sabeel', phone: '91882 68972' },
    { name: 'Parthiv Das', phone: '85476 37499' },
    { name: 'Nandhana Ajeesh', phone: '70125 87783' }
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Modal Card */}
      <div
        className="clip-pixel-corners"
        style={{
          position: 'relative',
          background: 'rgba(18, 18, 24, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(242, 98, 7, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(242, 98, 7, 0.2)',
          maxWidth: '480px',
          width: '100%',
          padding: '32px',
          animation: 'slideIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10000,
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(242, 98, 7, 0.3)';
            e.currentTarget.style.borderColor = 'var(--color-overmind-orange)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <span
            className="pixel-tag"
            style={{
              color: 'var(--color-overmind-orange)',
              borderColor: 'rgba(242, 98, 7, 0.4)',
              background: 'rgba(242, 98, 7, 0.1)',
              marginBottom: '12px',
              display: 'inline-block'
            }}
          >
            TEAM CONTACT // ENQUIRIES
          </span>
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '8px'
            }}
          >
            For enquiries, contact:
          </h2>
        </div>

        {/* Contact Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {contacts.map((contact, idx) => (
            <div
              key={idx}
              className="clip-pixel-corners"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(242, 98, 7, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(242, 98, 7, 0.4)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'rgba(242, 98, 7, 0.2)',
                  border: '1px solid rgba(242, 98, 7, 0.4)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Phone size={18} color="var(--color-overmind-orange)" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '1rem',
                    marginBottom: '2px'
                  }}
                >
                  {contact.name}
                </div>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  style={{
                    color: 'var(--color-overmind-orange)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
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
      </div>
    </div>
  );
}
