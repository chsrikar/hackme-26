import { useState } from 'react';
import TeamModal from './TeamModal';
import { organizers, judgesAndMentors } from '../../data/organizers';

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState(null);

  const allMembers = [
    ...organizers,
    ...judgesAndMentors
  ];

  return (
    <section className="container" style={{ paddingBottom: 'var(--space-4xl)' }} id="team-section">
      <div className="denmu-section-header">
        <h2 className="denmu-section-title">THE COMMITTEE & PARTNERS</h2>
        <span className="mono-tag">// OPERATORS & FELLOWS</span>
      </div>

      <div className="denmu-team-grid">
        {allMembers.map((member, idx) => (
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
