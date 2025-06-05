import React from "react";

interface ScriptLoaderProps {
  hasConsent: boolean;
}

// Feature detection for Partytown compatibility
const canUsePartytown = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    // Check if we're in a cross-origin isolated context
    const isSecureContext = window.isSecureContext;
    const hasCrossOriginIsolation = window.crossOriginIsolated;

    // Check if we're running in development or if COOP/COEP headers are set
    const isDevelopment = import.meta.env.MODE === "development";

    // For production deployments, check if proper headers are set
    if (!isDevelopment) {
      // Try to detect if we have the right headers by checking for Worker support
      try {
        new Worker(
          URL.createObjectURL(
            new Blob([""], { type: "application/javascript" }),
          ),
        ).terminate();
      } catch (e) {
        console.warn(
          "Web Workers not properly supported, falling back to regular scripts",
        );
        return false;
      }
    }

    return true;
  } catch (error) {
    console.warn("Partytown compatibility check failed:", error);
    return false;
  }
};

// Track if we've already detected Partytown issues
let partytownFailed = false;

// Error handler for Partytown scripts
const handlePartytownError = (error: any) => {
  if (
    error?.message?.includes("cross-origin") ||
    error?.message?.includes("dispatchEvent") ||
    error?.message?.includes("SecurityError")
  ) {
    partytownFailed = true;
    console.warn(
      "Partytown failed due to cross-origin restrictions, falling back to regular scripts",
    );
    // Reload the page to use regular scripts
    window.location.reload();
  }
};

// Global error handler for cross-origin issues
if (typeof window !== "undefined") {
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (
      typeof message === "string" &&
      (message.includes("cross-origin") || message.includes("dispatchEvent"))
    ) {
      handlePartytownError(error);
      return true; // Prevent the error from bubbling up
    }
    return originalOnError
      ? originalOnError(message, source, lineno, colno, error)
      : false;
  };

  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason?.message?.includes("cross-origin") ||
      event.reason?.message?.includes("dispatchEvent")
    ) {
      handlePartytownError(event.reason);
      event.preventDefault();
    }
  });
}

