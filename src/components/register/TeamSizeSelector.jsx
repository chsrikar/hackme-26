import { Users } from 'lucide-react';

export default function TeamSizeSelector({ value, onChange }) {
  const sizes = [2, 3, 4, 5];

  return (
    <div>
      <div className="team-size-selector-wrap" role="radiogroup" aria-label="Team Size">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={value === size}
            className={`team-size-btn ${value === size ? 'active' : ''}`}
            onClick={() => onChange(size)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Users size={16} />
              <span>{size} {size === 1 ? 'Solo Hacker' : 'Members'}</span>
            </div>
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
        {value === 1 ? 'You are registering as a solo hacker (can still join teams during Friday mixer).' : `Team roster with ${value} confirmed members.`}
      </p>
    </div>
  );
}
