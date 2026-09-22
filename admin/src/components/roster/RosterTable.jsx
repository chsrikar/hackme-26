import React, { useState, useMemo } from 'react';
import { Search, Users, UserPlus, Trash2 } from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import RosterRow from './RosterRow';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';

export default function RosterTable({ onOpenManualModal }) {
  const { participants, stats, clearRoster } = useOpsSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtered participants: search across Name, HM26 Pass Code, and Phone Number
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.passId && p.passId.toLowerCase().includes(q)) ||
        (p.rollNo && p.rollNo.toLowerCase().includes(q)) ||
        (p.phone && p.phone.includes(q)) ||
        (p.mobile && p.mobile.includes(q));

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [participants, searchQuery, statusFilter]);

  return (
    <div className="admin-card roster-card">
      <div className="admin-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h3 className="admin-card-title">
            <Users size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Participant Roster</span>
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                padding: '3px 11px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--status-present-bg)',
                color: 'var(--status-present-text)',
                border: '1px solid var(--status-present-border)'
              }}
            >
              {stats.checkedInCount} Checked In
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {participants.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all scanned attendees from list?')) {
                  clearRoster();
                }
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                padding: '5px 10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Clear scanned roster"
            >
              <Trash2 size={13} />
              Clear List
            </button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => onOpenManualModal(null)}
          >
            Manual Check-In
          </Button>
        </div>
      </div>

      {/* Roster Toolbar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-input-wrap" style={{ flex: 1, minWidth: '220px' }}>
          <Search size={15} />
          <input
            type="text"
            className="form-input"
            style={{ fontSize: '0.85rem', minHeight: '36px', paddingLeft: '34px' }}
            placeholder="Search by participant name, HM26 code, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ minHeight: '36px', padding: '4px 12px', fontSize: '0.82rem' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses ({participants.length})</option>
          <option value="present">Checked In ({stats.checkedInCount})</option>
          <option value="not_scanned">Not Checked In ({stats.notCheckedInCount})</option>
          <option value="absent">Absent ({stats.absentCount})</option>
        </select>
      </div>

      {/* Table: Participant Name | Pass Code | Phone Number | Status | Checked In */}
      <div className="roster-table-container">
        {filteredParticipants.length === 0 ? (
          <EmptyState
            title={participants.length === 0 ? "No Participants Scanned Yet" : "No Matching Participants"}
            description={
              participants.length === 0
                ? "When attendees scan their QR badges at the station, their attendance records will automatically appear here with their Name, HM26 Code, Phone Number, and Status."
                : searchQuery
                ? `No attendees match "${searchQuery}".`
                : "No attendees match the selected status filter."
            }
            action={
              participants.length === 0 ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={UserPlus}
                  onClick={() => onOpenManualModal(null)}
                  style={{ marginTop: '8px' }}
                >
                  Manual Check-In
                </Button>
              ) : null
            }
          />
        ) : (
          <table className="roster-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Participant Name</th>
                <th style={{ width: '20%' }}>Pass Code</th>
                <th style={{ width: '22%' }}>Phone Number</th>
                <th style={{ width: '15%' }}>Status</th>
                <th style={{ width: '13%' }}>Checked In</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p) => (
                <RosterRow
                  key={p.id || p.passId || p.rollNo}
                  participant={p}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
