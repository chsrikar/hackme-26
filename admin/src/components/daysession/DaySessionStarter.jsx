import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Calendar, Clock, MapPin, Users, Award } from 'lucide-react';
import { MOCK_DAYS } from '../../data/mockRoster';
import { useOpsSession } from '../../context/OpsSessionContext';
import Button from '../common/Button';

export default function DaySessionStarter() {
  const [selectedDayId, setSelectedDayId] = useState(MOCK_DAYS[0].id);
  const [isStarting, setIsStarting] = useState(false);
  const { startDaySession, activeDay } = useOpsSession();
  const navigate = useNavigate();

  const currentDay = MOCK_DAYS.find((d) => d.id === selectedDayId) || MOCK_DAYS[0];

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await startDaySession(currentDay);
      navigate('/live');
    } catch (err) {
      console.error(err);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h2 className="admin-card-title">
          <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
          <span>Launch Hackathon Day Session</span>
        </h2>
        {activeDay && (
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '999px',
              background: 'var(--status-present-bg)',
              color: 'var(--status-present-text)',
              border: '1px solid var(--status-present-border)'
            }}
          >
            Session Live: {activeDay.code}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="day-select">
            Select Hackathon Stage / Day
          </label>
          <select
            id="day-select"
            className="form-select"
            value={selectedDayId}
            onChange={(e) => setSelectedDayId(e.target.value)}
          >
            {MOCK_DAYS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Starts real-time QR scanner, multi-pass tracking & catering queue
          </span>
        </div>

        <div
          style={{
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem' }}>
            <Clock size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 600 }}>Scheduled Window:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentDay.startTime} → {currentDay.expectedEndTime}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem' }}>
            <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 600 }}>Venue Location:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentDay.venue}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem' }}>
            <Users size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 600 }}>Cohort Scale:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentDay.totalParticipants} Participants across {currentDay.totalTeams} Teams</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Overnight tracking active: Pass timeouts adjust dynamically per type (Washroom: 10m, Left Venue: 60m).
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {activeDay && (
            <Button variant="secondary" onClick={() => navigate('/live')}>
              Go to Live Ops Console
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            icon={Play}
            disabled={isStarting}
            onClick={handleStart}
          >
            {isStarting ? 'Initializing Day Ops...' : 'Start Day Session'}
          </Button>
        </div>
      </div>
    </div>
  );
}
