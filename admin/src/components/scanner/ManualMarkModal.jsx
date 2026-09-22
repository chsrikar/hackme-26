import React, { useState, useEffect } from 'react';
import { UserCheck, X, ShieldAlert } from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import Button from '../common/Button';

export default function ManualMarkModal({ isOpen, onClose, preselectedParticipant = null }) {
  const { participants, manualCheckIn } = useOpsSession();
  const [selectedId, setSelectedId] = useState('');
  const [targetStatus, setTargetStatus] = useState('present');
  const [reason, setReason] = useState('Participant badge QR damaged / Phone battery depleted');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedParticipant) {
      setSelectedId(preselectedParticipant.id);
      setTargetStatus(preselectedParticipant.status === 'present' ? 'absent' : 'present');
    } else if (participants.length > 0 && !selectedId) {
      setSelectedId(participants[0].id);
    }
  }, [preselectedParticipant, participants]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) return;

    setSubmitting(true);
    try {
      await manualCheckIn(selectedId, targetStatus, reason);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1.12rem' }}>Manual Participant Check-In Override</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="participant-selector">
              Select Participant
            </label>
            <select
              id="participant-selector"
              className="form-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.rollNo}) — {p.team} [{p.status.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Desired Status</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setTargetStatus('present')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: targetStatus === 'present' ? '2px solid var(--status-present-solid)' : '1px solid var(--border-strong)',
                  background: targetStatus === 'present' ? 'var(--status-present-bg)' : 'var(--bg-surface)',
                  color: targetStatus === 'present' ? 'var(--status-present-text)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                CHECK-IN (Present)
              </button>

              <button
                type="button"
                onClick={() => setTargetStatus('absent')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: targetStatus === 'absent' ? '2px solid var(--status-absent-solid)' : '1px solid var(--border-strong)',
                  background: targetStatus === 'absent' ? 'var(--status-absent-bg)' : 'var(--bg-surface)',
                  color: targetStatus === 'absent' ? 'var(--status-absent-text)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                MARK ABSENT
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="override-notes">
              Override Reason / Security Note
            </label>
            <input
              id="override-notes"
              type="text"
              className="form-input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div style={{ padding: '8px 12px', background: 'var(--bg-surface-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <ShieldAlert size={15} />
            <span>Audit log will record this change as <code>marked_by: ops_override</code>.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Confirm Override'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
