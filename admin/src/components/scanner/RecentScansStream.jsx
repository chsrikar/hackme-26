import React from 'react';
import { Activity, Clock, CheckCircle2, ArrowUpRight, ArrowDownLeft, Footprints } from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import { getPassConfig } from '../../utils/passTypeConfig';

export default function RecentScansStream() {
  const { recentScans } = useOpsSession();

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="admin-card recent-scans-card">
      <div className="admin-card-header" style={{ marginBottom: '10px', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} style={{ color: 'var(--color-primary)' }} />
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Live Scan Activity
          </h4>
          <span className="live-pulse-dot" title="Real-time live updates active"></span>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          {recentScans.length} {recentScans.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      <div className="recent-scans-list">
        {recentScans.length === 0 ? (
          <div className="recent-scans-empty">
            <div className="empty-radar-circle">
              <Activity size={20} style={{ color: 'var(--text-dim)' }} />
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Awaiting Scans
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '240px' }}>
              Point any QR badge at the camera or enter a code above. Real-time receipts stream here.
            </div>
          </div>
        ) : (
          recentScans.map((scan) => {
            const isReturn = scan.actionType === 'RETURN';
            const isPass = scan.actionType === 'PASS_OUT';
            const cfg = isPass ? getPassConfig(scan.passType) : null;

            return (
              <div key={scan.id} className="recent-scan-item animate-fade-in">
                <div className="scan-item-badge">
                  {isReturn ? (
                    <div className="badge-icon-return" title="Returned">
                      <ArrowDownLeft size={13} />
                    </div>
                  ) : isPass ? (
                    <div
                      className="badge-icon-pass"
                      style={{ background: cfg?.bgColor || 'rgba(59,130,246,0.15)', color: cfg?.color || '#3b82f6' }}
                      title={`Out: ${cfg?.label}`}
                    >
                      <Footprints size={13} />
                    </div>
                  ) : (
                    <div className="badge-icon-checkin" title="Checked In">
                      <CheckCircle2 size={13} />
                    </div>
                  )}
                </div>

                <div className="scan-item-details">
                  <div className="scan-item-top">
                    <span className="scan-item-name">{scan.name}</span>
                    <span className="scan-item-time">{formatRelativeTime(scan.timestamp)}</span>
                  </div>

                  <div className="scan-item-sub">
                    <span className="scan-item-roll">{scan.rollNo}</span>
                    {scan.team && (
                      <>
                        <span className="dot-sep">•</span>
                        <span className="scan-item-team">{scan.team}</span>
                      </>
                    )}
                    {isPass && cfg && (
                      <>
                        <span className="dot-sep">•</span>
                        <span className="scan-item-tag" style={{ color: cfg.color, borderColor: cfg.borderColor }}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </>
                    )}
                    {isReturn && (
                      <>
                        <span className="dot-sep">•</span>
                        <span className="scan-item-tag return-tag">
                          Pass Closed
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
