import React, { useCallback, useEffect } from "react";
import { consentManager } from "@/lib/partytown-config";

// Types for Builder tracking events
export interface BuilderTrackingEvent {
  event: string;
  data?: Record<string, any>;
  timestamp?: number;
}

export interface BuilderUserProperties {
  userId?: string;
  email?: string;
  planType?: "free" | "premium";
  onboardingComplete?: boolean;
  householdType?: string;
  billCount?: number;
  lastActive?: string;
}

// Custom hook for Builder.io tracking
export const useBuilderTracking = () => {
  const trackEvent = useCallback(
    (event: string, data?: Record<string, any>) => {
      // Check if user has consented and Builder is available
      if (
        !consentManager.getConsent() ||
        typeof window === "undefined" ||
        !window.builder?.canTrack
      ) {
        console.log(`Builder tracking disabled for event: ${event}`);
        return;
      }

      try {
        // Enhanced event data with BillBuddy context
        const enhancedData = {
          ...data,
          // App context
          app: {
            name: "BillBuddy",
            version: "1.0.0",
            page: window.location.pathname,
            url: window.location.href,
          },
          // User context (without PII)
          user: {
            sessionId: sessionStorage.getItem("billbuddy_session_id"),
            hasOnboarded:
              localStorage.getItem("billbuddy_onboarding_complete") === "true",
            householdType: localStorage.getItem("billbuddy_household_type"),
          },
          // Timestamp
          timestamp: Date.now(),
        };

        // Call Builder tracking function
        if (window.builder?.track) {
          window.builder.track(event, enhancedData);
        } else {
          console.warn("Builder tracking function not available");
        }
      } catch (error) {
        console.error("Builder tracking error:", error);
      }
    },
    [],
  );

  const identifyUser = useCallback(
    (properties: BuilderUserProperties) => {
      if (!consentManager.getConsent()) return;

      trackEvent("user_identify", {
        properties: {
          ...properties,
          // Remove PII if user hasn't specifically consented to it
          email: properties.email ? "redacted@example.com" : undefined,
        },
      });
    },
    [trackEvent],
  );

  const trackPageView = useCallback(
    (pageName?: string) => {
      trackEvent("page_view", {
        page: pageName || window.location.pathname,
        title: document.title,
        referrer: document.referrer,
      });
    },
    [trackEvent],
  );

  const trackUserAction = useCallback(
    (action: string, details?: Record<string, any>) => {
      trackEvent("user_action", {
        action,
        ...details,
      });
    },
    [trackEvent],
  );

  // BillBuddy-specific tracking methods
  const trackBillAction = useCallback(
    (
      action: "view" | "pay" | "add" | "delete" | "edit",
      billData?: {
        billId?: string;
        amount?: number;
        category?: string;
        dueDate?: string;
      },
    ) => {
      trackEvent("bill_action", {
        action,
        bill: billData,
      });
    },
    [trackEvent],
  );

  const trackOnboardingStep = useCallback(
    (step: number, stepName: string, completed: boolean = true) => {
      trackEvent("onboarding_step", {
        step,
        stepName,
        completed,
        totalSteps: 7,
      });
    },
    [trackEvent],
  );

  const trackFinancialInsight = useCallback(
    (insightType: string, insightData?: Record<string, any>) => {
      trackEvent("financial_insight", {
        type: insightType,
        ...insightData,
      });
    },
    [trackEvent],
  );

  const trackError = useCallback(
    (error: Error, context?: Record<string, any>) => {
      trackEvent("app_error", {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack?.substring(0, 1000), // Limit stack trace length
        },
        context,
      });
    },
    [trackEvent],
  );

  return {
    trackEvent,
    identifyUser,
    trackPageView,
    trackUserAction,
    trackBillAction,
    trackOnboardingStep,
    trackFinancialInsight,
    trackError,
  };
};

// Custom hook for tracking page views automatically
export const usePageTracking = (pageName?: string) => {
  const { trackPageView } = useBuilderTracking();

  useEffect(() => {
    // Track page view on mount
    trackPageView(pageName);
  }, [trackPageView, pageName]);
};

// Custom hook for tracking user interactions
export const useInteractionTracking = () => {
  const { trackUserAction } = useBuilderTracking();

  const trackClick = useCallback(
    (elementName: string, additionalData?: Record<string, any>) => {
      trackUserAction("click", {
        element: elementName,
        ...additionalData,
      });
    },
    [trackUserAction],
  );

  const trackFormSubmit = useCallback(
    (formName: string, success: boolean, errors?: string[]) => {
      trackUserAction("form_submit", {
        form: formName,
        success,
        errors,
      });
    },
    [trackUserAction],
  );

  const trackSearch = useCallback(
    (query: string, results?: number) => {
      trackUserAction("search", {
        query: query.substring(0, 100), // Limit query length for privacy
        resultCount: results,
      });
    },
    [trackUserAction],
  );

  const trackNavigation = useCallback(
    (
      from: string,
      to: string,
      method: "click" | "back" | "forward" = "click",
    ) => {
      trackUserAction("navigation", {
        from,
        to,
        method,
      });
    },
    [trackUserAction],
  );

  return {
    trackClick,
    trackFormSubmit,
    trackSearch,
    trackNavigation,
  };
};

// HOC for automatic page tracking
export const withPageTracking = <P extends object>(
  Component: React.ComponentType<P>,
  pageName?: string,
) => {
  return function WrappedComponent(props: P) {
    usePageTracking(pageName);
    return <Component {...props} />;
  };
};

// Global error boundary tracking
export class BuilderErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error if user has consented
    if (consentManager.getConsent() && window.builder?.track) {
      window.builder.track("react_error", {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack?.substring(0, 1000),
        },
        errorInfo: {
          componentStack: errorInfo.componentStack?.substring(0, 1000),
        },
        url: window.location.href,
        timestamp: Date.now(),
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="text-gray-600">
              We've been notified and are working on a fix.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
