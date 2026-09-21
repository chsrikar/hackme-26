import { useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

export default function TeamModal({ member, onClose }) {
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

  if (!member) return null;

  return (
    <div className="denmu-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="denmu-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <button className="denmu-modal-close" onClick={onClose} aria-label="Close team member details">
          <X size={16} /> <span>CLOSE</span>
        </button>

        <div className="mono-tag" style={{ color: 'var(--color-accent)', marginBottom: '8px' }}>
          {member.department || member.organization || 'HACKME26 COMMITTEE'}
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '4px', textTransform: 'uppercase' }}>
          {member.name}
        </h2>

        <div className="mono-tag" style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {member.role}
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
            {member.bio}
          </p>
          {member.expertise && (
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderLeft: '2px solid var(--color-accent)', marginTop: '16px' }}>
              <span className="mono-tag" style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>DOMAINS & SPECIALIZATION</span>
              <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{member.expertise}</span>
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="denmu-footer-social-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>↗ LINKEDIN</span>
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="denmu-footer-social-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>↗ X / TWITTER</span>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="denmu-footer-social-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>↗ GITHUB</span>
          </a>
        </div>
      </div>
    </div>
  );
}
