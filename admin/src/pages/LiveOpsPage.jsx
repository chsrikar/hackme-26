import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Utensils, HelpCircle } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import DaySessionSummaryBar from '../components/daysession/DaySessionSummaryBar';
import QrScanner from '../components/scanner/QrScanner';
import RosterTable from '../components/roster/RosterTable';
import ActivePassesPanel from '../components/passes/ActivePassesPanel';
import FoodRequestQueue from '../components/food/FoodRequestQueue';
import MentorRequestQueue from '../components/assistance/MentorRequestQueue';
import ManualMarkModal from '../components/scanner/ManualMarkModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import { useOpsSession } from '../context/OpsSessionContext';

export default function LiveOpsPage() {
  const { activeDay, closeDaySession, stats, activePasses, foodRequests, mentorRequests } = useOpsSession();
  const navigate = useNavigate();

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [targetParticipant, setTargetParticipant] = useState(null);
  const [activeQueueTab, setActiveQueueTab] = useState('food'); // 'food' | 'mentor'

  const handleOpenManualModal = (participant = null) => {
    setTargetParticipant(participant);
    setIsManualModalOpen(true);
  };

  const handleConfirmClose = async () => {
    await closeDaySession();
    setIsCloseModalOpen(false);
    navigate('/history');
  };

  if (!activeDay) {
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
          <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No Active Day Session</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            There is no hackathon operations session currently running. Start Day 1 or Day 2 from the Dashboard.
          </p>
          <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const pendingFood = foodRequests.filter((f) => f.status !== 'delivered').length;
  const openMentors = mentorRequests.filter((m) => m.status === 'open').length;

  return (
    <PageWrapper>
      <div className="live-ops-container">
        {/* Top Operations Bar */}
        <DaySessionSummaryBar onCloseClick={() => setIsCloseModalOpen(true)} />

        {/* Four-Panel Layout Grid */}
        <div className="four-panel-grid">
          {/* Panel A: QR Scanner */}
          <QrScanner onOpenManualModal={handleOpenManualModal} />

          {/* Panel B: Participant Roster */}
          <RosterTable onOpenManualModal={handleOpenManualModal} />

          {/* Panel C: Active Passes */}
          <ActivePassesPanel />

          {/* Panel D: Fulfillment Queues (Food Orders & Mentor Assistance) */}
          <div className="admin-card panel-queues" style={{ display: 'flex', flexDirection: 'column', minHeight: '560px' }}>
            <div className="admin-card-header" style={{ marginBottom: '10px', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActiveQueueTab('food')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: activeQueueTab === 'food' ? 'var(--color-primary)' : 'var(--bg-surface-secondary)',
                    color: activeQueueTab === 'food' ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Utensils size={14} />
                  <span>Food ({pendingFood})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveQueueTab('mentor')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: activeQueueTab === 'mentor' ? 'var(--color-primary)' : 'var(--bg-surface-secondary)',
                    color: activeQueueTab === 'mentor' ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <HelpCircle size={14} />
                  <span>Mentors ({openMentors})</span>
                </button>
              </div>

              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {activeQueueTab === 'food' ? 'Fulfillment Queue' : 'Assistance Triage'}
              </span>
            </div>

            {/* Queue Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {activeQueueTab === 'food' ? <FoodRequestQueue /> : <MentorRequestQueue />}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Check-In Modal */}
      <ManualMarkModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        preselectedParticipant={targetParticipant}
      />

      {/* Close Day Session Dialog */}
      <ConfirmDialog
        isOpen={isCloseModalOpen}
        title="Finalize & Close Day Session?"
        confirmText="Confirm Close Day"
        cancelText="Resume Ops"
        confirmVariant="danger"
        onConfirm={handleConfirmClose}
        onCancel={() => setIsCloseModalOpen(false)}
      >
        <div style={{ marginTop: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <div style={{ padding: '10px 14px', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
            <div><strong>Checked In:</strong> {stats.checkedInCount} / {stats.totalCount} participants</div>
            <div><strong>Teams Completed:</strong> {stats.completedTeamsCount} / {stats.totalTeamsCount} teams</div>
            <div><strong>Active Passes:</strong> {activePasses.length} {activePasses.length > 0 ? '(will be force-closed)' : ''}</div>
          </div>
          <p>
            Closing this session locks today's check-in records and moves the day summary into Day History.
          </p>
        </div>
      </ConfirmDialog>
    </PageWrapper>
  );
}
