import Badge from '../common/Badge';
import { Briefcase, Award } from 'lucide-react';

export default function JudgeCard({ judge }) {
  return (
    <div className="team-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{judge.name}</h4>
          <div className="team-role">{judge.role}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '2px' }}>
            <Briefcase size={14} />
            <span>{judge.organization}</span>
          </div>
        </div>
        <Badge variant="amber">Judge / Mentor</Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
        <Award size={14} />
        <span>Expertise: {judge.expertise}</span>
      </div>

      <p className="team-bio">{judge.bio}</p>
    </div>
  );
}
