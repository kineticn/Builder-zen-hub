// Simplified email service that works without external dependencies
// For production, install 'googleapis' package and uncomment real implementation

export interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{
      mimeType: string;
      body: { data?: string };
      headers: Array<{ name: string; value: string }>;
    }>;
  };
  internalDate: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  provider: "gmail" | "outlook";
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  profile?: {
    name: string;
    picture?: string;
  };
}

export interface ParsedEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: Date;
  body: string;
  attachments?: Array<{
    filename: string;
    mimeType: string;
    data: string;
  }>;
}

export class EmailService {
  private static instance: EmailService;

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Generate OAuth2 authorization URL for Gmail
   */
  generateAuthUrl(): string {
    // For demo purposes, return a placeholder URL
    const clientId = "demo-client-id";
    const redirectUri = encodeURIComponent(
      window.location.origin + "/oauth/callback",
    );
    const scopes = encodeURIComponent(
      "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email",
    );

    return (
      `https://accounts.google.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scopes}&` +
      `response_type=code&` +
      `access_type=offline`
    );
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<EmailAccount> {
    // Simulate OAuth exchange
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const account: EmailAccount = {
      id: "demo-user-id",
      email: "user@gmail.com",
      provider: "gmail",
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
      expiresAt: new Date(Date.now() + 3600000),
      profile: {
        name: "Demo User",
      },
    };

    return account;
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(account: EmailAccount): Promise<EmailAccount> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      ...account,
      accessToken: "new-demo-access-token",
      expiresAt: new Date(Date.now() + 3600000),
    };
  }

  /**
   * Search Gmail for bill-related emails
   */
  async searchBillEmails(
    account: EmailAccount,
    query?: string,
    maxResults: number = 100,
  ): Promise<EmailMessage[]> {
    // Return mock bill emails
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return [
      {
        id: "email-1",
        threadId: "thread-1",
        snippet: "Your Netflix bill is ready",
        payload: {
          headers: [
            { name: "From", value: "Netflix <info@netflix.com>" },
            { name: "Subject", value: "Your Netflix bill is ready" },
          ],
          body: {
            data: btoa(
              "Your Netflix subscription payment of $15.99 will be charged on December 28, 2024.",
            ),
          },
        },
        internalDate: Date.now().toString(),
      },
      {
        id: "email-2",
        threadId: "thread-2",
        snippet: "Pacific Gas & Electric Statement Available",
        payload: {
          headers: [
            { name: "From", value: "PG&E <noreply@pge.com>" },
            {
              name: "Subject",
              value: "Pacific Gas & Electric Statement Available",
            },
          ],
          body: {
            data: btoa(
              "Your December statement is now available. Amount due: $142.33. Pay by December 30 to avoid late fees.",
            ),
          },
        },
        internalDate: Date.now().toString(),
      },
    ];
  }

  /**
   * Parse email message to extract readable content
   */
  parseEmailMessage(message: EmailMessage): ParsedEmail {
    const headers = message.payload.headers;
    const getHeader = (name: string) =>
      headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ||
      "";

    // Extract body content
    let body = "";
    if (message.payload.body?.data) {
      body = this.decodeBase64(message.payload.body.data);
    }

    return {
      id: message.id,
      from: getHeader("From"),
      to: getHeader("To"),
      subject: getHeader("Subject"),
      date: new Date(parseInt(message.internalDate)),
      body: body,
    };
  }

  /**
   * Decode base64 email content
   */
  private decodeBase64(data: string): string {
    try {
      return atob(data);
    } catch (error) {
      console.error("Error decoding base64:", error);
      return "";
    }
  }

  /**
   * Get user's Gmail profile
   */
  async getProfile(account: EmailAccount) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      emailAddress: account.email,
      messagesTotal: 15420,
      threadsTotal: 8234,
      historyId: "123456789",
    };
  }

  /**
   * Test connection to Gmail
   */
  async testConnection(account: EmailAccount): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  }

  /**
   * Revoke access token
   */
  async revokeAccess(account: EmailAccount): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

// Microsoft Graph API service for Outlook integration
export class OutlookService {
  private static instance: OutlookService;

  public static getInstance(): OutlookService {
    if (!OutlookService.instance) {
      OutlookService.instance = new OutlookService();
    }
    return OutlookService.instance;
  }

  /**
   * Generate OAuth2 authorization URL for Outlook
   */
  generateAuthUrl(): string {
    const clientId = "demo-client-id";
    const redirectUri = encodeURIComponent(
      window.location.origin + "/oauth/callback",
    );
    const scopes = encodeURIComponent(
      "https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/User.Read",
    );

    return (
      `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scopes}&` +
      `response_mode=query`
    );
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<EmailAccount> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const account: EmailAccount = {
      id: "demo-outlook-user",
      email: "user@outlook.com",
      provider: "outlook",
      accessToken: "demo-outlook-token",
      refreshToken: "demo-outlook-refresh",
      expiresAt: new Date(Date.now() + 3600000),
      profile: {
        name: "Demo Outlook User",
      },
    };

    return account;
  }

  /**
   * Search Outlook for bill-related emails
   */
  async searchBillEmails(
    account: EmailAccount,
    query?: string,
    maxResults: number = 100,
  ): Promise<any[]> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return [
      {
        id: "outlook-1",
        subject: "Your Spotify Premium bill",
        from: { emailAddress: { address: "no-reply@spotify.com" } },
        body: { content: "Your Spotify Premium payment of $9.99 is due." },
        receivedDateTime: new Date().toISOString(),
      },
    ];
  }

  /**
   * Test connection to Outlook
   */
  async testConnection(account: EmailAccount): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  }
}

export const emailService = EmailService.getInstance();
export const outlookService = OutlookService.getInstance();
