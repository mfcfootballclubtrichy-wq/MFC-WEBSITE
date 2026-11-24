import React from 'react';

/**
 * ErrorBoundary.jsx — Prevents blank white screen crashes across the entire React tree.
 * Catches any uncaught runtime exception, logs the diagnostic info, and displays a
 * branded fallback card with quick recovery actions.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MFC React Error Boundary Caught Exception:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg, #0A0A0A)',
            color: 'var(--text, #F8FAFC)',
            padding: '2rem 1.5rem',
            fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
          }}
        >
          <div
            style={{
              maxWidth: '540px',
              width: '100%',
              background: 'var(--surface, #1E293B)',
              border: '1px solid var(--border, rgba(255,255,255,0.1))',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(210, 4, 45, 0.15)',
                color: '#D2042D',
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontWeight: 'bold',
              }}
            >
              ⚠️
            </div>

            <h1
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em',
              }}
            >
              Application Encountered an Issue
            </h1>

            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--muted, #94A3B8)',
                lineHeight: 1.6,
                marginBottom: '1.8rem',
              }}
            >
              We encountered a temporary interface loading issue. Your session and data are secure.
              Please reload or return to the main dashboard.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  background: 'var(--accent, #D2042D)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.75rem 1.75rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                🔄 Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                style={{
                  background: 'transparent',
                  color: 'var(--text, #F8FAFC)',
                  border: '1px solid var(--border, rgba(255,255,255,0.2))',
                  borderRadius: '999px',
                  padding: '0.75rem 1.75rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                🏠 Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
