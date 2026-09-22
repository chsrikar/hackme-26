import React from 'react';
import { Clock, Phone } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function RosterRow({ participant }) {
  return (
    <tr>
      {/* 1. PARTICIPANT NAME */}
      <td>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.94rem' }}>
          {participant.name}
        </span>
      </td>

      {/* 2. PASS CODE (HM26-xxx) */}
      <td>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '0.85rem',
          color: '#16c8ff',
          background: 'rgba(22, 200, 255, 0.12)',
          padding: '3px 9px',
          borderRadius: '4px',
          border: '1px solid rgba(22, 200, 255, 0.3)',
          letterSpacing: '0.5px',
          display: 'inline-block'
        }}>
          {participant.passId || participant.rollNo || 'HM26-000'}
        </span>
      </td>

      {/* 3. PHONE NUMBER */}
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          <Phone size={13} style={{ color: '#16c8ff' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
            {participant.phone || participant.mobile || '—'}
          </span>
        </div>
      </td>

      {/* 4. STATUS */}
      <td>
        <StatusBadge status={participant.status} />
      </td>

      {/* 5. CHECKED IN TIME */}
      <td>
        {participant.scannedAt ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
            <Clock size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              {participant.scannedAt}
            </span>
          </div>
        ) : (
          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>—</span>
        )}
      </td>
    </tr>
  );
}
