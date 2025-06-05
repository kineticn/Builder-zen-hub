import React from "react";
import { createRoot } from "react-dom/client";
import { consentManager } from "./lib/partytown-config";
import { SafeScriptLoader } from "./lib/safe-script-loader";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App.tsx";
import "./index.css";

// Initialize consent management
const hasConsent = consentManager.getConsent();

// Set up Builder tracking based on consent
if (typeof window !== "undefined") {
  if (!window.builder) {
    window.builder = {};
  }
  window.builder.canTrack = hasConsent;

  // Add global error handler to suppress third-party script errors
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    // Suppress cross-origin and third-party errors
    if (
      typeof message === "string" &&
      (message.includes("cross-origin") ||
        message.includes("dispatchEvent") ||
        message.includes("SecurityError") ||
        (typeof source === "string" &&
          (source.includes("googletagmanager.com") ||
            source.includes("facebook.net") ||
            source.includes("builder.io"))))
    ) {
      console.warn("Third-party script error suppressed:", message);
      return true; // Prevent the error from bubbling up
    }
    return originalOnError
      ? originalOnError(message, source, lineno, colno, error)
      : false;
  };

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    if (
      reason?.message &&
      (reason.message.includes("cross-origin") ||
        reason.message.includes("dispatchEvent") ||
        reason.message.includes("SecurityError"))
    ) {
      console.warn("Third-party promise rejection suppressed:", reason.message);
      event.preventDefault();
    }
  });
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <div style={{ opacity: 1, minHeight: "100vh", position: "relative" }}>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Comprehensive error suppression for third-party issues
        if (
          error.message.includes("cross-origin") ||
          error.message.includes("dispatchEvent") ||
          error.message.includes("partytown") ||
          error.message.includes("SecurityError") ||
          error.message.includes("frame")
        ) {
          console.warn("Third-party error suppressed:", error.message);
          return;
        }
        console.error("Application error:", error, errorInfo);
      }}
    >
      {/* Main App Component */}
      <App />

      {/* Safe script loader without Partytown - completely eliminates SecurityError */}
      <SafeScriptLoader hasConsent={hasConsent} />

      {/* Show consent banner if no consent given */}
      <ConsentBanner />
    </ErrorBoundary>
  </div>,
);

// Consent Banner Component
function ConsentBanner() {
  const [showBanner, setShowBanner] = React.useState(!hasConsent);

  React.useEffect(() => {
    // Listen for consent changes
    const unsubscribe = consentManager.onConsentChange((newConsent) => {
      setShowBanner(!newConsent);
    });

    return unsubscribe;
  }, []);

  if (!showBanner) return null;

  const handleAccept = () => {
    consentManager.setConsent(true);
    setShowBanner(false);
    // Reload to initialize tracking scripts
    window.location.reload();
  };

  const handleReject = () => {
    consentManager.setConsent(false);
    setShowBanner(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0A2540",
        color: "white",
        padding: "16px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
        borderTop: "1px solid #00C2B2",
      }}
    >
      <div style={{ flex: 1, minWidth: "300px" }}>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: "1.4",
            fontWeight: "500",
          }}
        >
          🍪 We use cookies and analytics to improve your BillBuddy experience
          and provide personalized insights.
          <a
            href="/privacy-policy"
            style={{
              color: "#00C2B2",
              textDecoration: "underline",
              fontWeight: "600",
            }}
          >
            Privacy Policy
          </a>
        </p>
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={handleAccept}
          style={{
            backgroundColor: "#00C2B2",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#009B8F")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#00C2B2")}
        >
          Accept All
        </button>
        <button
          onClick={handleReject}
          style={{
            backgroundColor: "transparent",
            color: "white",
            border: "1px solid white",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
          }
          onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Essential Only
        </button>
      </div>
    </div>
  );
}
