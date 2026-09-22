import React from 'react';
import { Clock, AlertTriangle, AlertCircle, XCircle, ArrowUpRight } from 'lucide-react';
import Button from '../common/Button';

export default function HallPassCard({ pass, onForceClose }) {
  const cardStateClass = pass.isOverdue ? 'overdue' : pass.isWarning ? 'warning' : 'normal';

  return (
    <div className={`hallpass-card ${cardStateClass}`}>
      <div className="hallpass-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {pass.studentName}
            </h4>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                color: 'var(--text-muted)'
              }}
            >
              {pass.rollNo}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
            {pass.reason}
          </div>
        </div>

        {pass.isOverdue ? (
          <span className="status-badge overdue">
            <AlertCircle size={13} />
            <span>OVERDUE</span>
          </span>
        ) : pass.isWarning ? (
          <span className="status-badge warning">
            <AlertTriangle size={13} />
            <span>EXPIRING</span>
          </span>
        ) : (
          <span className="status-badge present" style={{ background: 'var(--bg-surface-secondary)', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }}>
            <span>ACTIVE</span>
          </span>
        )}
      </div>

      {/* Live Timers */}
      <div className="hallpass-timer-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={14} style={{ color: 'var(--text-muted)' }} />
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
          {pass.remainingText}
        </span>
      </div>

      {/* Progress meter bar */}
      <div
        style={{
          width: '100%',
          height: '5px',
          background: 'var(--bg-muted)',
          borderRadius: '999px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${pass.percentUsed}%`,
            height: '100%',
            backgroundColor: pass.isOverdue
              ? 'var(--status-absent-solid)'
              : pass.isWarning
              ? 'var(--status-warning-solid)'
              : 'var(--color-primary)',
            transition: 'width 0.4s ease'
          }}
        />
      </div>

      {/* Card Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
        <Button
          variant="secondary"
          size="sm"
          icon={XCircle}
          onClick={() => onForceClose(pass)}
          style={{
            borderColor: pass.isOverdue ? 'var(--status-absent-border)' : undefined,
            color: pass.isOverdue ? 'var(--status-absent-solid)' : undefined
          }}
        >
          Force Close Pass
        </Button>
      </div>
    </div>
  );
}
