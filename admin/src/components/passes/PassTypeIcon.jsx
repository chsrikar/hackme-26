import React from 'react';
import { getPassConfig } from '../../utils/passTypeConfig';

export default function PassTypeIcon({ passType, showLabel = true, size = 'md' }) {
  const config = getPassConfig(passType);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'sm' ? '2px 6px' : '3px 8px',
        borderRadius: 'var(--radius-sm)',
        background: config.bgColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
        fontWeight: 700,
        fontSize: size === 'sm' ? '0.72rem' : '0.78rem'
      }}
    >
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
