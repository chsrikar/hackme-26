import React from 'react';
import { AlertOctagon, BellRing } from 'lucide-react';

export default function OverdueAlertBanner({ overdueCount = 0 }) {
  if (overdueCount <= 0) return null;

  return (
    <div className="overdue-banner animate-pulse-danger">
      <AlertOctagon size={20} style={{ color: 'var(--status-absent-solid)', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 800 }}>
          {overdueCount} {overdueCount === 1 ? 'Student is' : 'Students are'} OVERDUE!
        </span>
        <span style={{ fontWeight: 500, fontSize: '0.84rem', marginLeft: '6px' }}>
          Exceeded allowed hall pass duration. Verify return or contact proctor.
        </span>
      </div>
      <BellRing size={18} style={{ color: 'var(--status-absent-solid)', flexShrink: 0 }} />
    </div>
  );
}
