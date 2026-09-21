import Badge from '../common/Badge';

export default function OrganizerCard({ organizer }) {
  return (
    <div className="team-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <div className="team-avatar-box">
          {organizer.avatarText}
        </div>
        <div>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{organizer.name}</h4>
          <div className="team-role">{organizer.role}</div>
          <div className="team-dept">{organizer.department}</div>
        </div>
      </div>

      <p className="team-bio">{organizer.bio}</p>

      {organizer.tags && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
          {organizer.tags.map((tag, idx) => (
            <Badge key={idx} variant={idx === 0 ? 'cyan' : 'purple'}>
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
