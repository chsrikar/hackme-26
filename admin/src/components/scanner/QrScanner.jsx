import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Zap,
  Sparkles,
  Keyboard,
  AlertCircle
} from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import { generateTestPayload } from '../../utils/qrValidation';
import { PASS_TYPES } from '../../utils/passTypeConfig';
import ScanModeToggle from './ScanModeToggle';
import Button from '../common/Button';

export default function QrScanner({ onOpenManualModal }) {
  const {
    handleQrScan,
    isScannerPaused,
    setIsScannerPaused,
    scanMode,
    setScanMode,
    participants,
    activePasses
  } = useOpsSession();

  const [hasCameraError, setHasCameraError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [lastScanned, setLastScanned] = useState(null);

  const html5QrCodeRef = useRef(null);
  const isScanningActiveRef = useRef(false);

  const onScanSuccess = useCallback((decodedText) => {
    if (lastScanned === decodedText) return;
    setLastScanned(decodedText);
    setTimeout(() => setLastScanned(null), 1800);
    handleQrScan(decodedText);
  }, [lastScanned, handleQrScan]);

  const startCamera = useCallback(async () => {
    if (html5QrCodeRef.current && isScanningActiveRef.current) return;
    setHasCameraError(false);
    setErrorMessage('');

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('reader-viewport');
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 },
        onScanSuccess,
        () => {}
      );
      isScanningActiveRef.current = true;
      setIsScannerPaused(false);
    } catch (err) {
      setHasCameraError(true);
      setErrorMessage(
        err?.message?.includes('Permission')
          ? 'Camera permission denied. Allow browser webcam access or use manual badge code below.'
          : 'No camera hardware found or in use. Use test triggers or manual code entry below.'
      );
    }
  }, [onScanSuccess, setIsScannerPaused]);

  const stopCamera = useCallback(async () => {
    if (html5QrCodeRef.current && isScanningActiveRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.warn(err);
      }
      isScanningActiveRef.current = false;
    }
  }, []);

  const togglePause = async () => {
    if (isScannerPaused) {
      setIsScannerPaused(false);
      await startCamera();
    } else {
      setIsScannerPaused(true);
      await stopCamera();
    }
  };

  useEffect(() => {
    startCamera();
    return () => { stopCamera(); };
  }, []);

  // Quick simulation triggers for evaluator demoing
  const triggerCheckIn = () => {
    const candidate = participants.find((p) => p.status === 'not_scanned') || participants[0];
    handleQrScan(generateTestPayload('CHECKIN', candidate));
  };

  const triggerPassCheckout = (typeKey) => {
    // Pick an active checked-in participant who doesn't already have an open pass
    const candidate = participants.find(
      (p) => p.status === 'present' && !activePasses.some((pass) => pass.rollNo === p.rollNo)
    ) || participants[0];

    handleQrScan(generateTestPayload(typeKey, candidate));
  };

  const triggerReturn = () => {
    if (activePasses.length > 0) {
      const pass = activePasses[0];
      handleQrScan(generateTestPayload('RETURN', {
        id: pass.studentId,
        rollNo: pass.rollNo,
        name: pass.participantName,
        team: pass.team
      }));
    } else {
      handleQrScan(JSON.stringify({ type: 'RETURN', rollNo: 'HACK-99X' }));
    }
  };

  const handleManualCodeSubmit = (e) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    handleQrScan(manualCodeInput.trim());
    setManualCodeInput('');
  };

  return (
    <div className="admin-card panel-scanner">
      <div className="admin-card-header">
        <h3 className="admin-card-title">
          <Camera size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Badge QR Scanner</span>
        </h3>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: isScannerPaused ? 'var(--status-warning-bg)' : 'var(--status-present-bg)',
            color: isScannerPaused ? 'var(--status-warning-text)' : 'var(--status-present-text)',
            border: `1px solid ${isScannerPaused ? 'var(--status-warning-border)' : 'var(--status-present-border)'}`
          }}
        >
          {isScannerPaused ? 'PAUSED' : 'LIVE'}
        </span>
      </div>

      {/* Mode Switcher */}
      <ScanModeToggle scanMode={scanMode} setScanMode={setScanMode} />

      {/* Camera Viewport */}
      <div className="scanner-viewport-box">
        <div id="reader-viewport"></div>

        {!isScannerPaused && !hasCameraError && <div className="scanner-laser"></div>}

        {isScannerPaused && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              gap: '8px'
            }}
          >
            <CameraOff size={28} style={{ color: 'var(--status-warning-solid)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Camera Paused</span>
            <Button variant="primary" size="sm" onClick={togglePause}>
              Resume
            </Button>
          </div>
        )}

        {hasCameraError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#090d16',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f8fafc',
              padding: '16px',
              textAlign: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={28} style={{ color: 'var(--status-warning-solid)' }} />
            <span style={{ fontSize: '0.78rem', lineHeight: 1.3, color: 'var(--text-dim)' }}>
              {errorMessage}
            </span>
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={startCamera}>
              Retry Camera
            </Button>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <Button
          variant={isScannerPaused ? 'primary' : 'secondary'}
          size="sm"
          icon={isScannerPaused ? Camera : CameraOff}
          onClick={togglePause}
          style={{ flex: 1 }}
        >
          {isScannerPaused ? 'Resume Camera' : 'Pause Camera'}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={Keyboard}
          onClick={() => onOpenManualModal(null)}
          title="Manual Roll Override"
        >
          Manual
        </Button>
      </div>

      {/* Manual Quick Entry */}
      <form onSubmit={handleManualCodeSubmit} style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: 1, fontSize: '0.82rem', minHeight: '34px', padding: '4px 10px' }}
          placeholder="Badge Code (e.g. HACK-01A)"
          value={manualCodeInput}
          onChange={(e) => setManualCodeInput(e.target.value)}
        />
        <Button type="submit" variant="primary" size="sm">
          Submit
        </Button>
      </form>

      {/* Instant Demo QR Trigger Panel */}
      <div
        style={{
          marginTop: '12px',
          padding: '10px',
          background: 'var(--bg-surface-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
          <Sparkles size={13} style={{ color: 'var(--color-primary)' }} />
          <span>Demo Scan Simulation Triggers</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <button
            type="button"
            onClick={triggerCheckIn}
            style={{
              padding: '5px 8px',
              fontSize: '0.74rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--status-present-solid)',
              textAlign: 'center'
            }}
          >
            ✅ Check-In Next
          </button>

          <button
            type="button"
            onClick={triggerReturn}
            style={{
              padding: '5px 8px',
              fontSize: '0.74rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--color-primary)',
              textAlign: 'center'
            }}
          >
            ↩ Return Pass
          </button>

          <button
            type="button"
            onClick={() => triggerPassCheckout('WASHROOM')}
            style={{
              padding: '5px 8px',
              fontSize: '0.74rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: '#3b82f6',
              textAlign: 'center'
            }}
          >
            🚻 Out: Washroom
          </button>

          <button
            type="button"
            onClick={() => triggerPassCheckout('FOOD_PICKUP')}
            style={{
              padding: '5px 8px',
              fontSize: '0.74rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: '#f59e0b',
              textAlign: 'center'
            }}
          >
            🍔 Out: Food
          </button>

          <button
            type="button"
            onClick={() => triggerPassCheckout('REST_BREAK')}
            style={{
              padding: '5px 8px',
              fontSize: '0.74rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: '#8b5cf6',
              textAlign: 'center'
            }}
          >
            😴 Out: Rest Break
          </button>

          <button
            type="button"
            onClick={() => triggerPassCheckout('LEFT_VENUE')}
            style={{
              padding: '5px 8px',
              fontSize: '0.74rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: '#ef4444',
              textAlign: 'center'
            }}
          >
            🚪 Out: Left Venue
          </button>
        </div>
      </div>
    </div>
  );
}
