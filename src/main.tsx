import { createRoot } from "react-dom/client";
import { Partytown } from "@builder.io/partytown/react";
import { partytownConfig, consentManager } from "./lib/partytown-config";
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
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <>
    {/* Partytown for offloading 3rd-party scripts */}
    <Partytown {...partytownConfig} />

    {/* Main App Component */}
    <App />

    {/* 3rd-party scripts - only load if user has consented */}
    {hasConsent && (
      <>
        {/* Google Analytics */}
        <script
          type="text/partytown"
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          async
        />
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: 'BillBuddy FinTech App',
                page_location: window.location.href,
                send_page_view: true,
                custom_map: {
                  'user_type': 'billbuddy_user',
                  'app_version': '1.0.0'
                },
                // Enhanced ecommerce tracking
                allow_enhanced_conversions: true,
                // Privacy-focused settings
                anonymize_ip: true,
                allow_ad_personalization_signals: false
              });
              
              // Track key BillBuddy events
              gtag('event', 'app_load', {
                event_category: 'engagement',
                event_label: 'app_startup'
              });
            `,
          }}
        />

        {/* Facebook Pixel */}
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
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
              
              // Custom BillBuddy events
              fbq('trackCustom', 'FinTechAppLoad', {
                app_name: 'BillBuddy',
                category: 'finance'
              });
            `,
          }}
        />

        {/* Builder.io Analytics */}
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Enhanced Builder tracking setup
                window.builder = window.builder || {};
                
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
                        environment: '${process.env.NODE_ENV || "production"}'
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
                      console.warn('Builder tracking failed:', err);
                    });
                  } catch (error) {
                    console.error('Builder tracking error:', error);
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
                    console.log('Builder SDK loaded');
                  };
                  document.head.appendChild(script);
                }
              })();
            `,
          }}
        />

        {/* Error Tracking (Sentry example) */}
        <script
          type="text/partytown"
          src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"
          integrity="sha384-example-integrity-hash"
          crossOrigin="anonymous"
        />
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof Sentry !== 'undefined') {
                Sentry.init({
                  dsn: 'SENTRY_DSN_URL',
                  environment: '${process.env.NODE_ENV || "production"}',
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
              }
            `,
          }}
        />
      </>
    )}

    {/* Show consent banner if no consent given */}
    <ConsentBanner />
  </>,
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
