import React from 'react';
import { Calendar, Users, ArrowRight, Clock, Award } from 'lucide-react';
import Button from '../common/Button';

export default function SessionSummaryCard({ session, onViewDetails }) {
  const presentPct = Math.round((session.presentCount / session.totalCount) * 100);

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '240px' }}>
        <div
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)'
          }}
        >
          <Calendar size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {session.classId}: {session.className}
            </h4>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface-secondary)',
                color: 'var(--text-secondary)'
              }}
            >
              {session.period}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>{session.date}</span>
            <span>•</span>
            <span>{session.startTime} - {session.endTime}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {session.presentCount}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              / {session.totalCount} Present
            </span>
            <span
              style={{
                marginLeft: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: presentPct >= 90 ? 'var(--status-present-text)' : 'var(--status-warning-text)',
                background: presentPct >= 90 ? 'var(--status-present-bg)' : 'var(--status-warning-bg)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {presentPct}%
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {session.hallPassCount || 0} Hall Passes ({session.overdueCount || 0} overdue)
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={ArrowRight}
          onClick={() => onViewDetails && onViewDetails(session)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
