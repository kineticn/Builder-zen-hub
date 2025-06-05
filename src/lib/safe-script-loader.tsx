import React from "react";

interface SafeScriptLoaderProps {
  hasConsent: boolean;
}

/**
 * Safe Script Loader
 *
 * This component completely avoids Partytown to prevent cross-origin SecurityErrors.
 * It loads all third-party scripts directly on the main thread with proper error handling.
 *
 * This is the safest approach for production environments where cross-origin
 * restrictions might cause issues with Partytown.
 */
export const SafeScriptLoader: React.FC<SafeScriptLoaderProps> = ({
  hasConsent,
}) => {
  React.useEffect(() => {
    if (!hasConsent) return;

    // Set up global error handler to catch and suppress script errors
    const handleScriptError = (event: ErrorEvent) => {
      // Suppress errors from third-party scripts
      if (
        event.filename &&
        (event.filename.includes("googletagmanager.com") ||
          event.filename.includes("facebook.net") ||
          event.filename.includes("builder.io"))
      ) {
        console.warn("Third-party script error suppressed:", event.error);
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleScriptError);

    return () => {
      window.removeEventListener("error", handleScriptError);
    };
  }, [hasConsent]);

  if (!hasConsent) return null;

  return (
    <>
      {/* Google Analytics */}
      <script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        async
        onError={(e) => console.warn("GA script load error (non-critical):", e)}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                window.dataLayer = window.dataLayer || [];
                function gtag(){
                  try {
                    dataLayer.push(arguments);
                  } catch (e) {
                    console.warn('gtag error (non-critical):', e.message);
                  }
                }
                gtag('js', new Date());
                gtag('config', 'GA_MEASUREMENT_ID', {
                  page_title: 'BillBuddy FinTech App',
                  page_location: window.location.href,
                  send_page_view: true,
                  custom_map: {
                    'user_type': 'billbuddy_user',
                    'app_version': '1.0.0'
                  },
                  // Privacy-focused settings
                  anonymize_ip: true,
                  allow_ad_personalization_signals: false
                });

                // Track key BillBuddy events
                gtag('event', 'app_load', {
                  event_category: 'engagement',
                  event_label: 'app_startup'
                });
                
                console.log('Google Analytics initialized successfully');
              } catch (error) {
                console.warn('Google Analytics initialization error (non-critical):', error.message);
              }
            })();
          `,
        }}
      />

      {/* Facebook Pixel */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){
                  try {
                    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments);
                  } catch (e) {
                    console.warn('fbq error (non-critical):', e.message);
                  }
                };
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');

                fbq('init', 'FB_PIXEL_ID');
                fbq('track', 'PageView');

                // Custom BillBuddy events
                fbq('trackCustom', 'FinTechAppLoad', {
                  app_name: 'BillBuddy',
                  category: 'finance'
                });
                
                console.log('Facebook Pixel initialized successfully');
              } catch (error) {
                console.warn('Facebook Pixel initialization error (non-critical):', error.message);
              }
            })();
          `,
        }}
      />

      {/* Builder.io Analytics */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Enhanced Builder tracking setup
                window.builder = window.builder || {};
                window.builder.canTrack = ${hasConsent};

                // Custom tracking function with error handling
                window.builder.track = function(event, data) {
                  if (!window.builder.canTrack) {
                    console.log('Builder tracking disabled - user has not consented');
                    return;
                  }

                  try {
                    const trackingData = {
                      event: event,
                      data: data || {},
                      url: window.location.href,
                      timestamp: Date.now(),
                      userAgent: navigator.userAgent,
                      sessionId: sessionStorage.getItem('billbuddy_session_id') || 'anonymous',
                      // BillBuddy specific context
                      app: {
                        name: 'BillBuddy',
                        version: '1.0.0',
                        environment: '${import.meta.env.MODE}'
                      }
                    };

                    // Send to Builder.io
                    fetch('https://builder.io/api/v1/track', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer BUILDER_API_KEY'
                      },
                      body: JSON.stringify(trackingData)
                    }).then(response => {
                      if (!response.ok) {
                        throw new Error('Builder tracking request failed');
                      }
                      console.log('Builder event tracked:', event);
                    }).catch(err => {
                      console.warn('Builder tracking failed (non-critical):', err);
                    });
                  } catch (error) {
                    console.warn('Builder tracking error (non-critical):', error);
                  }
                };

                // Initialize session if not exists
                if (!sessionStorage.getItem('billbuddy_session_id')) {
                  sessionStorage.setItem('billbuddy_session_id',
                    'sess_' + Math.random().toString(36).substr(2, 9) + Date.now()
                  );
                }

                // Track initial page load
                window.builder.track('page_view', {
                  page: window.location.pathname,
                  title: document.title,
                  referrer: document.referrer
                });

                // Load Builder SDK if needed
                if (typeof window !== 'undefined' && !window.customElements.get('builder-component')) {
                  const script = document.createElement('script');
                  script.src = 'https://cdn.builder.io/js/webcomponents';
                  script.async = true;
                  script.onload = function() {
                    console.log('Builder SDK loaded successfully');
                  };
                  script.onerror = function() {
                    console.warn('Builder SDK load failed (non-critical)');
                  };
                  document.head.appendChild(script);
                }
                
                console.log('Builder.io initialized successfully');
              } catch (error) {
                console.warn('Builder.io setup error (non-critical):', error.message);
              }
            })();
          `,
        }}
      />

      {/* Error Tracking (Sentry) */}
      <script
        src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"
        integrity="sha384-example-integrity-hash"
        crossOrigin="anonymous"
        onError={(e) =>
          console.warn("Sentry script load error (non-critical):", e)
        }
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                if (typeof Sentry !== 'undefined') {
                  Sentry.init({
                    dsn: 'SENTRY_DSN_URL',
                    environment: '${import.meta.env.MODE}',
                    release: 'billbuddy@1.0.0',
                    beforeSend: function(event) {
                      // Only send errors if user has consented
                      return window.builder && window.builder.canTrack ? event : null;
                    },
                    integrations: [
                      new Sentry.BrowserTracing({
                        tracePropagationTargets: [window.location.hostname]
                      })
                    ],
                    tracesSampleRate: 0.1,
                    // Privacy-focused configuration
                    beforeSendTransaction: function(transaction) {
                      // Filter out sensitive transaction data
                      if (transaction.transaction && transaction.transaction.includes('payment')) {
                        return null;
                      }
                      return transaction;
                    }
                  });

                  // Set user context (without PII)
                  Sentry.setUser({
                    id: sessionStorage.getItem('billbuddy_session_id'),
                    // Don't include email or other PII
                  });

                  // Set app context
                  Sentry.setTag('app.name', 'BillBuddy');
                  Sentry.setTag('app.version', '1.0.0');
                  
                  console.log('Sentry initialized successfully');
                }
              } catch (error) {
                console.warn('Sentry initialization error (non-critical):', error.message);
              }
            })();
          `,
        }}
      />
    </>
  );
};

export default SafeScriptLoader;
