import React from 'react';
import { Clock, AlertTriangle, AlertCircle, XCircle, ShieldAlert } from 'lucide-react';
import PassTypeIcon from './PassTypeIcon';
import Tag from '../common/Tag';
import Button from '../common/Button';

export default function PassCard({ pass, onForceClose }) {
  const isCritical = pass.passType === 'LEFT_VENUE' && pass.isOverdue;
  const cardStateClass = isCritical
    ? 'critical-left-venue'
    : pass.isOverdue
    ? 'overdue'
    : pass.isWarning
    ? 'warning'
    : 'normal';

  return (
    <div className={`pass-card ${cardStateClass}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {pass.participantName}
            </h4>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {pass.rollNo}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
            <Tag type="team" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
              {pass.team}
            </Tag>
            <PassTypeIcon passType={pass.passType} size="sm" />
          </div>
        </div>

        {/* State Badge */}
        {isCritical ? (
          <span className="status-badge overdue" style={{ background: '#7f1d1d', color: '#fff', border: '1px solid #ef4444' }}>
            <ShieldAlert size={12} />
            <span>LEFT VENUE OVERDUE</span>
          </span>
        ) : pass.isOverdue ? (
          <span className="status-badge overdue">
            <AlertCircle size={12} />
            <span>OVERDUE</span>
          </span>
        ) : pass.isWarning ? (
          <span className="status-badge warning">
            <AlertTriangle size={12} />
            <span>EXPIRING</span>
          </span>
        ) : (
          <span className="status-badge present" style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }}>
            <span>ACTIVE</span>
          </span>
        )}
      </div>

      {pass.reason && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Reason: {pass.reason}
        </div>
      )}

      {/* Live Timers */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={13} style={{ color: 'var(--text-muted)' }} />
          <span>Out: <strong>{pass.elapsedText}</strong></span>
        </div>

        <span
          style={{
            fontWeight: 700,
            color: pass.isOverdue
              ? 'var(--status-absent-solid)'
              : pass.isWarning
              ? 'var(--status-warning-solid)'
              : 'var(--text-muted)'
          }}
        >
          {pass.remainingText} (limit: {pass.config?.overdueMinutes}m)
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '4px', background: 'var(--bg-muted)', borderRadius: '999px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${pass.percentUsed}%`,
            height: '100%',
            backgroundColor: pass.isOverdue
              ? 'var(--status-absent-solid)'
              : pass.isWarning
              ? 'var(--status-warning-solid)'
              : pass.config?.color || 'var(--color-primary)',
            transition: 'width 0.4s ease'
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
        <Button
          variant="secondary"
          size="sm"
          icon={XCircle}
          onClick={() => onForceClose(pass)}
          style={{
            fontSize: '0.76rem',
            padding: '2px 8px',
            minHeight: '28px',
            color: pass.isOverdue ? 'var(--status-absent-solid)' : undefined
          }}
        >
          Force Return Pass
        </Button>
      </div>
    </div>
  );
}
