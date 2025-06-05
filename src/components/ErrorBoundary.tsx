import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    console.error("ErrorBoundary caught an error:", error);

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // For Partytown-related errors, don't break the app
    if (
      error.message.includes("cross-origin") ||
      error.message.includes("partytown") ||
      error.message.includes("dispatchEvent")
    ) {
      console.warn("Non-critical Partytown error suppressed:", error.message);
      // Reset the error state for these specific errors
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI or return null for non-critical errors
      if (
        this.state.error?.message.includes("cross-origin") ||
        this.state.error?.message.includes("partytown") ||
        this.state.error?.message.includes("dispatchEvent")
      ) {
        // For Partytown errors, just render children without the error
        return this.props.children;
      }

      // For other errors, show fallback
      return (
        this.props.fallback || (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#666",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              margin: "10px 0",
            }}
          >
            <h3>Something went wrong</h3>
            <p>Please refresh the page or try again later.</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "8px 16px",
                backgroundColor: "#0A2540",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Refresh Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode,
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
