import { createRoot } from "react-dom/client";
import { Partytown } from "@builder.io/partytown/react";
import App from "./App.tsx";
import "./index.css";

// Builder cookie consent gate
declare global {
  interface Window {
    userHasConsented?: boolean;
    builder?: {
      canTrack: boolean;
    };
  }
}

// Initialize Builder with consent check
if (typeof window !== "undefined") {
  // Check for user consent (this could come from a cookie banner, localStorage, etc.)
  const hasConsent =
    window.userHasConsented ||
    localStorage.getItem("billbuddy_analytics_consent") === "true" ||
    document.cookie.includes("analytics_consent=true");

  // Set Builder tracking permission based on consent
  if (window.builder) {
    window.builder.canTrack = hasConsent;
  } else {
    // Initialize builder object if it doesn't exist
    window.builder = {
      canTrack: hasConsent,
    };
  }
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <>
    {/* Partytown configuration for 3rd-party scripts */}
    <Partytown
      debug={process.env.NODE_ENV === "development"}
      forward={[
        // Forward common analytics events to main thread
        "gtag",
        "dataLayer.push",
        "fbq",
        "analytics.track",
        "builder.track",
      ]}
      resolveUrl={(url) => {
        // Allow specific domains for 3rd-party scripts
        const allowedDomains = [
          "googletagmanager.com",
          "google-analytics.com",
          "facebook.net",
          "connect.facebook.net",
          "builder.io",
          "cdn.builder.io",
        ];

        if (allowedDomains.some((domain) => url.hostname.includes(domain))) {
          return url;
        }

        // Proxy other scripts through partytown
        return new URL(`/~partytown/${url.href}`, window.location.origin);
      }}
    />

    {/* Main App Component */}
    <App />

    {/* 3rd-party scripts wrapped in Partytown */}
    {typeof window !== "undefined" && window.builder?.canTrack && (
      <>
        {/* Google Analytics (example) */}
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
                page_title: 'BillBuddy',
                page_location: window.location.href,
                custom_map: {
                  'user_type': 'billbuddy_user'
                }
              });
            `,
          }}
        />

        {/* Facebook Pixel (example) */}
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
            `,
          }}
        />

        {/* Builder.io Analytics (example) */}
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const script = document.createElement('script');
                script.src = 'https://cdn.builder.io/js/webcomponents';
                script.async = true;
                document.head.appendChild(script);
                
                // Initialize Builder tracking
                window.builder = window.builder || {};
                window.builder.track = function(event, data) {
                  if (window.builder.canTrack) {
                    // Send tracking data to Builder
                    fetch('https://builder.io/api/v1/track', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        event: event,
                        data: data,
                        url: window.location.href,
                        timestamp: Date.now()
                      })
                    }).catch(err => {
                      console.warn('Builder tracking failed:', err);
                    });
                  }
                };
              })();
            `,
          }}
        />
      </>
    )}

    {/* Cookie Consent Banner (if consent not given) */}
    {typeof window !== "undefined" && !window.builder?.canTrack && (
      <div
        id="cookie-consent-banner"
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
        }}
      >
        <div style={{ flex: 1, minWidth: "300px" }}>
          <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.4" }}>
            We use cookies and similar technologies to improve your experience,
            analyze usage, and provide personalized content.
            <a
              href="/privacy-policy"
              style={{ color: "#00C2B2", textDecoration: "underline" }}
            >
              Privacy Policy
            </a>
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <button
            onClick={() => {
              // User accepts analytics
              window.userHasConsented = true;
              localStorage.setItem("billbuddy_analytics_consent", "true");
              document.cookie =
                "analytics_consent=true; max-age=31536000; path=/; secure; samesite=strict";

              if (window.builder) {
                window.builder.canTrack = true;
              }

              // Remove banner and reload to init scripts
              const banner = document.getElementById("cookie-consent-banner");
              if (banner) banner.remove();
              window.location.reload();
            }}
            style={{
              backgroundColor: "#00C2B2",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Accept All
          </button>
          <button
            onClick={() => {
              // User rejects analytics
              window.userHasConsented = false;
              localStorage.setItem("billbuddy_analytics_consent", "false");
              document.cookie =
                "analytics_consent=false; max-age=31536000; path=/; secure; samesite=strict";

              if (window.builder) {
                window.builder.canTrack = false;
              }

              // Remove banner
              const banner = document.getElementById("cookie-consent-banner");
              if (banner) banner.remove();
            }}
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid #white",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Reject
          </button>
        </div>
      </div>
    )}
  </>,
);
