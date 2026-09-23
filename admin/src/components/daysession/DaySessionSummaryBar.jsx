import React, { useState, useEffect } from 'react';
import { Clock, Lock, Radio, Users, CheckCircle2, ShieldAlert, UserPlus, Footprints, Utensils, HelpCircle, Download } from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import { getElapsedTime } from '../../utils/timeFormat';
import Button from '../common/Button';

export default function DaySessionSummaryBar({ onCloseClick, onOpenManualModal }) {
  const { activeDay, stats, criticalLeftVenueOverdue, activePasses, foodRequests, mentorRequests, exportAttendance } = useOpsSession();
  const [elapsed, setElapsed] = useState('00m 00s');

  useEffect(() => {
    if (!activeDay) return;
    const update = () => setElapsed(getElapsedTime(activeDay.startTime));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeDay]);

  if (!activeDay) return null;

  const pendingFood = foodRequests.filter((f) => f.status !== 'delivered').length;
  const openMentors = mentorRequests.filter((m) => m.status === 'open').length;

  return (
    <div className="ops-header-section">
      {/* Critical Left-Venue Alert Banner (Persistent when anyone is overdue outside venue) */}
      {criticalLeftVenueOverdue.length > 0 && (
        <div className="left-venue-alert-banner animate-pulse-subtle">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="alert-shield-icon">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.94rem', letterSpacing: '0.01em' }}>
                SECURITY ESCALATION: {criticalLeftVenueOverdue.length} PARTICIPANT(S) OVERDUE OUTSIDE VENUE!
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Safety threshold exceeded (&gt;60m). Please check in with table leads or initiate security contact.
              </div>
            </div>
          </div>
          <div className="alert-badge-urgent">
            HIGH PRIORITY
          </div>
        </div>
      )}

      {/* Main Ops Control Banner */}
      <div className="ops-summary-bar">
        {/* Left: Active Session Info */}
        <div className="ops-summary-left">
          <div className="session-status-badge">
            <span className="pulse-dot"></span>
            <span>{activeDay.code || 'Day 1'}</span>
          </div>

          <div className="session-title-group">
            <h1 className="session-heading">
              {activeDay.dayName}
            </h1>
            <div className="session-sub-info">
              <span>Continuous Hackathon Ops</span>
              <span className="dot-divider">•</span>
              <div className="session-timer-pill">
                <Clock size={13} />
                <span>Elapsed: {elapsed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Real-time Metric Cards */}
        <div className="ops-metrics-strip">
          <div className="metric-card">
            <div className="metric-icon present">
              <Users size={16} />
            </div>
            <div className="metric-info">
              <span className="metric-value">
                {stats.checkedInCount} <span className="metric-denom">/ {stats.totalCount}</span>
              </span>
              <span className="metric-label">Checked In ({stats.checkInRate}%)</span>
            </div>
          </div>

          <div className="metric-card">
            <div className={`metric-icon ${activePasses.length > 0 ? 'passes-active' : 'neutral'}`}>
              <Footprints size={16} />
            </div>
            <div className="metric-info">
              <span className="metric-value">
                {activePasses.length} <span className="metric-denom">Out</span>
              </span>
              <span className="metric-label">Active Passes</span>
            </div>
          </div>

          <div className="metric-card">
            <div className={`metric-icon ${pendingFood > 0 ? 'warning' : 'neutral'}`}>
              <Utensils size={16} />
            </div>
            <div className="metric-info">
              <span className="metric-value">
                {pendingFood} <span className="metric-denom">Orders</span>
              </span>
              <span className="metric-label">Food Queue</span>
            </div>
          </div>

          <div className="metric-card">
            <div className={`metric-icon ${openMentors > 0 ? 'warning' : 'neutral'}`}>
              <HelpCircle size={16} />
            </div>
            <div className="metric-info">
              <span className="metric-value">
                {openMentors} <span className="metric-denom">Open</span>
              </span>
              <span className="metric-label">Mentor Desk</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="ops-summary-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={exportAttendance}
            className="btn-export-attendance"
            title="Download full attendance and scan logs as Excel/CSV"
          >
            Export Excel / CSV
          </Button>

          {onOpenManualModal && (
            <Button
              variant="secondary"
              size="sm"
              icon={UserPlus}
              onClick={() => onOpenManualModal(null)}
              className="btn-manual-checkin"
            >
              Manual Check-In
            </Button>
          )}

          <Button
            variant="danger"
            size="sm"
            icon={Lock}
            onClick={onCloseClick}
            className="btn-close-session"
          >
            Close Day
          </Button>
        </div>
      </div>
    </div>
  );
}
