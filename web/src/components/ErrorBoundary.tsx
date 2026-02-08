import type { ReactNode } from 'react';
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center w-full h-full p-8">
          <div className="glass-panel rounded-xl p-8 flex flex-col items-center gap-4 max-w-md">
            <div className="flex items-center gap-2 text-danger">
              <AlertTriangle size={20} />
              <span className="text-base font-semibold">Something went wrong</span>
            </div>
            <p className="text-sm text-text-secondary text-center">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="text-xs text-text-tertiary font-mono max-w-full overflow-auto max-h-40 p-3 rounded-lg bg-surface-100">
                {this.state.error?.stack}
              </pre>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 text-sm rounded-lg border border-border text-text-secondary hover:bg-glass-hover transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  fetch(`http://localhost:5183/exit`, { method: 'POST' }).catch(() => {});
                }}
                className="px-4 py-2 text-sm rounded-lg bg-px-600 text-white hover:bg-px-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
