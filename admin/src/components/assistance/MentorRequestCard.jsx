import React from 'react';
import { HelpCircle, CheckCircle, UserCheck, Clock, Tag as TagIcon } from 'lucide-react';
import Tag from '../common/Tag';
import Button from '../common/Button';
import { getElapsedTime } from '../../utils/timeFormat';

export default function MentorRequestCard({ ticket, onClaim, onResolve }) {
  const isOpen = ticket.status === 'open';
  const isClaimed = ticket.status === 'claimed';
  const isResolved = ticket.status === 'resolved';

  return (
    <div className="queue-item-card" style={{ opacity: isResolved ? 0.7 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {ticket.team}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              ({ticket.participantName})
            </span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Location: <strong>{ticket.table}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-primary-border)'
            }}
          >
            {ticket.category}
          </span>
          <span className={`pipeline-badge ${ticket.status}`}>
            {ticket.status}
          </span>
        </div>
      </div>

      {/* Problem Topic */}
      <div
        style={{
          background: 'var(--bg-surface-secondary)',
          padding: '8px 10px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.82rem',
          color: 'var(--text-primary)',
          lineHeight: 1.4
        }}
      >
        <strong>Help Needed:</strong> {ticket.topic}
      </div>

      {ticket.mentorAssigned && (
        <div style={{ fontSize: '0.76rem', color: 'var(--status-present-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <UserCheck size={13} />
          <span>Claimed by: {ticket.mentorAssigned}</span>
        </div>
      )}

      {/* Bottom bar with waiting timer & actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          <Clock size={12} />
          <span>Waiting: {getElapsedTime(ticket.requestedAt)}</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {isOpen && (
            <Button
              variant="warning"
              size="sm"
              icon={UserCheck}
              onClick={() => onClaim(ticket.id)}
              style={{ fontSize: '0.74rem', minHeight: '28px', padding: '2px 8px' }}
            >
              Claim Ticket
            </Button>
          )}

          {isClaimed && (
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle}
              onClick={() => onResolve(ticket.id)}
              style={{ fontSize: '0.74rem', minHeight: '28px', padding: '2px 8px' }}
            >
              Mark Resolved
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
