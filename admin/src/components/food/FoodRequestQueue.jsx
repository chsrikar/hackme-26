import React, { useState } from 'react';
import { Utensils, Plus, CheckCircle2, Clock } from 'lucide-react';
import { useOpsSession } from '../../context/OpsSessionContext';
import FoodRequestCard from './FoodRequestCard';
import NewFoodRequestModal from './NewFoodRequestModal';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

export default function FoodRequestQueue() {
  const { foodRequests, advanceFoodStatus } = useOpsSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'pending' | 'preparing' | 'ready' | 'delivered' | 'all'

  const deliveredCount = foodRequests.filter((f) => f.status === 'delivered').length;
  const pendingCount = foodRequests.filter((f) => f.status !== 'delivered').length;

  const filteredRequests = foodRequests.filter((req) => {
    if (statusFilter === 'active') return req.status !== 'delivered';
    if (statusFilter === 'all') return true;
    return req.status === statusFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--status-present-bg)',
              color: 'var(--status-present-text)'
            }}
          >
            {deliveredCount} Delivered
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--status-warning-bg)',
              color: 'var(--status-warning-text)'
            }}
          >
            {pendingCount} Pending
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          style={{ fontSize: '0.76rem', minHeight: '30px', padding: '2px 10px' }}
        >
          + New Request
        </Button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '2px' }}>
        {[
          { key: 'active', label: 'Active Pipeline' },
          { key: 'pending', label: 'Pending' },
          { key: 'preparing', label: 'Prep' },
          { key: 'ready', label: 'Ready' },
          { key: 'delivered', label: 'Delivered' },
          { key: 'all', label: 'All' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            style={{
              padding: '3px 8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              background: statusFilter === tab.key ? 'var(--color-primary)' : 'var(--bg-surface-secondary)',
              color: statusFilter === tab.key ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="queue-card-list" style={{ flex: 1 }}>
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No Food Requests in Queue"
            description="Orders placed by participants or logged manually by ops staff will appear here."
          />
        ) : (
          filteredRequests.map((req) => (
            <FoodRequestCard
              key={req.id}
              request={req}
              onAdvanceStatus={advanceFoodStatus}
            />
          ))
        )}
      </div>

      {/* Manual Order Modal */}
      <NewFoodRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
