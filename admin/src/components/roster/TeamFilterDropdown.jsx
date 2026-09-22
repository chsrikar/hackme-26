import React from 'react';
import { Users } from 'lucide-react';
import { HACKATHON_TEAMS } from '../../data/mockRoster';

export default function TeamFilterDropdown({ selectedTeam, onSelectTeam }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Users size={15} style={{ color: 'var(--text-muted)' }} />
      <select
        className="form-select"
        style={{ minHeight: '34px', padding: '4px 10px', fontSize: '0.82rem' }}
        value={selectedTeam}
        onChange={(e) => onSelectTeam(e.target.value)}
      >
        <option value="all">All Teams (Overall Cohort)</option>
        {HACKATHON_TEAMS.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
    </div>
  );
}
