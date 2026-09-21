import { sponsorsByTier } from '../../data/sponsors';
import { ExternalLink } from 'lucide-react';

export default function SponsorGrid({ compact = false }) {
  const tiersToRender = compact ? sponsorsByTier.slice(0, 2) : sponsorsByTier;

  return (
    <div className="sponsors-wrapper">
      {tiersToRender.map((tierGroup, idx) => (
        <div key={idx} className="sponsors-tier-block">
          <h3 className="tier-heading">{tierGroup.tier}</h3>
          <p className="tier-subtext">{tierGroup.description}</p>

          <div className="sponsors-grid">
            {tierGroup.sponsors.map((sponsor, sIdx) => (
              <a
                key={sIdx}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-card"
                aria-label={`Visit ${sponsor.name}`}
              >
                <div className="sponsor-logo-text">{sponsor.logoText}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  {sponsor.category}
                </div>
                {!compact && (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {sponsor.description}
                  </p>
                )}
                <div style={{ marginTop: 'auto', paddingTop: '8px', color: 'var(--text-dim)' }}>
                  <ExternalLink size={14} />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
