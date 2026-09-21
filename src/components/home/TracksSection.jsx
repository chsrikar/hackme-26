import { tracks } from '../../data/tracks';
import { Bot, Sparkles, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import PixelButton from '../common/PixelButton';

const iconMap = {
  Bot: <Bot size={22} color="#38bdf8" />,
  Sparkles: <Sparkles size={22} color="#00ff80" />,
  Cpu: <Cpu size={22} color="var(--color-overmind-orange)" />,
  ShieldCheck: <ShieldCheck size={22} color="#a855f7" />
};

export default function TracksSection() {
  return (
    <section className="page-container" style={{ padding: '60px 0' }} id="tracks-section">
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <span className="pixel-tag" style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)', background: '#0e1822' }}>
          FOUR DOMAINS // CHOOSE YOUR ARENA
        </span>
        <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', color: '#ffffff', fontWeight: 800, marginTop: '10px' }}>
          Pick a track. Build something that ships.
        </h2>
        <p style={{ color: '#d1d5db', fontSize: '1.05rem', maxWidth: '680px', margin: '10px auto 0 auto', lineHeight: 1.6 }}>
          HACK 26 runs across four tracks. Each comes with a problem brief, a starter repo, and a mentor from that domain.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {tracks.map((track) => (
          <div
            key={track.id}
            className="clip-pixel-corners"
            style={{
              background: '#0d0d12',
              border: '1px solid #22222d',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 150ms ease, transform 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = track.color;
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#22222d';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: track.color, background: 'rgba(255,255,255,0.04)', padding: '2px 8px', border: `1px solid ${track.color}40` }}>
                  {track.serial}
                </span>
                <div style={{ padding: '6px', background: '#161620', borderRadius: '4px' }}>
                  {iconMap[track.icon] || <Bot size={20} color={track.color} />}
                </div>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                {track.title}
              </h3>

              <p style={{ fontSize: '0.92rem', color: '#9ca3af', lineHeight: 1.6, marginBottom: '20px' }}>
                {track.shortDescription}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #1c1c24', paddingTop: '14px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                STARTER REPO + MENTOR
              </span>
              <PixelButton href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant="stone" size="sm" target="_blank" rel="noopener noreferrer">
                Apply Track
              </PixelButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
