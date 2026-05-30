// src/components/ErrorBoundary.jsx — Error boundary for crash recovery

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100vh',
          padding: '20px',
          textAlign: 'center',
          background: 'var(--bg-base)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚠️</div>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'var(--accent-red)',
          }}>
            Something went wrong
          </h1>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            maxWidth: '300px',
            lineHeight: '1.5',
          }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              marginBottom: '16px',
              maxWidth: '400px',
              textAlign: 'left',
              background: 'var(--bg-card)',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              maxHeight: '150px',
              overflow: 'auto',
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                Error Details
              </summary>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleReload}
            style={{
              padding: '8px 20px',
              background: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '4px',
              color: 'var(--accent-green)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 255, 136, 0.18)';
              e.target.style.boxShadow = '0 0 16px rgba(0, 255, 136, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 255, 136, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
