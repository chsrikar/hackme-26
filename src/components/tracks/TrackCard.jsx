import TrackGraphic from './TrackGraphic';
import { ArrowUpRight } from 'lucide-react';

export default function TrackCard({ track, onSelect }) {
  return (
    <article
      className="overmind-feature-box clip-pixel-corners"
      onClick={() => onSelect && onSelect(track)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(track);
        }
      }}
      aria-label={`View track details for ${track.title}`}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: '#0d0d10',
        transition: 'all 150ms ease'
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderRadius: '2px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <TrackGraphic type={track.id} color={track.color} />
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <span className="pixel-tag pixel-tag-green" style={{ fontSize: '0.72rem' }}>
            {track.serial || 'TRACK // CS-26'}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
          <span className="pixel-tag pixel-tag-stone" style={{ fontSize: '0.7rem' }}>
            {track.prize || '$5,000 BOUNTY'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-copper-400)' }}>
          {track.genre?.toUpperCase() || 'SYSTEMS TRACK'}
        </span>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: '#78716c' }}>
          {track.date || '36-HR SPRINT'}
        </span>
      </div>

      <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 700, lineHeight: 1.25 }}>
        {track.title}
      </h3>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
        {track.quote || track.shortDesc}
      </p>

      <div style={{ borderTop: '1px solid var(--border-stone)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--color-phosphor)' }}>
          INSPECT SPECIFICATION
        </span>
        <ArrowUpRight size={16} color="var(--color-phosphor)" />
      </div>
    </article>
  );
}
