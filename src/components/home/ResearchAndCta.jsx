import PixelButton from '../common/PixelButton';
import { ArrowUpRight, ArrowRight, Flame } from 'lucide-react';

export default function ResearchAndCta() {

  const dispatches = [
    {
      num: "01",
      tag: "DISPATCH 01",
      title: "Team Formation & Track Selection Guide",
      desc: "Strategies for assembling 2-5 member squads, balancing frontend, backend, and hardware skills, and choosing your primary innovation track."
    },
    {
      num: "02",
      tag: "DISPATCH 02",
      title: "What to Bring & Venue Logistics",
      desc: "Packing essentials, hardware check-in protocols, campus navigation at VISAT Engineering College, and meal schedules."
    },
    {
      num: "03",
      tag: "DISPATCH 03",
      title: "Judging Rubric Explained",
      desc: "An in-depth guide on how judges weigh technical depth (30%), innovation (30%), working prototype (20%), and UI/UX execution (20%)."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '70px', background: 'transparent' }}>
      {/* 1. Dispatches / Guides Section */}
      <section className="page-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="font-pixel" style={{ color: 'var(--color-overmind-orange)', fontSize: '0.8rem' }}>
              // BUILDER GUIDES
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#ffffff', fontWeight: 800, marginTop: '4px' }}>
              Dispatches & Prep Guides
            </h2>
          </div>

          <span className="font-mono" style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
            Official participant release series
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '18px' }}>
          {dispatches.map((card, idx) => (
            <article
              key={idx}
              className="clip-pixel-corners glass-card glass-card-hover"
              style={{
                padding: 'clamp(18px, 4vw, 24px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="font-pixel" style={{ color: 'var(--color-overmind-orange)', fontSize: '0.75rem' }}>
                    {card.tag}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                    SEPTEMBER 2026
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, lineHeight: 1.35, marginBottom: '10px' }}>
                  {card.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.6 }}>
                  {card.desc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #1c1c24', paddingTop: '14px', marginTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#d1d5db' }}>
                  READ DISPATCH
                </span>
                <ArrowUpRight size={14} color="var(--color-overmind-orange)" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 2. Closing CTA Section */}
      <section className="page-container">
        <div
          className="clip-pixel-corners"
          style={{
            background: 'linear-gradient(180deg, rgba(24, 21, 18, 0.85) 0%, rgba(13, 12, 10, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid var(--color-overmind-orange)',
            padding: 'clamp(36px, 6vw, 60px)',
            textAlign: 'center',
            boxShadow: '0 16px 50px rgba(242, 98, 7, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Flame size={18} color="var(--color-overmind-orange)" />
              <span className="pixel-tag" style={{ color: '#ffffff', background: '#25150c', borderColor: '#f26207' }}>
                CAMPUS SPRINT // VISAT ENGINEERING COLLEGE
              </span>
            </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              color: '#ffffff',
              fontWeight: 800,
              marginBottom: '12px',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase'
            }}
          >
            Ready to build?
          </h2>

          <p
            style={{
              fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)',
              color: '#fbbf24',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              maxWidth: '640px',
              margin: '0 auto 28px auto',
              lineHeight: 1.5
            }}
          >
            24 hours. One team. One idea worth shipping.
          </p>

          <div style={{ marginBottom: '28px' }}>
            <PixelButton href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant="orange" size="lg" icon={<ArrowRight size={16} />} target="_blank" rel="noopener noreferrer">
              Register for HACK 26 &rarr;
            </PixelButton>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '0.92rem',
              color: '#ffffff',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              opacity: 0.85
            }}
          >
            Code • Play • Vibe • Repeat
          </div>
        </div>
      </div>
    </section>
  </div>
);
}
