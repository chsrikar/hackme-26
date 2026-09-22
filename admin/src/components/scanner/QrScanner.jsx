import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Zap,
  Sparkles,
  Keyboard,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import { generateTestPayload } from '../../utils/qrValidation';
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
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false);

  const html5QrCodeRef = useRef(null);
  const isScanningActiveRef = useRef(false);
  const lastScannedRef = useRef({ text: null, time: 0 });
  const handleQrScanRef = useRef(handleQrScan);

  // Keep handleQrScanRef synchronized with latest function on every render
  useEffect(() => {
    handleQrScanRef.current = handleQrScan;
  });

  const onScanSuccess = useCallback((decodedText) => {
    const now = Date.now();
    // Debounce duplicate scans of the exact same code within 2 seconds
    if (lastScannedRef.current.text === decodedText && (now - lastScannedRef.current.time < 2000)) {
      return;
    }
    lastScannedRef.current = { text: decodedText, time: now };
    setLastScanned(decodedText);
    setTimeout(() => setLastScanned(null), 2500);

    // Call through mutable ref to guarantee zero stale closure over scanMode/activePasses/participants
    if (handleQrScanRef.current) {
      handleQrScanRef.current(decodedText);
    }
  }, []);

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
        { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 },
        onScanSuccess,
        () => {}
      );
      isScanningActiveRef.current = true;
      setIsScannerPaused(false);
    } catch (err) {
      setHasCameraError(true);
      setErrorMessage(
        err?.message?.includes('Permission')
          ? 'Camera permission denied. Allow webcam in browser settings or use manual badge code below.'
          : 'No webcam detected. Use the quick manual badge input or test triggers below.'
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

  // Quick simulation triggers for evaluator testing
  const triggerCheckIn = (code = 'HM26-003') => {
    if (handleQrScanRef.current) {
      handleQrScanRef.current(code, 'checkin');
    }
  };

  const triggerPassCheckout = (typeKey, preferredCode = null) => {
    let code = preferredCode;
    if (!code) {
      // Find a checked-in participant without an active pass, or default to Parthiv das HM26-003
      const candidate = participants.find(
        (p) => p.status === 'present' && !activePasses.some((pass) => pass.rollNo === p.rollNo || pass.passId === p.rollNo)
      );
      code = candidate?.passId || candidate?.rollNo || 'HM26-003';
    }
    if (handleQrScanRef.current) {
      handleQrScanRef.current(code, typeKey);
    }
  };

  const triggerReturn = (preferredCode = null) => {
    let code = preferredCode;
    if (!code) {
      if (activePasses && activePasses.length > 0) {
        code = activePasses[0].rollNo || activePasses[0].passId;
      } else {
        code = 'HM26-003';
      }
    }
    if (handleQrScanRef.current) {
      handleQrScanRef.current(code, 'return');
    }
  };

  const handleManualCodeSubmit = (e) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    if (handleQrScanRef.current) {
      handleQrScanRef.current(manualCodeInput.trim());
    }
    setManualCodeInput('');
  };

  const getActionLabel = (name, code) => {
    if (scanMode === 'auto') return `⚡ Auto: ${name} (${code})`;
    if (scanMode === 'checkin') return `✅ Check-in: ${name} (${code})`;
    if (scanMode === 'return') return `↩ Return: ${name} (${code})`;
    if (scanMode === 'FOOD_PICKUP') return `🍔 Food Pickup: ${name} (${code})`;
    if (scanMode === 'WASHROOM') return `🚻 Washroom: ${name} (${code})`;
    if (scanMode === 'REST_BREAK') return `😴 Rest Break: ${name} (${code})`;
    if (scanMode === 'LEFT_VENUE') return `🚪 Left Venue: ${name} (${code})`;
    return `Scan ${name} (${code})`;
  };

  return (
    <div className="admin-card panel-scanner">
      {/* Scanner Header */}
      <div className="admin-card-header" style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="scanner-header-icon">
            <Camera size={18} />
          </div>
          <div>
            <h3 className="admin-card-title" style={{ margin: 0, fontSize: '1rem' }}>
              Badge Scanner Station
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Optical QR & Manual Verification
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            className={`scanner-status-pill ${isScannerPaused ? 'paused' : 'live'}`}
          >
            <span className="pulse-indicator"></span>
            {isScannerPaused ? 'PAUSED' : 'LIVE'}
          </span>

          <button
            type="button"
            className="btn-icon-subtle"
            onClick={togglePause}
            title={isScannerPaused ? 'Resume Camera' : 'Pause Camera'}
          >
            {isScannerPaused ? <Camera size={15} /> : <CameraOff size={15} />}
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <ScanModeToggle scanMode={scanMode} setScanMode={setScanMode} />

      {/* Camera Viewport */}
      <div className="scanner-viewport-box">
        <div id="reader-viewport"></div>

        {!isScannerPaused && !hasCameraError && (
          <div className="scanner-laser-container">
            <div className="scanner-laser"></div>
            <div className="scanner-corner top-left"></div>
            <div className="scanner-corner top-right"></div>
            <div className="scanner-corner bottom-left"></div>
            <div className="scanner-corner bottom-right"></div>
          </div>
        )}

        {isScannerPaused && (
          <div className="scanner-paused-overlay">
            <CameraOff size={28} style={{ color: 'var(--status-warning-solid)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Camera View Paused</span>
            <Button variant="primary" size="sm" onClick={togglePause}>
              Resume Viewfinder
            </Button>
          </div>
        )}

        {hasCameraError && (
          <div className="scanner-error-overlay">
            <AlertCircle size={26} style={{ color: 'var(--status-warning-solid)' }} />
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Webcam Standby
            </div>
            <span style={{ fontSize: '0.74rem', lineHeight: 1.3, color: 'var(--text-dim)', maxWidth: '220px' }}>
              {errorMessage}
            </span>
            <button
              type="button"
              className="btn-retry-cam"
              onClick={startCamera}
            >
              <RefreshCw size={13} />
              <span>Retry Webcam</span>
            </button>
          </div>
        )}
      </div>

      {/* Manual Code Input Bar */}
      <form onSubmit={handleManualCodeSubmit} className="manual-scan-form">
        <div className="manual-input-wrapper">
          <Keyboard size={15} className="input-leading-icon" />
          <input
            type="text"
            className="manual-code-input"
            placeholder="Scan or enter badge (e.g. HM26-001)"
            value={manualCodeInput}
            onChange={(e) => setManualCodeInput(e.target.value)}
          />
        </div>
        <button type="submit" className="manual-submit-btn" disabled={!manualCodeInput.trim()}>
          <span>Scan</span>
          <ArrowRight size={14} />
        </button>
      </form>

      {/* Demo Simulation Drawer (Collapsible) */}
      <div className="demo-triggers-drawer">
        <button
          type="button"
          className="demo-drawer-toggle"
          onClick={() => setIsDemoDrawerOpen(!isDemoDrawerOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} style={{ color: 'var(--color-primary)' }} />
            <span>Quick Badge Simulation Triggers</span>
          </div>
          {isDemoDrawerOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {isDemoDrawerOpen && (
          <div className="demo-triggers-grid animate-fade-in">
            <button
              type="button"
              onClick={() => handleQrScan('HM26-001')}
              className="demo-btn checkin"
              style={{
                gridColumn: '1 / -1',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                color: '#93c5fd',
                fontWeight: 700
              }}
            >
              {getActionLabel('Anto Jerom T', 'HM26-001')}
            </button>

            <button
              type="button"
              onClick={() => handleQrScan('HM26-002')}
              className="demo-btn checkin"
            >
              {getActionLabel('Nimisha S A', 'HM26-002')}
            </button>

            <button
              type="button"
              onClick={() => handleQrScan('HM26-003')}
              className="demo-btn checkin"
            >
              {getActionLabel('Parthiv das', 'HM26-003')}
            </button>

            <button
              type="button"
              onClick={() => handleQrScan('HM26-999')}
              className="demo-btn checkin"
            >
              {getActionLabel('Adithyan Rajesh', 'HM26-999')}
            </button>

            <button
              type="button"
              onClick={() => triggerReturn()}
              className="demo-btn return"
            >
              ↩ Return Open Pass
            </button>

            <button
              type="button"
              onClick={() => triggerPassCheckout('WASHROOM')}
              className="demo-btn washroom"
            >
              🚻 Out: Washroom
            </button>

            <button
              type="button"
              onClick={() => triggerPassCheckout('FOOD_PICKUP')}
              className="demo-btn food"
            >
              🍔 Out: Food Pickup
            </button>

            <button
              type="button"
              onClick={() => triggerPassCheckout('REST_BREAK')}
              className="demo-btn rest"
            >
              😴 Out: Rest Break
            </button>

            <button
              type="button"
              onClick={() => triggerPassCheckout('LEFT_VENUE')}
              className="demo-btn left-venue"
            >
              🚪 Out: Left Venue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
