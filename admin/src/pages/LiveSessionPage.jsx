import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Lock, Radio, AlertTriangle, ArrowLeft } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import QrScanner from '../components/scanner/QrScanner';
import RosterTable from '../components/roster/RosterTable';
import HallPassWidget from '../components/hallpass/HallPassWidget';
import ManualMarkModal from '../components/scanner/ManualMarkModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import { useSession } from '../context/SessionContext';
import { getElapsedTime } from '../utils/timeFormat';

export default function LiveSessionPage() {
  const { activeSession, closeSession, stats, activeHallPasses } = useSession();
  const navigate = useNavigate();

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [targetStudentForManual, setTargetStudentForManual] = useState(null);
  const [sessionElapsed, setSessionElapsed] = useState('00m 00s');

  // Live session stopwatch timer
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => {
      setSessionElapsed(getElapsedTime(activeSession.startTime));
    }, 1000);
    setSessionElapsed(getElapsedTime(activeSession.startTime));
    return () => clearInterval(interval);
  }, [activeSession]);

  const handleOpenManualModal = (student = null) => {
    setTargetStudentForManual(student);
    setIsManualModalOpen(true);
  };

  const handleConfirmCloseSession = async () => {
    await closeSession();
    setIsCloseModalOpen(false);
    navigate('/history');
  };

  if (!activeSession) {
    return (
      <PageWrapper>
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            maxWidth: '500px',
            margin: '40px auto',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--status-warning-bg)',
              color: 'var(--status-warning-solid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <AlertTriangle size={30} />
          </div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No Active Session</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            There is no class attendance session currently running. Start a session from the Dashboard.
          </p>
          <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="live-session-container">
        {/* Top Sticky Session Control Bar */}
        <div className="session-header-bar">
          <div className="session-info-chunk">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={20} className="animate-pulse" style={{ color: 'var(--status-present-solid)' }} />
              <div>
                <h1 className="session-class-title">
                  {activeSession.classId}: {activeSession.className}
                </h1>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {activeSession.period}
                </div>
              </div>
            </div>

            <div className="session-timer-pill" title="Elapsed session duration">
              <Clock size={16} />
              <span>{sessionElapsed}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="live-counter-strip">
              <span
                style={{
                  padding: '6px 14px',
                  background: 'var(--bg-surface-secondary)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {stats.presentCount} / {stats.totalCount} Present
              </span>

              {activeHallPasses.length > 0 && (
                <span
                  style={{
                    padding: '6px 14px',
                    background: activeHallPasses.some((p) => p.isOverdue) ? 'var(--status-absent-bg)' : 'var(--status-warning-bg)',
                    color: activeHallPasses.some((p) => p.isOverdue) ? 'var(--status-absent-text)' : 'var(--status-warning-text)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}
                >
                  {activeHallPasses.length} Hall Pass{activeHallPasses.length > 1 ? 'es' : ''} Out
                </span>
              )}
            </div>

            <Button
              variant="danger"
              size="md"
              icon={Lock}
              onClick={() => setIsCloseModalOpen(true)}
            >
              Close Session
            </Button>
          </div>
        </div>

        {/* Core Three-Panel Grid */}
        <div className="three-panel-grid">
          {/* Panel A: QR Scanner */}
          <QrScanner onOpenManualMark={() => handleOpenManualModal(null)} />

          {/* Panel B: Live Roster */}
          <RosterTable onOpenManualModal={handleOpenManualModal} />

          {/* Panel C: Active Hall Passes */}
          <HallPassWidget />
        </div>
      </div>

      {/* Manual Mark Modal */}
      <ManualMarkModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        preselectedStudent={targetStudentForManual}
      />

      {/* Close Session Confirmation Modal */}
      <ConfirmDialog
        isOpen={isCloseModalOpen}
        title="Lock & Close Class Session?"
        confirmText="Confirm & Lock Session"
        cancelText="Resume Session"
        confirmVariant="danger"
        onConfirm={handleConfirmCloseSession}
        onCancel={() => setIsCloseModalOpen(false)}
      >
        <div style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div style={{ padding: '10px 14px', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
            <div><strong>Present:</strong> {stats.presentCount} students</div>
            <div><strong>Absent / Unscanned:</strong> {stats.absentCount + stats.notScannedCount} students</div>
            <div><strong>Active Hall Passes:</strong> {activeHallPasses.length} {activeHallPasses.length > 0 ? '(will be auto-closed)' : ''}</div>
          </div>
          <p>
            Closing this session will finalize and lock the attendance record. Any remaining unscanned students will be officially marked <strong>ABSENT</strong>.
          </p>
        </div>
      </ConfirmDialog>
    </PageWrapper>
  );
}
