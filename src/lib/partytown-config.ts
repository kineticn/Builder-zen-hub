import type { PartytownConfig } from "@builder.io/partytown/integration";

// Simplified Partytown configuration to avoid cross-origin issues
export const partytownConfig: PartytownConfig = {
  // Enable debug mode in development only
  debug: import.meta.env.MODE === "development",

  // Minimal forwarding to reduce cross-origin issues
  forward: [
    // Google Analytics
    "gtag",
    "dataLayer.push",

    // Facebook Pixel
    "fbq",

    // Builder.io
    "builder.track",
    "builder.canTrack",

    // User consent
    "userHasConsented",
  ],

  // Simplified URL resolution - avoid proxying
  resolveUrl: (url, location, type) => {
    // Always return the original URL to avoid proxy complications
    return url;
  },

  // Minimal configuration
  lib: "/~partytown/",

  // Enhanced error handling with graceful fallback
  onError: (error) => {
    // Suppress cross-origin errors completely
    if (
      error.message.includes("cross-origin") ||
      error.message.includes("dispatchEvent") ||
      error.message.includes("SecurityError") ||
      error.message.includes("frame")
    ) {
      console.warn("Cross-origin error suppressed:", error.message);
      return; // Don't propagate these errors
    }

    // Only log real errors in development
    if (import.meta.env.MODE === "development") {
      console.warn("Partytown error:", error.message);
    }
  },
};

// Analytics consent management
export class ConsentManager {
  private static instance: ConsentManager;
  private hasConsent: boolean = false;
  private listeners: Array<(hasConsent: boolean) => void> = [];

  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  constructor() {
    this.loadConsentFromStorage();
    this.setupGlobalConsentCheck();
  }

  private loadConsentFromStorage(): void {
    if (typeof window === "undefined") return;

    // Check multiple sources for consent
    this.hasConsent = Boolean(
      window.userHasConsented ||
        localStorage.getItem("billbuddy_analytics_consent") === "true" ||
        document.cookie.includes("analytics_consent=true"),
    );

    this.updateBuilderTracking();
  }

  private setupGlobalConsentCheck(): void {
    if (typeof window === "undefined") return;

    // Set up global consent checker
    Object.defineProperty(window, "userHasConsented", {
      get: () => this.hasConsent,
      set: (value: boolean) => {
        this.setConsent(value);
      },
      configurable: true,
    });
  }

  private updateBuilderTracking(): void {
    if (typeof window === "undefined") return;

    // Initialize or update Builder tracking permission
    if (!window.builder) {
      window.builder = {};
    }

    window.builder.canTrack = this.hasConsent;

    // Notify listeners
    this.listeners.forEach((listener) => listener(this.hasConsent));
  }

  public setConsent(hasConsent: boolean): void {
    this.hasConsent = hasConsent;

    // Persist consent choice
    localStorage.setItem("billbuddy_analytics_consent", hasConsent.toString());
    document.cookie = `analytics_consent=${hasConsent}; max-age=31536000; path=/; secure; samesite=strict`;

    this.updateBuilderTracking();
  }

  public getConsent(): boolean {
    return this.hasConsent;
  }

  public onConsentChange(listener: (hasConsent: boolean) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public showConsentBanner(): void {
    if (typeof window === "undefined" || this.hasConsent) return;

    // Create and show consent banner if not already shown
    const existingBanner = document.getElementById("cookie-consent-banner");
    if (existingBanner) return;

    const banner = this.createConsentBanner();
    document.body.appendChild(banner);
  }

  private createConsentBanner(): HTMLElement {
    const banner = document.createElement("div");
    banner.id = "cookie-consent-banner";
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #0A2540;
      color: white;
      padding: 16px;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
    `;

    banner.innerHTML = `
      <div style="flex: 1; min-width: 300px;">
        <p style="margin: 0; font-size: 14px; line-height: 1.4;">
          We use cookies and similar technologies to improve your experience,
          analyze usage, and provide personalized content.
          <a href="/privacy-policy" style="color: #00C2B2; text-decoration: underline;">
            Privacy Policy
          </a>
        </p>
      </div>
      <div style="display: flex; gap: 8px; flex-shrink: 0;">
        <button id="accept-all-btn" style="
          background-color: #00C2B2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        ">Accept All</button>
        <button id="reject-all-btn" style="
          background-color: transparent;
          color: white;
          border: 1px solid white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        ">Reject</button>
      </div>
    `;

    // Add event listeners
    const acceptBtn = banner.querySelector("#accept-all-btn");
    const rejectBtn = banner.querySelector("#reject-all-btn");

    acceptBtn?.addEventListener("click", () => {
      this.setConsent(true);
      banner.remove();
      // Reload page to initialize tracking scripts
      window.location.reload();
    });

    rejectBtn?.addEventListener("click", () => {
      this.setConsent(false);
      banner.remove();
    });

    return banner;
  }
}

// Initialize consent manager
export const consentManager = ConsentManager.getInstance();

// Global type declarations
declare global {
  interface Window {
    userHasConsented?: boolean;
    builder?: {
      canTrack: boolean;
      track?: (event: string, data: any) => void;
    };
  }
}
