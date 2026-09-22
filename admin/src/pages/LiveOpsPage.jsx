import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Users,
  Footprints,
  Utensils,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import DaySessionSummaryBar from '../components/daysession/DaySessionSummaryBar';
import QrScanner from '../components/scanner/QrScanner';
import RecentScansStream from '../components/scanner/RecentScansStream';
import RosterTable from '../components/roster/RosterTable';
import ActivePassesPanel from '../components/passes/ActivePassesPanel';
import FoodRequestQueue from '../components/food/FoodRequestQueue';
import MentorRequestQueue from '../components/assistance/MentorRequestQueue';
import ManualMarkModal from '../components/scanner/ManualMarkModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import { useOpsSession } from '../context/OpsSessionContext';

export default function LiveOpsPage() {
  const { activeDay, closeDaySession, stats, activePasses, foodRequests, mentorRequests, participants } = useOpsSession();
  const navigate = useNavigate();

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [targetParticipant, setTargetParticipant] = useState(null);
  const [activeDeckTab, setActiveDeckTab] = useState('roster'); // 'roster' | 'passes' | 'food' | 'mentor'

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
        <div className="no-session-card">
          <div className="no-session-icon">
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
            No Active Operations Session
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.94rem' }}>
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
        {/* Top Operations Command Bar */}
        <DaySessionSummaryBar
          onCloseClick={() => setIsCloseModalOpen(true)}
          onOpenManualModal={handleOpenManualModal}
        />

        {/* 2-Column Professional Ops Layout */}
        <div className="live-ops-layout">
          {/* Left Column: Command & Scanning Station */}
          <div className="ops-column-scanner">
            {/* Primary Viewfinder Card */}
            <QrScanner onOpenManualModal={handleOpenManualModal} />

            {/* Live Scan Receipts Feed */}
            <RecentScansStream />
          </div>

          {/* Right Column: Operations Workspace Deck */}
          <div className="ops-column-deck">
            {/* Deck View Selector Tabs */}
            <div className="ops-deck-tab-bar">
              <button
                type="button"
                className={`ops-deck-tab ${activeDeckTab === 'roster' ? 'active' : ''}`}
                onClick={() => setActiveDeckTab('roster')}
              >
                <Users size={16} />
                <span>Attendance Roster</span>
                <span className="deck-tab-badge">
                  {stats.checkedInCount} / {participants.length}
                </span>
              </button>

              <button
                type="button"
                className={`ops-deck-tab ${activeDeckTab === 'passes' ? 'active' : ''}`}
                onClick={() => setActiveDeckTab('passes')}
              >
                <Footprints size={16} />
                <span>Movement Passes</span>
                <span className={`deck-tab-badge ${activePasses.length > 0 ? 'highlight-amber' : ''}`}>
                  {activePasses.length} Out
                </span>
              </button>

              <button
                type="button"
                className={`ops-deck-tab ${activeDeckTab === 'food' ? 'active' : ''}`}
                onClick={() => setActiveDeckTab('food')}
              >
                <Utensils size={16} />
                <span>Food Queue</span>
                {pendingFood > 0 && (
                  <span className="deck-tab-badge highlight-amber">
                    {pendingFood}
                  </span>
                )}
              </button>

              <button
                type="button"
                className={`ops-deck-tab ${activeDeckTab === 'mentor' ? 'active' : ''}`}
                onClick={() => setActiveDeckTab('mentor')}
              >
                <HelpCircle size={16} />
                <span>Mentor Desk</span>
                {openMentors > 0 && (
                  <span className="deck-tab-badge highlight-red">
                    {openMentors}
                  </span>
                )}
              </button>
            </div>

            {/* Active Deck Content (Full Width & Spacious) */}
            <div className="ops-deck-content">
              {activeDeckTab === 'roster' && (
                <RosterTable onOpenManualModal={handleOpenManualModal} />
              )}

              {activeDeckTab === 'passes' && (
                <ActivePassesPanel />
              )}

              {activeDeckTab === 'food' && (
                <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <FoodRequestQueue />
                </div>
              )}

              {activeDeckTab === 'mentor' && (
                <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <MentorRequestQueue />
                </div>
              )}
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
        cancelText="Resume Operations"
        confirmVariant="danger"
        onConfirm={handleConfirmClose}
        onCancel={() => setIsCloseModalOpen(false)}
      >
        <div style={{ marginTop: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <div style={{ padding: '14px 16px', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
            <div style={{ marginBottom: '6px' }}><strong>Checked In:</strong> {stats.checkedInCount} / {stats.totalCount} participants</div>
            <div style={{ marginBottom: '6px' }}><strong>Teams Completed:</strong> {stats.completedTeamsCount} / {stats.totalTeamsCount} teams</div>
            <div><strong>Active Passes:</strong> {activePasses.length} {activePasses.length > 0 ? '(will be force-closed)' : ''}</div>
          </div>
          <p style={{ margin: 0, lineHeight: 1.4 }}>
            Closing this session locks today's records and moves the summary into Day Session History.
          </p>
        </div>
      </ConfirmDialog>
    </PageWrapper>
  );
}
