import { useEffect } from 'react';
import { ArrowRight, X, Layers, Award, Terminal } from 'lucide-react';
import Button from '../common/Button';
import TrackGraphic from './TrackGraphic';

export default function TrackModal({ track, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!track) return null;

  return (
    <div className="denmu-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="denmu-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Denmu Top Close */}
        <button className="denmu-modal-close" onClick={onClose} aria-label="Close track details">
          <X size={16} /> <span>CLOSE</span>
        </button>

        {/* Modal Header Metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <span className="mono-tag" style={{ color: 'var(--color-accent)' }}>{track.serial}</span>
          <span className="mono-tag">{track.genre}</span>
          <span className="mono-tag">{track.date}</span>
        </div>

        {/* Modal Title */}
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '16px', lineHeight: 1.05 }}>
          {track.title}
        </h2>

        {/* Cinematic Graphic Preview */}
        <div style={{ aspectRatio: '16/9', background: '#000', marginBottom: '24px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <TrackGraphic type={track.id} color={track.color} />
        </div>

        {/* Quote */}
        <p style={{ fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '24px', borderLeft: '2px solid var(--text-primary)', paddingLeft: '16px' }}>
          {track.quote}
        </p>

        {/* Description */}
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
          {track.shortDescription}
        </p>

        {/* Problem Statements */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', marginBottom: '28px' }}>
          <div className="mono-tag" style={{ color: 'var(--color-accent)', marginBottom: '12px' }}>
            // RESEARCH PROBLEM STATEMENTS
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {track.problemStatements.map((stmt, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>0{idx + 1}.</span>
                <span>{stmt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Who Should Apply */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', marginBottom: '28px' }}>
          <div className="mono-tag" style={{ marginBottom: '8px' }}>// TARGET HACKER PROFILE</div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            {track.whoShouldApply}
          </p>
        </div>

        {/* Recommended Technologies */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', marginBottom: '36px' }}>
          <div className="mono-tag" style={{ marginBottom: '12px' }}>// RECOMMENDED STACK & APIS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {track.recommendedTech.map((tech, idx) => (
              <span key={idx} style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Action CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="mono-tag" style={{ color: 'var(--color-accent)' }}>TRACK BOUNTY</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{track.bounty}</div>
          </div>
          <Button href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant="primary" size="lg" onClick={onClose} glow target="_blank" rel="noopener noreferrer">
            Register For This Track <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
