import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Error Boundary - catches React rendering errors and shows a friendly message
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Report to parent frame for auto-fix
    try {
      window.parent.postMessage({
        type: 'broodle-preview-error',
        errors: [{
          message: error.message,
          source: info.componentStack || '',
          stack: error.stack || '',
          timestamp: Date.now()
        }]
      }, '*');
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e9ecf1',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '24px'
        }}>
          <div style={{
            maxWidth: '420px',
            textAlign: 'center',
            background: 'white',
            borderRadius: '16px',
            padding: '40px 32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(140deg, #ff8a5c, #e2501f)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '20px'
            }}>✨</div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1f2937',
              margin: '0 0 8px'
            }}>Making improvements...</h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 24px',
              lineHeight: 1.5
            }}>
              Broodle Build is automatically fixing this. The preview will update in a moment.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(140deg, #ff8a5c, #e2501f)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Refresh Preview
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById("root");
if (!container) throw new Error('Root container #root not found');

/* Reuse the existing root across HMR re-execution. Without this, every time
   this module is re-evaluated the dev server calls createRoot() again on the
   same container, which React rejects with:
   "You are calling ReactDOMClient.createRoot() on a container that has already
    been passed to createRoot() before." */
type RootHandle = { render: (node: React.ReactNode) => void };
const ROOT_KEY = "__hos_react_root";
const host = window as unknown as Record<string, RootHandle | undefined>;

let root = host[ROOT_KEY];
if (!root) {
  root = ReactDOM.createRoot(container);
  host[ROOT_KEY] = root;
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
