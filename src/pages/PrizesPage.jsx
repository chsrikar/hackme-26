import { mainPrizes, trackPrizes, statsSummary } from '../data/prizes';
import { Trophy, Award, Gift, ArrowLeft, Sparkles, CheckCircle2, DollarSign, Lock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import PixelButton from '../components/common/PixelButton';

export default function PrizesPage() {
  // Lock the page - Announced Soon
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

          {/* Announced Soon Card */}
          <div
            className="clip-pixel-corners glass-card"
            style={{
              maxWidth: '680px',
              margin: '20px auto 0 auto',
              padding: 'clamp(28px, 5vw, 64px)',
              textAlign: 'center',
              border: '2px solid rgba(251, 191, 36, 0.4)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(251, 191, 36, 0.2)'
            }}
          >
            {/* Trophy Icon */}
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px auto',
                background: 'rgba(251, 191, 36, 0.15)',
                border: '2px solid rgba(251, 191, 36, 0.4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <Trophy size={40} color="#fbbf24" />
            </div>

            <style>
              {`
                @keyframes pulse {
                  0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
                  }
                  50% {
                    transform: scale(1.05);
                    box-shadow: 0 0 20px 10px rgba(251, 191, 36, 0);
                  }
                }
              `}
            </style>

            {/* Badge */}
            <span
              className="pixel-tag"
              style={{
                color: '#fbbf24',
                borderColor: 'rgba(251, 191, 36, 0.4)',
                background: 'rgba(251, 191, 36, 0.1)',
                marginBottom: '16px',
                display: 'inline-block'
              }}
            >
              PRIZE POOL // ANNOUNCED SOON
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
              Prizes & Rewards
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
              Prize pool details and rewards will be announced soon. Stay tuned for exciting prizes, fellowships, and bounties!
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

            {/* Register Button */}
            <div style={{ marginTop: '32px' }}>
              <PixelButton 
                href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" 
                variant="orange" 
                size="lg" 
                target="_blank"
                rel="noopener noreferrer"
              >
                Register Now (₹50/person)
              </PixelButton>
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
              Follow our updates for prize announcements
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Original prizes page content (will show when isLocked = false)
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
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              className="pixel-tag"
              style={{
                color: '#fbbf24',
                borderColor: 'rgba(251, 191, 36, 0.4)',
                background: '#1a160d'
              }}
            >
              PRIZE POOL // ANNOUNCED SOON
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4.8vw, 3.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              marginBottom: '14px',
              textTransform: 'uppercase'
            }}
          >
            Prizes, Fellowships & Bounties
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#9ca3af',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Rewarding builder excellence with non-dilutive capital, compute infrastructure credits, tier-1 venture interviews, and custom developer hardware.
          </p>
        </div>

        {/* Top Stats Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '48px'
          }}
        >
          <div className="clip-pixel-corners" style={{ background: '#111116', border: '1px solid #252530', padding: '20px', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px' }}>TOTAL VALUE</div>
            <div className="font-pixel" style={{ fontSize: '1.6rem', color: '#fbbf24' }}>$25,000+</div>
          </div>
          <div className="clip-pixel-corners" style={{ background: '#111116', border: '1px solid #252530', padding: '20px', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px' }}>TEAMS ATTENDING</div>
            <div className="font-pixel" style={{ fontSize: '1.6rem', color: '#38bdf8' }}>500+ HACKERS</div>
          </div>
          <div className="clip-pixel-corners" style={{ background: '#111116', border: '1px solid #252530', padding: '20px', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px' }}>GPU VOUCHERS</div>
            <div className="font-pixel" style={{ fontSize: '1.6rem', color: '#00ff80' }}>$5,000 / TEAM</div>
          </div>
          <div className="clip-pixel-corners" style={{ background: '#111116', border: '1px solid #252530', padding: '20px', textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px' }}>TRACK BOUNTIES</div>
            <div className="font-pixel" style={{ fontSize: '1.6rem', color: 'var(--color-overmind-orange)' }}>6 SPECIALIZED</div>
          </div>
        </div>

        {/* Podium Main Prizes (3 Cards) */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#f26207', letterSpacing: '0.06em', marginBottom: '16px' }}>
            // 01. OVERALL CHAMPIONSHIP PODIUM
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {mainPrizes.map((prize, idx) => {
              const isGrand = prize.highlight;
              return (
                <div
                  key={idx}
                  className="clip-pixel-corners"
                  style={{
                    background: isGrand ? 'linear-gradient(180deg, #181512 0%, #100f0d 100%)' : '#0f0f13',
                    border: isGrand ? '2px solid #f26207' : '1px solid #272732',
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isGrand ? '0 12px 40px rgba(242, 98, 7, 0.2)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span
                        className="pixel-tag"
                        style={{
                          color: isGrand ? '#f26207' : '#e5e7eb',
                          borderColor: isGrand ? 'rgba(242, 98, 7, 0.4)' : '#333340',
                          background: isGrand ? '#231710' : '#171720'
                        }}
                      >
                        {prize.rank.toUpperCase()}
                      </span>
                      <Trophy size={24} color={isGrand ? '#fbbf24' : idx === 1 ? '#94a3b8' : '#cd7f32'} />
                    </div>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                      {prize.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '2.4rem', fontWeight: 900, color: isGrand ? '#fbbf24' : '#ffffff', fontFamily: 'var(--font-pixel)' }}>
                        {prize.amount}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#9ca3af' }}>
                        ({prize.cash})
                      </span>
                    </div>

                    <div style={{ borderTop: '1px dashed #2a2a38', paddingTop: '18px', marginBottom: '24px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#e5e7eb', fontWeight: 700, marginBottom: '12px' }}>
                        INCLUDED PERKS & HONORS:
                      </div>
                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {prize.perks.map((perk, pIdx) => (
                          <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#d1d5db', lineHeight: 1.5 }}>
                            <CheckCircle2 size={16} color={isGrand ? '#f26207' : '#38bdf8'} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <PixelButton href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant={isGrand ? 'orange' : 'stone'} size="sm" style={{ width: '100%', textAlign: 'center' }} target="_blank" rel="noopener noreferrer">
                    Compete for {prize.rank}
                  </PixelButton>
                </div>
              );
            })}
          </div>
        </div>

        {/* Specialized Track Bounties */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#00ff80', letterSpacing: '0.06em', marginBottom: '16px' }}>
            // 02. SPECIALIZED TRACK BOUNTIES
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {trackPrizes.map((track, tIdx) => (
              <div
                key={tIdx}
                className="clip-pixel-corners"
                style={{
                  background: '#0e0e12',
                  border: '1px solid #22222a',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="font-pixel" style={{ color: '#fbbf24', fontSize: '1.2rem' }}>
                    {track.amount}
                  </span>
                  <Award size={18} color="#00ff80" />
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                  {track.category}
                </h4>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#f26207', marginBottom: '10px' }}>
                  Grantor: {track.sponsor}
                </div>

                <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
                  {track.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div
          className="clip-pixel-corners bottom-cta-bar"
          style={{
            background: '#121216',
            border: '1px solid #282836',
            padding: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              All Participants Receive Exclusive Welcome Kits
            </h4>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
              Custom HACKME'26 mechanical keycap, developer badge, sticker pack, and $500 in cloud compute credits upon arrival.
            </p>
          </div>
          <PixelButton href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant="orange" size="md" target="_blank" rel="noopener noreferrer">
            Register Now
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
