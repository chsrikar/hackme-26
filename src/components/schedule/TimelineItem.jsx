import { MapPin, Clock } from 'lucide-react';
import Badge from '../common/Badge';

const typeBadgeVariant = {
  Ceremony: 'purple',
  Workshop: 'cyan',
  Milestone: 'amber',
  Logistics: 'emerald',
  Networking: 'cyan',
  Judging: 'purple',
  'Food & Social': 'emerald',
  Mentorship: 'cyan'
};

export default function TimelineItem({ event }) {
  const badgeVariant = typeBadgeVariant[event.type] || 'cyan';

  return (
    <div className="timeline-item anime-timeline-item">
      <div className="timeline-marker" />
      <div className="timeline-card">
        <div className="timeline-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--color-primary)" />
            <span className="timeline-time">{event.time}</span>
          </div>
          <Badge variant={badgeVariant}>{event.type}</Badge>
        </div>

        <h4 style={{ marginBottom: '6px', fontSize: '1.15rem' }}>{event.title}</h4>
        <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>{event.description}</p>

        <div className="timeline-location">
          <MapPin size={14} />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  );
}
