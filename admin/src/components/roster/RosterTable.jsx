import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, UserPlus, Grid, List, CheckCircle2, Footprints, Utensils } from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import RosterRow from './RosterRow';
import TeamFilterDropdown from './TeamFilterDropdown';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';

export default function RosterTable({ onOpenManualModal }) {
  const { participants, activePasses, foodRequests, stats } = useOpsSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'team_rollup'

  // Filtered participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.team.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTeam = selectedTeam === 'all' || p.team === selectedTeam;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesTeam && matchesStatus;
    });
  }, [participants, searchQuery, selectedTeam, statusFilter]);

  // Group participants by Team for the Team Rollup view
  const teamRollups = useMemo(() => {
    const map = {};
    participants.forEach((p) => {
      if (!map[p.team]) {
        map[p.team] = {
          teamName: p.team,
          table: p.table,
          members: [],
          presentCount: 0,
          totalCount: 0
        };
      }
      map[p.team].members.push(p);
      map[p.team].totalCount++;
      if (p.status === 'present') map[p.team].presentCount++;
    });

    return Object.values(map).filter((grp) => {
      if (selectedTeam !== 'all' && grp.teamName !== selectedTeam) return false;
      if (searchQuery) {
        return grp.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grp.members.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return true;
    });
  }, [participants, selectedTeam, searchQuery]);

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
                fontSize: '0.8rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--status-present-bg)',
                color: 'var(--status-present-text)',
                border: '1px solid var(--status-present-border)'
              }}
            >
              {stats.checkedInCount} / {stats.totalCount} Checked In
            </span>

            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {stats.completedTeamsCount} Teams Complete
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* View Mode Toggle: Table vs Team Rollup */}
          <div style={{ display: 'flex', background: 'var(--bg-surface-secondary)', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Individual Participant List"
            >
              <List size={14} /> List
            </button>
            <button
              type="button"
              onClick={() => setViewMode('team_rollup')}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'team_rollup' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'team_rollup' ? 'var(--color-primary)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Team Aggregate Rollup View"
            >
              <Grid size={14} /> Teams
            </button>
          </div>

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
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-input-wrap" style={{ flex: 1, minWidth: '180px' }}>
          <Search size={15} />
          <input
            type="text"
            className="form-input"
            style={{ fontSize: '0.84rem', minHeight: '34px', paddingLeft: '34px' }}
            placeholder="Search participant, roll or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <TeamFilterDropdown selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} />

        {viewMode === 'table' && (
          <select
            className="form-select"
            style={{ minHeight: '34px', padding: '4px 10px', fontSize: '0.82rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses ({stats.totalCount})</option>
            <option value="present">Checked In ({stats.checkedInCount})</option>
            <option value="not_scanned">Not Checked In ({stats.notCheckedInCount})</option>
            <option value="absent">Absent ({stats.absentCount})</option>
          </select>
        )}
      </div>

      {/* View Mode 1: Detailed Table */}
      {viewMode === 'table' && (
        <div className="roster-table-container">
          {filteredParticipants.length === 0 ? (
            <EmptyState
              title="No participants found"
              description="Adjust your search query or team filter."
            />
          ) : (
            <table className="roster-table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Team</th>
                  <th>Table</th>
                  <th>Status</th>
                  <th>Checked In</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p) => (
                  <RosterRow
                    key={p.id}
                    participant={p}
                    onManualOverride={(target) => onOpenManualModal(target)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* View Mode 2: Team Rollup Aggregates */}
      {viewMode === 'team_rollup' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', overflowY: 'auto', maxHeight: '500px' }}>
          {teamRollups.map((grp) => {
            const isComplete = grp.presentCount === grp.totalCount && grp.totalCount > 0;
            const teamPasses = activePasses.filter((pass) => pass.team === grp.teamName);
            const teamOrders = foodRequests.filter((req) => req.team === grp.teamName && req.status !== 'delivered');

            return (
              <div
                key={grp.teamName}
                style={{
                  background: 'var(--bg-surface)',
                  border: isComplete ? '1px solid var(--status-present-border)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 700 }}>{grp.teamName}</h4>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: isComplete ? 'var(--status-present-bg)' : 'var(--bg-surface-secondary)',
                      color: isComplete ? 'var(--status-present-text)' : 'var(--text-secondary)'
                    }}
                  >
                    {grp.presentCount} / {grp.totalCount} In
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Location: {grp.table || 'Main Floor'}
                </div>

                {/* Team Badges Strip */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {teamPasses.length > 0 ? (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Footprints size={12} /> {teamPasses.length} out on pass
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>All members at desk</span>
                  )}

                  {teamOrders.length > 0 && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.12)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Utensils size={12} /> {teamOrders.length} food pending
                    </span>
                  )}
                </div>

                {/* Member avatars / initial dots */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                  {grp.members.map((m) => (
                    <div
                      key={m.id}
                      title={`${m.name} (${m.status})`}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: m.status === 'present' ? 'var(--status-present-solid)' : 'var(--bg-muted)',
                        color: '#ffffff'
                      }}
                    >
                      {m.name.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
