import React from 'react';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { PASS_TYPE_LIST } from '../../utils/passTypeConfig';

export default function ScanModeToggle({ scanMode, setScanMode }) {
  return (
    <div className="scanner-mode-container">
      <div className="scanner-mode-header">
        <span className="mode-label">SCAN INTENT:</span>
        <span className="mode-hint">
          {scanMode === 'auto' ? '⚡ Auto-decides Check-in or Return' : `Target: ${scanMode.replace('_', ' ')}`}
        </span>
      </div>

      <div className="scanner-mode-grid">
        <button
          type="button"
          className={`mode-pill ${scanMode === 'auto' ? 'active auto' : ''}`}
          onClick={() => setScanMode('auto')}
          title="Auto-detect action from badge QR"
        >
          <Sparkles size={13} />
          <span>Auto</span>
        </button>

        <button
          type="button"
          className={`mode-pill ${scanMode === 'checkin' ? 'active checkin' : ''}`}
          onClick={() => setScanMode('checkin')}
          title="Force attendee check-in"
        >
          <CheckCircle2 size={13} />
          <span>Check-In</span>
        </button>

        <button
          type="button"
          className={`mode-pill ${scanMode === 'return' ? 'active return' : ''}`}
          onClick={() => setScanMode('return')}
          title="Mark participant pass returned"
        >
          <RotateCcw size={13} />
          <span>Return</span>
        </button>

        {PASS_TYPE_LIST.map((pt) => (
          <button
            key={pt.id}
            type="button"
            className={`mode-pill ${scanMode === pt.id ? 'active' : ''}`}
            onClick={() => setScanMode(pt.id)}
            style={{
              '--active-color': pt.color,
              '--active-bg': pt.bgColor,
              '--active-border': pt.borderColor
            }}
            title={`Issue ${pt.label} pass`}
          >
            <span>{pt.icon}</span>
            <span>{pt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