// Regular script component (fallback)
const RegularScripts: React.FC<{ hasConsent: boolean }> = ({ hasConsent }) => {
  if (!hasConsent) return null;

  return (
    <>
      {/* Google Analytics - Regular */}
      <script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        async
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: 'BillBuddy FinTech App',
                page_location: window.location.href,
                send_page_view: true,
                anonymize_ip: true,
                allow_ad_personalization_signals: false
              });
              gtag('event', 'app_load', {
                event_category: 'engagement',
                event_label: 'app_startup'
              });
            } catch (error) {
              console.warn('Google Analytics error:', error.message);
            }
          `,
        }}
      />

      {/* Facebook Pixel - Regular */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', 'FB_PIXEL_ID');
              fbq('track', 'PageView');
              fbq('trackCustom', 'FinTechAppLoad', {
                app_name: 'BillBuddy',
                category: 'finance'
              });
            } catch (error) {
              console.warn('Facebook Pixel error:', error.message);
            }
          `,
        }}
      />

      {/* Builder.io - Regular */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              window.builder = window.builder || {};
              window.builder.canTrack = ${hasConsent};
              
              window.builder.track = function(event, data) {
                if (!window.builder.canTrack) return;
                
                try {
                  const trackingData = {
                    event: event,
                    data: data || {},
                    url: window.location.href,
                    timestamp: Date.now(),
                    sessionId: sessionStorage.getItem('billbuddy_session_id') || 'anonymous',
                    app: {
                      name: 'BillBuddy',
                      version: '1.0.0',
                      environment: '${import.meta.env.MODE}'
                    }
                  };

                  fetch('https://builder.io/api/v1/track', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer BUILDER_API_KEY'
                    },
                    body: JSON.stringify(trackingData)
                  }).catch(err => console.warn('Builder tracking failed:', err));
                } catch (error) {
                  console.warn('Builder tracking error:', error);
                }
              };

              if (!sessionStorage.getItem('billbuddy_session_id')) {
                sessionStorage.setItem('billbuddy_session_id',
                  'sess_' + Math.random().toString(36).substr(2, 9) + Date.now()
                );
              }

              window.builder.track('page_view', {
                page: window.location.pathname,
                title: document.title
              });
            } catch (error) {
              console.warn('Builder.io setup error:', error.message);
            }
          `,
        }}
      />
    </>
  );
};

// Partytown scripts component
const PartytownScripts: React.FC<{ hasConsent: boolean }> = ({
  hasConsent,
}) => {
  if (!hasConsent) return null;

  return (
    <>
      {/* Google Analytics - Partytown */}
      <script
        type="text/partytown"
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        async
      />
      <script
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              window.dataLayer = window.dataLayer || [];
              function gtag(){
                try {
                  dataLayer.push(arguments);
                } catch (e) {
                  console.warn('gtag error:', e.message);
                }
              }
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: 'BillBuddy FinTech App',
                page_location: window.location.href,
                send_page_view: true,
                anonymize_ip: true,
                allow_ad_personalization_signals: false
              });
              gtag('event', 'app_load', {
                event_category: 'engagement',
                event_label: 'app_startup'
              });
            } catch (error) {
              console.warn('Google Analytics error:', error.message);
              throw error; // Let Partytown handle this
            }
          `,
        }}
      />

      {/* Facebook Pixel - Partytown */}
      <script
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){
                try {
                  n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments);
                } catch (e) {
                  console.warn('fbq error:', e.message);
                }
              };
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', 'FB_PIXEL_ID');
              fbq('track', 'PageView');
              fbq('trackCustom', 'FinTechAppLoad', {
                app_name: 'BillBuddy',
                category: 'finance'
              });
            } catch (error) {
              console.warn('Facebook Pixel error:', error.message);
              throw error; // Let Partytown handle this
            }
          `,
        }}
      />

      {/* Builder.io - Partytown */}
      <script
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              window.builder = window.builder || {};
              window.builder.canTrack = ${hasConsent};
              
              window.builder.track = function(event, data) {
                if (!window.builder.canTrack) return;
                
                try {
                  const trackingData = {
                    event: event,
                    data: data || {},
                    url: window.location.href,
                    timestamp: Date.now(),
                    sessionId: sessionStorage.getItem('billbuddy_session_id') || 'anonymous',
                    app: {
                      name: 'BillBuddy',
                      version: '1.0.0',
                      environment: '${import.meta.env.MODE}'
                    }
                  };

                  fetch('https://builder.io/api/v1/track', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer BUILDER_API_KEY'
                    },
                    body: JSON.stringify(trackingData)
                  }).catch(err => console.warn('Builder tracking failed:', err));
                } catch (error) {
                  console.warn('Builder tracking error:', error);
                }
              };

              if (!sessionStorage.getItem('billbuddy_session_id')) {
                sessionStorage.setItem('billbuddy_session_id',
                  'sess_' + Math.random().toString(36).substr(2, 9) + Date.now()
                );
              }

              window.builder.track('page_view', {
                page: window.location.pathname,
                title: document.title
              });
            } catch (error) {
              console.warn('Builder.io setup error:', error.message);
              throw error; // Let Partytown handle this
            }
          `,
        }}
      />
    </>
  );
};

// Main script loader component
export const ScriptLoader: React.FC<ScriptLoaderProps> = ({ hasConsent }) => {
  const [usePartytown, setUsePartytown] = React.useState(() => {
    // Check if Partytown previously failed
    if (partytownFailed) return false;
    return canUsePartytown();
  });

  React.useEffect(() => {
    // Set up a timeout to detect if Partytown is failing
    const timeout = setTimeout(() => {
      // If we're still having issues after 3 seconds, fall back
      if (partytownFailed) {
        setUsePartytown(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  // If we detect we can't use Partytown, use regular scripts
  if (!usePartytown || partytownFailed) {
    console.log(
      "Using regular script loading due to cross-origin restrictions",
    );
    return <RegularScripts hasConsent={hasConsent} />;
  }

  // Try to use Partytown
  return <PartytownScripts hasConsent={hasConsent} />;
};

export default ScriptLoader;
