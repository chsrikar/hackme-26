import React, { useState } from 'react';
import { Footprints, ShieldAlert, CheckCircle2, Filter } from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import { PASS_TYPE_LIST } from '../../utils/passTypeConfig';
import PassCard from './PassCard';
import EmptyState from '../common/EmptyState';
import ConfirmDialog from '../common/ConfirmDialog';

export default function ActivePassesPanel() {
  const { activePasses, forceClosePass } = useOpsSession();
  const [filterType, setFilterType] = useState('ALL');
  const [passToClose, setPassToClose] = useState(null);

  const filteredPasses = activePasses.filter((p) => {
    if (filterType === 'ALL') return true;
    return p.passType === filterType;
  });

  const overdueCount = activePasses.filter((p) => p.isOverdue).length;

  const handleConfirmClose = () => {
    if (passToClose) {
      forceClosePass(passToClose.id, 'Ops manual return override');
      setPassToClose(null);
    }
  };

  return (
    <div className="admin-card panel-passes" style={{ display: 'flex', flexDirection: 'column', minHeight: '560px' }}>
      <div className="admin-card-header">
        <h3 className="admin-card-title">
          <Footprints size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Active Movement Passes</span>
        </h3>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: overdueCount > 0 ? 'var(--status-absent-bg)' : 'var(--bg-surface-secondary)',
            color: overdueCount > 0 ? 'var(--status-absent-solid)' : 'var(--text-secondary)',
            border: `1px solid ${overdueCount > 0 ? 'var(--status-absent-border)' : 'var(--border-subtle)'}`
          }}
        >
          {activePasses.length} Out {overdueCount > 0 && `(${overdueCount} Overdue)`}
        </span>
      </div>

      {/* Filter Tabs by Pass Type */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setFilterType('ALL')}
          style={{
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.74rem',
            fontWeight: 700,
            background: filterType === 'ALL' ? 'var(--color-primary)' : 'var(--bg-surface-secondary)',
            color: filterType === 'ALL' ? '#ffffff' : 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          All ({activePasses.length})
        </button>

        {PASS_TYPE_LIST.map((pt) => {
          const count = activePasses.filter((p) => p.passType === pt.id).length;
          const isActive = filterType === pt.id;
          return (
            <button
              key={pt.id}
              type="button"
              onClick={() => setFilterType(pt.id)}
              style={{
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.74rem',
                fontWeight: 700,
                background: isActive ? pt.color : 'var(--bg-surface-secondary)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{pt.icon}</span>
              <span>{pt.label} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* List of Pass Cards */}
      <div className="pass-card-list" style={{ flex: 1 }}>
        {filteredPasses.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No Active Passes in Category"
            description="All participants in this pass category are accounted for inside the venue."
          />
        ) : (
          filteredPasses.map((pass) => (
            <PassCard
              key={pass.id}
              pass={pass}
              onForceClose={(p) => setPassToClose(p)}
            />
          ))
        )}
      </div>

      {/* Force Close Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(passToClose)}
        title="Force Return Movement Pass?"
        message={`This will immediately close the ${passToClose?.passType} pass for ${passToClose?.participantName} (${passToClose?.team}).`}
        confirmText="Confirm Pass Return"
        cancelText="Keep Open"
        confirmVariant="danger"
        onConfirm={handleConfirmClose}
        onCancel={() => setPassToClose(null)}
      />
    </div>
  );
}
