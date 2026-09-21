import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/mobile.css';
import App from './App.jsx';

// Global Error Catching for debugging
window.addEventListener('error', (event) => {
  console.error('[Global Error Caught]:', event.error || event.message);
  const errDiv = document.createElement('div');
  errDiv.id = 'runtime-error-banner';
  errDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#b91c1c;color:#fff;padding:20px;font-family:monospace;font-size:14px;white-space:pre-wrap;border-bottom:2px solid #fff;';
  errDiv.innerText = `RUNTIME ERROR:\n${event.message}\n${event.filename}:${event.lineno}:${event.colno}\n\nStack:\n${event.error?.stack || 'No stack'}`;
  document.body.prepend(errDiv);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]:', event.reason);
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary Caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#18181b', color: '#ef4444', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', color: '#f87171' }}>⚠️ React Rendering Exception</h1>
          <p style={{ color: '#fff', margin: '16px 0', fontSize: '16px' }}>{this.state.error?.toString()}</p>
          <pre style={{ background: '#09090b', padding: '16px', borderRadius: '4px', overflowX: 'auto', color: '#a1a1aa' }}>
            {this.state.error?.stack}
          </pre>
          <pre style={{ background: '#09090b', padding: '16px', borderRadius: '4px', overflowX: 'auto', color: '#71717a', marginTop: '12px' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
} else {
  console.error('Root element #root not found!');
}
