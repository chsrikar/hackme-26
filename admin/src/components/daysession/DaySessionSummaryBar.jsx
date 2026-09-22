import React, { useState, useEffect } from 'react';
import { Clock, Lock, Radio, Users, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import { getElapsedTime } from '../../utils/timeFormat';
import Button from '../common/Button';

export default function DaySessionSummaryBar({ onCloseClick }) {
  const { activeDay, stats, criticalLeftVenueOverdue } = useOpsSession();
  const [elapsed, setElapsed] = useState('00m 00s');

  useEffect(() => {
    if (!activeDay) return;
    const update = () => setElapsed(getElapsedTime(activeDay.startTime));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeDay]);

  if (!activeDay) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Critical Left-Venue Alert Banner (Persistent when anyone is overdue outside venue) */}
      {criticalLeftVenueOverdue.length > 0 && (
        <div className="left-venue-alert-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={26} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                SECURITY & SAFETY ALERT: {criticalLeftVenueOverdue.length} PARTICIPANT(S) OVERDUE OUTSIDE VENUE!
              </div>
              <div style={{ fontSize: '0.84rem', opacity: 0.9 }}>
                Students have exceeded the 60-minute Left-Venue threshold late at night. Contact their team table immediately.
              </div>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: 'var(--radius-sm)' }}>
            STATUS: HIGH PRIORITY
          </div>
        </div>
      )}

      {/* Main Ops Control Bar */}
      <div className="ops-summary-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={20} className="animate-pulse" style={{ color: 'var(--status-present-solid)' }} />
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeDay.dayName}
              </h1>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Multi-hour continuous operations • Active badge scanning
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: 'var(--color-primary)'
            }}
          >
            <Clock size={15} />
            <span>{elapsed}</span>
          </div>
        </div>

        {/* Live Counters & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--status-present-bg)',
                color: 'var(--status-present-text)',
                border: '1px solid var(--status-present-border)',
                fontWeight: 800,
                fontSize: '0.86rem'
              }}
            >
              {stats.checkedInCount} / {stats.totalCount} Checked In ({stats.checkInRate}%)
            </span>

            <span
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 700,
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={14} style={{ color: 'var(--status-present-solid)' }} />
              <span>{stats.completedTeamsCount} / {stats.totalTeamsCount} Teams Complete</span>
            </span>
          </div>

          <Button
            variant="danger"
            size="md"
            icon={Lock}
            onClick={onCloseClick}
          >
            Close Day Session
          </Button>
        </div>
      </div>
    </div>
  );
}
