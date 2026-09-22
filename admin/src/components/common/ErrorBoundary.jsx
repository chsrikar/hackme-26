import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('ops_roster');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#0a0d14',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            background: '#131824',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '28px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ef4444', marginBottom: '12px' }}>
              ⚠️ Interface Rendering Notice
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.5 }}>
              A temporary issue occurred while rendering the operations dashboard. Click below to refresh with clean state.
            </p>
            {this.state.error?.message && (
              <pre style={{
                background: '#090d16',
                border: '1px solid #1e293b',
                color: '#f59e0b',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '20px'
              }}>
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reset & Reload Clean
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
