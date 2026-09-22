import React from 'react';
import { Edit3, Clock, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Tag from '../common/Tag';
import Button from '../common/Button';

export default function RosterRow({ participant, onManualOverride }) {
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {participant.name}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            {participant.rollNo}
          </span>
        </div>
      </td>

      <td>
        <Tag type="team">
          {participant.team}
        </Tag>
      </td>

      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
          <span>{participant.table || 'Main Floor'}</span>
        </div>
      </td>

      <td>
        <StatusBadge status={participant.status} />
      </td>

      <td>
        {participant.scannedAt ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
            <Clock size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontFamily: 'var(--font-mono)' }}>{participant.scannedAt}</span>
          </div>
        ) : (
          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>—</span>
        )}
      </td>

      <td style={{ textAlign: 'right' }}>
        <Button
          variant="secondary"
          size="sm"
          icon={Edit3}
          onClick={() => onManualOverride(participant)}
          title="Manual check-in override"
        >
          Override
        </Button>
      </td>
    </tr>
  );
}
