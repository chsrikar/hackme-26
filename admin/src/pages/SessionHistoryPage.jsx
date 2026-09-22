import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { History, Search, Calendar, FileText, CheckCircle, X, Users } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useSession } from '../context/SessionContext';
import { MOCK_CLASSES, INITIAL_STUDENTS_CS301 } from '../data/mockRoster';
import StatusBadge from '../components/roster/StatusBadge';
import ExportButton from '../components/reports/ExportButton';
import Button from '../components/common/Button';

export default function SessionHistoryPage() {
  const { sessionHistory } = useSession();
  const location = useLocation();

  const [classFilter, setClassFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState(() => {
    const passedId = location.state?.selectedSessionId;
    if (passedId) {
      return sessionHistory.find((s) => s.id === passedId) || null;
    }
    return null;
  });

  const filteredSessions = sessionHistory.filter((sess) => {
    const matchesClass = classFilter === 'all' || sess.classId === classFilter;
    const matchesSearch =
      sess.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.classId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.date.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  // Exportable data representation of sessions
  const exportData = filteredSessions.map((s) => ({
    SessionID: s.id,
    ClassCode: s.classId,
    ClassName: s.className,
    Date: s.date,
    StartTime: s.startTime,
    EndTime: s.endTime,
    Present: s.presentCount,
    Absent: s.absentCount,
    Total: s.totalCount,
    AttendancePct: `${Math.round((s.presentCount / s.totalCount) * 100)}%`
  }));

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Page Title & Export */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Past Session Records</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
              Historical attendance logs and finalized classroom session archives.
            </p>
          </div>

          <ExportButton data={exportData} filename="faculty_session_history.csv" label="Export History CSV" />
        </div>

        {/* Filter bar */}
        <div className="admin-card" style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div className="search-input-wrap" style={{ flex: 1, minWidth: '220px' }}>
              <Search size={16} />
              <input
                type="text"
                className="form-input"
                placeholder="Search by class name or date (YYYY-MM-DD)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="history-class-filter" style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Filter Class:
              </label>
              <select
                id="history-class-filter"
                className="form-select"
                style={{ minHeight: '38px', fontSize: '0.88rem' }}
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="all">All Classes</option>
                {MOCK_CLASSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}: {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table of Past Sessions */}
        <div className="admin-card">
          <div className="roster-table-container">
            <table className="roster-table">
              <thead>
                <tr>
                  <th>Class / Subject</th>
                  <th>Date</th>
                  <th>Time Interval</th>
                  <th>Attendance</th>
                  <th>Rate</th>
                  <th>Hall Passes</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((sess) => {
                  const pct = Math.round((sess.presentCount / sess.totalCount) * 100);

                  return (
                    <tr key={sess.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {sess.classId}: {sess.className}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {sess.period}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                          <span>{sess.date}</span>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                          {sess.startTime} - {sess.endTime}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 700 }}>{sess.presentCount}</span> / {sess.totalCount}
                      </td>

                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            background: pct >= 90 ? 'var(--status-present-bg)' : 'var(--status-warning-bg)',
                            color: pct >= 90 ? 'var(--status-present-text)' : 'var(--status-warning-text)',
                            fontSize: '0.82rem'
                          }}
                        >
                          {pct}%
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.85rem' }}>
                          {sess.hallPassCount || 0} issued ({sess.overdueCount || 0} overdue)
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={FileText}
                          onClick={() => setSelectedSession(sess)}
                        >
                          View Roster
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

      {/* Read-Only Modal View of Session's Final Roster */}
      {selectedSession && (
        <div className="modal-overlay" onClick={() => setSelectedSession(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '800px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {selectedSession.classId}: {selectedSession.className}
                </h3>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {selectedSession.date} • {selectedSession.period} • {selectedSession.startTime} to {selectedSession.endTime}
                </div>
              </div>
              <button onClick={() => setSelectedSession(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', padding: '10px 0' }}>
              <div style={{ padding: '8px 14px', background: 'var(--status-present-bg)', color: 'var(--status-present-text)', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.86rem' }}>
                Present: {selectedSession.presentCount}
              </div>
              <div style={{ padding: '8px 14px', background: 'var(--status-absent-bg)', color: 'var(--status-absent-text)', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.86rem' }}>
                Absent: {selectedSession.absentCount}
              </div>
              <div style={{ padding: '8px 14px', background: 'var(--bg-surface-secondary)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.86rem' }}>
                Rate: {Math.round((selectedSession.presentCount / selectedSession.totalCount) * 100)}%
              </div>
            </div>

            <div className="roster-table-container" style={{ flex: 1, maxHeight: '420px', overflowY: 'auto' }}>
              <table className="roster-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Final Status</th>
                    <th>Verification Method</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_STUDENTS_CS301.map((s, idx) => {
                    const isPresent = idx < selectedSession.presentCount;
                    return (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{s.rollNo}</td>
                        <td>
                          <StatusBadge status={isPresent ? 'present' : 'absent'} />
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {isPresent ? (idx % 4 === 0 ? 'Faculty Manual Override' : 'Cryptographic QR Scan') : 'Unscanned / Absent'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <Button variant="secondary" onClick={() => setSelectedSession(null)}>
                Close Archive
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
