import { UtensilsCrossed, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FoodMenuPage() {
  // Lock the page - Coming Soon
  const isLocked = true;

  if (isLocked) {
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

          {/* Coming Soon Card */}
          <div
            className="clip-pixel-corners glass-card"
            style={{
              maxWidth: '680px',
              margin: '20px auto 0 auto',
              padding: 'clamp(28px, 5vw, 64px)',
              textAlign: 'center',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.2)'
            }}
          >
            {/* Utensils Icon */}
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px auto',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <UtensilsCrossed size={40} color="#10b981" />
            </div>

            <style>
              {`
                @keyframes pulse {
                  0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
                  }
                  50% {
                    transform: scale(1.05);
                    box-shadow: 0 0 20px 10px rgba(16, 185, 129, 0);
                  }
                }
              `}
            </style>

            {/* Badge */}
            <span
              className="pixel-tag"
              style={{
                color: '#10b981',
                borderColor: 'rgba(16, 185, 129, 0.4)',
                background: 'rgba(16, 185, 129, 0.1)',
                marginBottom: '16px',
                display: 'inline-block'
              }}
            >
              FOOD & BEVERAGE MENU // COMING SOON
            </span>

            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '16px',
                letterSpacing: '-0.02em'
              }}
            >
              F&B Menu
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#d1d5db',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '500px',
                margin: '0 auto 28px auto'
              }}
            >
              Complete food and beverage menu will be announced soon. Get ready for delicious meals and refreshments throughout the hackathon!
            </p>

            {/* Event Date Info */}
            <div
              className="clip-pixel-corners"
              style={{
                background: 'rgba(242, 98, 7, 0.05)',
                border: '1px solid rgba(242, 98, 7, 0.2)',
                padding: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}
            >
              <Calendar size={24} color="var(--color-overmind-orange)" />
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.75rem',
                    color: 'var(--color-overmind-orange)',
                    letterSpacing: '0.05em',
                    marginBottom: '4px'
                  }}
                >
                  HACKATHON EVENT
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#ffffff'
                  }}
                >
                  September 25 - 28, 2026
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <p
              className="font-mono"
              style={{
                fontSize: '0.85rem',
                color: '#9ca3af',
                marginTop: '28px'
              }}
            >
              Stay tuned for updates on meals, snacks, and beverages
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Original page content (will show when isLocked = false)
  // TODO: Add actual menu content here when unlocking
  return null;
}
