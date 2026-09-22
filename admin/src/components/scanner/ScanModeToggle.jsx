import React from 'react';
import { PASS_TYPE_LIST } from '../../utils/passTypeConfig';

export default function ScanModeToggle({ scanMode, setScanMode }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          SCAN ACTION MODE:
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Auto-detects from badge QR
        </span>
      </div>

      <div className="scanner-mode-switch">
        <button
          type="button"
          className={`mode-tab ${scanMode === 'auto' ? 'active' : ''}`}
          onClick={() => setScanMode('auto')}
          title="Auto-detect action from QR payload"
        >
          Auto
        </button>

        <button
          type="button"
          className={`mode-tab ${scanMode === 'checkin' ? 'active' : ''}`}
          onClick={() => setScanMode('checkin')}
        >
          Check-In
        </button>

        {PASS_TYPE_LIST.map((pt) => (
          <button
            key={pt.id}
            type="button"
            className={`mode-tab ${scanMode === pt.id ? 'active' : ''}`}
            onClick={() => setScanMode(pt.id)}
            title={pt.label}
          >
            {pt.icon}
          </button>
        ))}

        <button
          type="button"
          className={`mode-tab ${scanMode === 'return' ? 'active' : ''}`}
          onClick={() => setScanMode('return')}
          title="Mark participant pass returned"
        >
          ↩ Return
        </button>
      </div>
    </div>
  );
}
