import React, { useState } from 'react';
import { Footprints, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useSession } from '../../context/SessionContext';
import HallPassCard from './HallPassCard';
import OverdueAlertBanner from './OverdueAlertBanner';
import EmptyState from '../common/EmptyState';
import ConfirmDialog from '../common/ConfirmDialog';

export default function HallPassWidget() {
  const { activeHallPasses, forceClosePass } = useSession();
  const [passToClose, setPassToClose] = useState(null);

  const overdueCount = activeHallPasses.filter((p) => p.isOverdue).length;

  const handleConfirmForceClose = () => {
    if (passToClose) {
      forceClosePass(passToClose.id, 'Faculty manual force-close');
      setPassToClose(null);
    }
  };

  return (
    <div className="admin-card panel-hallpass" style={{ display: 'flex', flexDirection: 'column', minHeight: '540px' }}>
      <div className="admin-card-header">
        <h3 className="admin-card-title">
          <Footprints size={20} style={{ color: 'var(--color-primary)' }} />
          <span>Active Hall Passes</span>
        </h3>
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            padding: '2px 10px',
            borderRadius: 'var(--radius-full)',
            background: overdueCount > 0 ? 'var(--status-absent-bg)' : 'var(--bg-surface-secondary)',
            color: overdueCount > 0 ? 'var(--status-absent-solid)' : 'var(--text-secondary)',
            border: `1px solid ${overdueCount > 0 ? 'var(--status-absent-border)' : 'var(--border-subtle)'}`
          }}
        >
          {activeHallPasses.length} Out
        </span>
      </div>

      {/* Overdue alert banner at top */}
      <OverdueAlertBanner overdueCount={overdueCount} />

      {/* Pass Cards List */}
      <div className="hallpass-card-list" style={{ flex: 1 }}>
        {activeHallPasses.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No Active Hall Passes"
            description="All students are currently in the classroom. When a student requests a digital pass, it will appear here in real time."
          />
        ) : (
          activeHallPasses.map((pass) => (
            <HallPassCard
              key={pass.id}
              pass={pass}
              onForceClose={(p) => setPassToClose(p)}
            />
          ))
        )}
      </div>

      {/* Confirmation modal for force closing */}
      <ConfirmDialog
        isOpen={Boolean(passToClose)}
        title="Force Close Hall Pass?"
        message={`This will immediately mark ${passToClose?.studentName}'s pass as returned and log a faculty override.`}
        confirmText="Yes, Close Pass"
        cancelText="Keep Open"
        confirmVariant="danger"
        onConfirm={handleConfirmForceClose}
        onCancel={() => setPassToClose(null)}
      />
    </div>
  );
}
