import React, { useState } from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import MentorRequestCard from './MentorRequestCard';
import EmptyState from '../common/EmptyState';

export default function MentorRequestQueue() {
  const { mentorRequests, claimMentorTicket, resolveMentorTicket } = useOpsSession();
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'open' | 'claimed' | 'resolved' | 'all'

  const openCount = mentorRequests.filter((m) => m.status === 'open').length;
  const claimedCount = mentorRequests.filter((m) => m.status === 'claimed').length;

  const filteredTickets = mentorRequests.filter((ticket) => {
    if (statusFilter === 'active') return ticket.status !== 'resolved';
    if (statusFilter === 'all') return true;
    return ticket.status === statusFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: openCount > 0 ? 'var(--status-absent-bg)' : 'var(--bg-surface-secondary)',
              color: openCount > 0 ? 'var(--status-absent-solid)' : 'var(--text-secondary)'
            }}
          >
            {openCount} Open Ticket{openCount !== 1 ? 's' : ''}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--status-warning-bg)',
              color: 'var(--status-warning-text)'
            }}
          >
            {claimedCount} In Progress
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', overflowX: 'auto' }}>
        {[
          { key: 'active', label: 'Unresolved' },
          { key: 'open', label: 'Open' },
          { key: 'claimed', label: 'Claimed' },
          { key: 'resolved', label: 'Resolved' },
          { key: 'all', label: 'All' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            style={{
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              background: statusFilter === tab.key ? 'var(--color-primary)' : 'var(--bg-surface-secondary)',
              color: statusFilter === tab.key ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="queue-card-list" style={{ flex: 1 }}>
        {filteredTickets.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No Active Mentor Requests"
            description="When teams flag technical blocks or need mentor assistance, requests queue up here."
          />
        ) : (
          filteredTickets.map((ticket) => (
            <MentorRequestCard
              key={ticket.id}
              ticket={ticket}
              onClaim={claimMentorTicket}
              onResolve={resolveMentorTicket}
            />
          ))
        )}
      </div>
    </div>
  );
}
