import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Search, FileText, X, Footprints, Utensils, Award, Users } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useOpsSession } from '../context/OpsSessionContext';
import { INITIAL_PARTICIPANTS } from '../data/mockRoster';
import { PASS_TYPES } from '../utils/passTypeConfig';
import StatusBadge from '../components/roster/StatusBadge';
import Tag from '../components/common/Tag';
import ExportButton from '../components/reports/ExportButton';
import Button from '../components/common/Button';

export default function DayHistoryPage() {
  const { dayHistory } = useOpsSession();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState(() => {
    const passedId = location.state?.selectedDayId;
    if (passedId) {
      return dayHistory.find((d) => d.id === passedId) || null;
    }
    return null;
  });

  const exportData = dayHistory.map((d) => ({
    DayCode: d.dayCode,
    DayName: d.dayName,
    Date: d.date,
    CheckedIn: d.totalCheckedIn,
    Registered: d.totalRegistered,
    AttendancePct: `${Math.round((d.totalCheckedIn / d.totalRegistered) * 100)}%`,
    TeamsCompleted: `${d.teamsCompleted} / ${d.totalTeams}`,
    WashroomPasses: d.passesByType?.WASHROOM || 0,
    FoodPickupPasses: d.passesByType?.FOOD_PICKUP || 0,
    RestBreakPasses: d.passesByType?.REST_BREAK || 0,
    LeftVenuePasses: d.passesByType?.LEFT_VENUE || 0,
    MealsDelivered: d.foodRequestsDelivered || 0
  }));

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Day Session Archives</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
              Finalized attendance logs, multi-type movement pass totals, and catering reports.
            </p>
          </div>

          <ExportButton data={exportData} filename="hackathon_day_history.csv" label="Export All Day Logs CSV" />
        </div>

        {/* Sessions Table */}
        <div className="admin-card">
          <div className="roster-table-container">
            <table className="roster-table">
              <thead>
                <tr>
                  <th>Stage / Day</th>
                  <th>Date</th>
                  <th>Window</th>
                  <th>Check-In Count</th>
                  <th>Rate</th>
                  <th>Passes (Washroom / Food / Rest / Left Venue)</th>
                  <th>Meals</th>
                  <th style={{ textAlign: 'right' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {dayHistory.map((d) => {
                  const rate = Math.round((d.totalCheckedIn / d.totalRegistered) * 100);
                  const p = d.passesByType || {};

                  return (
                    <tr key={d.id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{d.dayName}</strong>
                      </td>
                      <td>{d.date}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{d.startTime} - {d.endTime}</td>
                      <td>
                        <strong>{d.totalCheckedIn}</strong> / {d.totalRegistered}
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--status-present-bg)',
                            color: 'var(--status-present-text)',
                            fontSize: '0.82rem'
                          }}
                        >
                          {rate}%
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                        🚻 {p.WASHROOM || 0} • 🍔 {p.FOOD_PICKUP || 0} • 😴 {p.REST_BREAK || 0} • 🚪 {p.LEFT_VENUE || 0}
                      </td>
                      <td>{d.foodRequestsDelivered || 0} delivered</td>
                      <td style={{ textAlign: 'right' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={FileText}
                          onClick={() => setSelectedDay(d)}
                        >
                          View Log
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Read-Only Modal View of Day's Final Summary */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '820px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {selectedDay.dayName}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {selectedDay.date} • {selectedDay.startTime} to {selectedDay.endTime}
                </div>
              </div>
              <button onClick={() => setSelectedDay(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Quick KPI stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', padding: '12px 0' }}>
              <div style={{ padding: '8px 12px', background: 'var(--status-present-bg)', borderRadius: 'var(--radius-md)', color: 'var(--status-present-text)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Checked In</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedDay.totalCheckedIn} / {selectedDay.totalRegistered}</div>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>Teams Completed</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedDay.teamsCompleted} / {selectedDay.totalTeams}</div>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>Total Passes</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {Object.values(selectedDay.passesByType || {}).reduce((a, b) => a + b, 0)}
                </div>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>Meals Served</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedDay.foodRequestsDelivered || 0}</div>
              </div>
            </div>

            {/* Read-only participant list */}
            <div className="roster-table-container" style={{ flex: 1, maxHeight: '380px', overflowY: 'auto' }}>
              <table className="roster-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Team</th>
                    <th>Final Status</th>
                    <th>Verification Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_PARTICIPANTS.map((p, idx) => {
                    const isPresent = idx < selectedDay.totalCheckedIn;
                    return (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.name}</strong> ({p.rollNo})
                        </td>
                        <td>
                          <Tag type="team">{p.team}</Tag>
                        </td>
                        <td>
                          <StatusBadge status={isPresent ? 'present' : 'absent'} />
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {isPresent ? (idx % 5 === 0 ? 'Ops Manual Desk Override' : 'Badge QR Laser Scan') : 'Unchecked / Absent'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <Button variant="secondary" onClick={() => setSelectedDay(null)}>
                Close Log
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
