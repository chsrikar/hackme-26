import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { MOCK_CLASSES } from '../../data/mockRoster';
import { useSession } from '../../context/SessionContext';
import Button from '../common/Button';

export default function SessionStarter() {
  const [selectedClassId, setSelectedClassId] = useState(MOCK_CLASSES[0].id);
  const [isStarting, setIsStarting] = useState(false);
  const { startSession, activeSession } = useSession();
  const navigate = useNavigate();

  const currentClass = MOCK_CLASSES.find((c) => c.id === selectedClassId) || MOCK_CLASSES[0];

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await startSession(currentClass);
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
          <BookOpen size={20} style={{ color: 'var(--color-primary)' }} />
          <span>Start New Attendance Session</span>
        </h2>
        {activeSession && (
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
            Active Session Running
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="class-select">
            Select Assigned Class
          </label>
          <select
            id="class-select"
            className="form-select"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            {MOCK_CLASSES.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.code}: {cls.name}
              </option>
            ))}
          </select>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Roster will load automatically for this class cohort
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <Clock size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 600 }}>Period / Schedule:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentClass.period}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 600 }}>Location:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentClass.room}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <Users size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 600 }}>Total Enrolled:</span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentClass.totalStudents} Students</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
          <CheckCircle size={16} style={{ color: 'var(--status-present-solid)' }} />
          <span>Camera viewfinder and live hall pass monitor will initialize immediately upon start</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {activeSession && (
            <Button variant="secondary" onClick={() => navigate('/live')}>
              Go to Active Session
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            icon={Play}
            disabled={isStarting}
            onClick={handleStart}
          >
            {isStarting ? 'Initializing Session...' : 'Start Session Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
