import { ChevronDown, ArrowRight, Calendar, MapPin, Clock, Award } from 'lucide-react';
import PixelButton from '../common/PixelButton';
import CrtMonitor from './CrtMonitor';

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - var(--nav-height))',
        background: 'transparent',
        paddingTop: 'clamp(20px, 3vh, 36px)',
        paddingBottom: 'clamp(40px, 5vh, 60px)',
        textAlign: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Soft atmospheric gradient behind Hero typography */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at top center, rgba(7, 7, 9, 0.1) 0%, rgba(7, 7, 9, 0.35) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Subtle Starfield Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 140px 90px, #f26207, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 240px 180px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 380px 60px, #38bdf8, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 520px 240px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 680px 120px, #00ff80, rgba(0,0,0,0))
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '800px 500px',
          opacity: 0.4,
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* Main Hero Container */}
      <div className="page-container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Eyebrow */}
        <div style={{ marginBottom: '12px' }}>
          <span
            className="pixel-tag"
            style={{
              color: 'var(--color-overmind-orange)',
              borderColor: 'rgba(242, 98, 7, 0.4)',
              background: 'rgba(20, 16, 12, 0.85)',
              fontSize: 'clamp(0.72rem, 1.1vw, 0.82rem)',
              letterSpacing: '0.06em'
            }}
          >
            Cyborgs · CSE Technical Association presents
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            maxWidth: '960px',
            margin: '0 auto 12px auto',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.9)'
          }}
        >
          HACK 26<br />
          <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--color-overmind-orange)' }}>
            Code. Build. Solve. Innovate.
          </span>
        </h1>

        {/* Subhead */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
            color: '#e5e7eb',
            lineHeight: 1.5,
            maxWidth: '780px',
            margin: '0 auto 16px auto',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
          }}
        >
          A 24-hour hackathon at VISAT Engineering College — with games, music, and a campfire to close it out.
        </p>

        {/* Meta line */}
        <div
          className="hero-meta-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'rgba(18, 18, 24, 0.85)',
            border: '1px solid #282834',
            padding: '8px 12px',
            borderRadius: '4px',
            margin: '0 auto 22px auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.7rem, 1.2vw, 0.88rem)',
            color: '#cbd5e1',
            maxWidth: '95%'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--color-overmind-orange)" />
            <strong>25 & 26 September 2026</strong>
          </span>
          <span style={{ color: '#4b5563' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#38bdf8" />
            <strong>VISAT Engineering College</strong>
          </span>
          <span style={{ color: '#4b5563' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="#00ff80" />
            <strong>24 hours</strong>
          </span>
          <span style={{ color: '#4b5563' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24' }}>
            <Award size={14} color="#fbbf24" />
            <strong>Prizes Announced Soon</strong>
          </span>
        </div>

        {/* Dual Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginBottom: 'clamp(24px, 3.5vh, 38px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <PixelButton
              href="https://forms.gle/Z1KZCfkG4Jqq4eqj9"
              variant="orange"
              size="lg"
              icon={<ArrowRight size={15} />}
              target="_blank"
              rel="noopener noreferrer"
            >
              Register Now &rarr;
            </PixelButton>

            <PixelButton
              to="/schedule"
              variant="stone"
              size="lg"
            >
              View Schedule
            </PixelButton>
          </div>
          
          {/* Registration Fee Info */}
          <div
            className="font-mono"
            style={{
              fontSize: '0.85rem',
              color: '#d1d5db',
              background: 'rgba(18, 18, 24, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '6px 14px',
              borderRadius: '4px'
            }}
          >
            Registration Fee: <strong style={{ color: '#fbbf24' }}>₹50 per person</strong>
          </div>
        </div>

        {/* Vintage Rounded CRT Monitor */}
        <CrtMonitor />
      </div>
    </section>
  );
}
