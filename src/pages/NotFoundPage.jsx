import Button from '../components/common/Button';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="section-spacer" style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-lg)' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', marginBottom: 'var(--space-md)' }}>
          <AlertTriangle size={48} color="var(--color-warning)" />
        </div>
        <h1 className="code-font" style={{ fontSize: '3.5rem', color: 'var(--color-primary)', marginBottom: 'var(--space-xs)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-sm)' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
          The computational path you are trying to resolve does not exist or has been relocated to another memory address.
        </p>
        <Button to="/" variant="primary" size="md">
          <Home size={18} /> Return to HackMatrix Home
        </Button>
      </div>
    </div>
  );
}
