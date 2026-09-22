import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          maxWidth: '480px',
          margin: '40px auto'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--bg-surface-secondary)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}
        >
          <HelpCircle size={32} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
          The requested administrative view does not exist or has been moved.
        </p>
        <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    </PageWrapper>
  );
}
