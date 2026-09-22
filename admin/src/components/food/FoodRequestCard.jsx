import React from 'react';
import { Clock, ArrowRight, CheckCircle, ChefHat, PackageCheck, Utensils } from 'lucide-react';
import Tag from '../common/Tag';
import Button from '../common/Button';
import { getElapsedTime } from '../../utils/timeFormat';

export default function FoodRequestCard({ request, onAdvanceStatus }) {
  const isDelivered = request.status === 'delivered';

  const getNextActionLabel = () => {
    switch (request.status) {
      case 'pending':
        return { label: 'Start Preparing', icon: ChefHat, variant: 'warning' };
      case 'preparing':
        return { label: 'Mark Ready', icon: PackageCheck, variant: 'primary' };
      case 'ready':
        return { label: 'Mark Delivered', icon: CheckCircle, variant: 'primary' };
      default:
        return null;
    }
  };

  const nextAction = getNextActionLabel();

  return (
    <div className="queue-item-card" style={{ opacity: isDelivered ? 0.75 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {request.team}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              ({request.participantName || 'Desk'})
            </span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Location: <strong>{request.table}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Tag type={request.dietary?.toLowerCase() || 'default'}>
            {request.dietary || 'Standard'}
          </Tag>
          <span className={`pipeline-badge ${request.status}`}>
            {request.status}
          </span>
        </div>
      </div>

      {/* Items Description */}
      <div
        style={{
          background: 'var(--bg-surface-secondary)',
          padding: '6px 10px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.84rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <Utensils size={14} style={{ color: 'var(--color-primary)' }} />
        <span>{request.items}</span>
      </div>

      {request.notes && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Note: {request.notes}
        </div>
      )}

      {/* Bottom bar with timestamp and pipeline advancement button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          <Clock size={12} />
          <span>Requested {getElapsedTime(request.requestedAt)} ago</span>
        </div>

        {nextAction && (
          <Button
            variant={nextAction.variant}
            size="sm"
            icon={nextAction.icon}
            onClick={() => onAdvanceStatus(request.id)}
            style={{ fontSize: '0.76rem', minHeight: '28px', padding: '2px 10px' }}
          >
            {nextAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
