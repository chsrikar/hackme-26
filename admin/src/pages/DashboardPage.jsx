import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Sparkles, Calendar, Footprints, Utensils, Award } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import DaySessionStarter from '../components/daysession/DaySessionStarter';
import { useOpsSession } from '../context/OpsSessionContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function DashboardPage() {
  const { dayHistory } = useOpsSession();
  const { faculty } = useAuth();
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header greeting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>
              Hackathon Operations Console
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '4px' }}>
              Welcome back, {faculty?.name || 'Alex Mercer'}. Monitor real-time badge check-ins, multi-type movement passes, and catering requests.
            </p>
          </div>
        </div>

        {/* Start Day Session Card */}
        <DaySessionStarter />

        {/* Recent Day Sessions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <History size={18} style={{ color: 'var(--color-primary)' }} />
              <span>Recent Hackathon Day Sessions</span>
            </h3>
            <Button variant="subtle" size="sm" onClick={() => navigate('/history')}>
              View All Logs →
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dayHistory.map((sess) => {
              const totalPasses = Object.values(sess.passesByType || {}).reduce((a, b) => a + b, 0);

              return (
                <div
                  key={sess.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-primary-subtle)',
                        color: 'var(--color-primary)'
                      }}
                    >
                      <Calendar size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.02rem', fontWeight: 700 }}>
                        {sess.dayName}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {sess.date} • {sess.startTime} to {sess.endTime}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                        {sess.totalCheckedIn} / {sess.totalRegistered} Present
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginTop: '2px' }}>
                        <span>{totalPasses} passes ({sess.overdueIncidents || 0} overdue)</span>
                        <span>•</span>
                        <span>{sess.foodRequestsDelivered || 0} meals</span>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/history', { state: { selectedDayId: sess.id } })}
                    >
                      View Log
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
