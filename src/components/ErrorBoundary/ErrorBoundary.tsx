// ═══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY
// Catches JavaScript errors in child components and displays fallback UI
// ═══════════════════════════════════════════════════════════════════════════════

import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import styles from "./ErrorBoundary.module.scss";

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode;
  /** Called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Key to reset the error boundary (e.g., route path) */
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state when resetKey changes (e.g., route navigation)
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className={styles.container} role="alert">
          <div className={styles.content}>
            <div className={styles.iconWrapper}>
              <AlertTriangle size={48} strokeWidth={1.5} />
            </div>

            <h1 className={styles.title}>Something went wrong</h1>

            <p className={styles.message}>
              An unexpected error occurred. You can try again or return to the
              home page.
            </p>

            {this.state.error && (
              <details className={styles.details}>
                <summary>Error details</summary>
                <pre className={styles.errorText}>
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                onClick={this.handleReset}
                className={styles.buttonPrimary}
              >
                <RotateCcw size={16} />
                Try Again
              </button>
              {window.location.pathname !== "/" && (
                <button
                  type="button"
                  onClick={this.handleGoHome}
                  className={styles.buttonSecondary}
                >
                  <Home size={16} />
                  Go Home
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
