import { useState } from 'react';
import TeamModal from './TeamModal';
import { organizers, judgesAndMentors } from '../../data/organizers';

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    'ALL',
    'ORGANIZERS',
    'DISCIPLINE',
    'TECHNICAL',
    'ENTERTAINMENT',
    'EVENT VOLUNTEERS',
    'FACULTY'
  ];

  const allMembers = [
    ...organizers,
    ...judgesAndMentors
  ];

  const filteredMembers = activeCategory === 'ALL'
    ? allMembers
    : allMembers.filter((m) => {
        if (activeCategory === 'FACULTY') {
          return m.category === 'Faculty' || Boolean(m.organization);
        }
        return m.category && m.category.toUpperCase() === activeCategory;
      });

  return (
    <section className="page-container container" style={{ paddingBottom: 'var(--space-4xl)' }} id="team-section">
      <div className="denmu-section-header">
        <h2 className="denmu-section-title">THE COMMITTEE & TEAMS</h2>
        <span className="mono-tag">// OPERATORS, TECHNICAL & CREW</span>
      </div>

      {/* Category filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="clip-pixel-corners"
              style={{
                background: isActive ? 'var(--color-overmind-orange)' : '#111116',
                color: isActive ? '#000000' : '#a1a1aa',
                border: `1px solid ${isActive ? 'var(--color-overmind-orange)' : '#262634'}`,
                padding: '6px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="denmu-team-grid">
        {filteredMembers.map((member, idx) => (
          <div
            key={idx}
            className="denmu-team-card"
            onClick={() => setSelectedMember(member)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedMember(member);
              }
            }}
          >
            <div className="denmu-team-name">{member.name}</div>
            <div className="denmu-team-role">{member.role}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-2xl)', display: 'flex', justifyContent: 'flex-end' }}>
        <span className="mono-tag" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', letterSpacing: '0.15em' }}>
          → DARE TO BUILD
        </span>
      </div>

      {selectedMember && (
        <TeamModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </section>
  );
}
