import { google } from "googleapis";

// Gmail OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  import.meta.env.VITE_GOOGLE_CLIENT_ID,
  import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
    "http://localhost:5173/oauth/callback",
);

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
    const scopes = [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<EmailAccount> {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Get user profile
      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const profileResponse = await oauth2.userinfo.get();

      const account: EmailAccount = {
        id: profileResponse.data.id || "",
        email: profileResponse.data.email || "",
        provider: "gmail",
        accessToken: tokens.access_token || "",
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : undefined,
        profile: {
          name: profileResponse.data.name || "",
          picture: profileResponse.data.picture,
        },
      };

      return account;
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      throw new Error("Failed to authenticate with Gmail");
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(account: EmailAccount): Promise<EmailAccount> {
    try {
      oauth2Client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();

      return {
        ...account,
        accessToken: credentials.access_token || account.accessToken,
        expiresAt: credentials.expiry_date
          ? new Date(credentials.expiry_date)
          : account.expiresAt,
      };
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw new Error("Failed to refresh access token");
    }
  }

  /**
   * Search Gmail for bill-related emails
   */
  async searchBillEmails(
    account: EmailAccount,
    query?: string,
    maxResults: number = 100,
  ): Promise<EmailMessage[]> {
    try {
      // Set credentials
      oauth2Client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      });

      const gmail = google.gmail({ version: "v1", auth: oauth2Client });

      // Default query for bill-related emails
      const defaultQuery = [
        "bill OR invoice OR statement OR payment OR due OR receipt",
        "from:(-noreply OR -no-reply OR billing OR statements OR invoices)",
        "newer_than:6m", // Last 6 months
      ].join(" ");

      const searchQuery = query || defaultQuery;

      const response = await gmail.users.messages.list({
        userId: "me",
        q: searchQuery,
        maxResults: maxResults,
      });

      if (!response.data.messages) {
        return [];
      }

      // Get full message details
      const messages = await Promise.all(
        response.data.messages.map(async (message) => {
          const fullMessage = await gmail.users.messages.get({
            userId: "me",
            id: message.id!,
            format: "full",
          });
          return fullMessage.data as EmailMessage;
        }),
      );

      return messages;
    } catch (error) {
      console.error("Error searching Gmail:", error);
      throw new Error("Failed to search Gmail for bills");
    }
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
    } else if (message.payload.parts) {
      // Multi-part message
      for (const part of message.payload.parts) {
        if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
          if (part.body.data) {
            body += this.decodeBase64(part.body.data);
          }
        }
      }
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
      // Gmail API returns base64url encoded data
      const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
      return atob(base64);
    } catch (error) {
      console.error("Error decoding base64:", error);
      return "";
    }
  }

  /**
   * Get user's Gmail profile
   */
  async getProfile(account: EmailAccount) {
    try {
      oauth2Client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      });

      const gmail = google.gmail({ version: "v1", auth: oauth2Client });
      const response = await gmail.users.getProfile({ userId: "me" });

      return {
        emailAddress: response.data.emailAddress,
        messagesTotal: response.data.messagesTotal,
        threadsTotal: response.data.threadsTotal,
        historyId: response.data.historyId,
      };
    } catch (error) {
      console.error("Error getting Gmail profile:", error);
      throw new Error("Failed to get Gmail profile");
    }
  }

  /**
   * Test connection to Gmail
   */
  async testConnection(account: EmailAccount): Promise<boolean> {
    try {
      await this.getProfile(account);
      return true;
    } catch (error) {
      console.error("Gmail connection test failed:", error);
      return false;
    }
  }

  /**
   * Revoke access token
   */
  async revokeAccess(account: EmailAccount): Promise<void> {
    try {
      oauth2Client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      });

      await oauth2Client.revokeCredentials();
    } catch (error) {
      console.error("Error revoking access:", error);
      throw new Error("Failed to revoke Gmail access");
    }
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
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
    const redirectUri =
      import.meta.env.VITE_MICROSOFT_REDIRECT_URI ||
      "http://localhost:5173/oauth/callback";
    const scopes = encodeURIComponent(
      "https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/User.Read",
    );

    return (
      `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${scopes}&` +
      `response_mode=query`
    );
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<EmailAccount> {
    try {
      const response = await fetch(
        "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
            client_secret: import.meta.env.VITE_MICROSOFT_CLIENT_SECRET,
            code: code,
            grant_type: "authorization_code",
            redirect_uri:
              import.meta.env.VITE_MICROSOFT_REDIRECT_URI ||
              "http://localhost:5173/oauth/callback",
          }),
        },
      );

      const tokens = await response.json();

      if (!response.ok) {
        throw new Error(tokens.error_description || "Failed to exchange code");
      }

      // Get user profile
      const profileResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        },
      );

      const profile = await profileResponse.json();

      const account: EmailAccount = {
        id: profile.id,
        email: profile.userPrincipalName || profile.mail,
        provider: "outlook",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        profile: {
          name: profile.displayName,
        },
      };

      return account;
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      throw new Error("Failed to authenticate with Outlook");
    }
  }

  /**
   * Search Outlook for bill-related emails
   */
  async searchBillEmails(
    account: EmailAccount,
    query?: string,
    maxResults: number = 100,
  ): Promise<any[]> {
    try {
      const searchQuery =
        query || "bill OR invoice OR statement OR payment OR due";
      const url = `https://graph.microsoft.com/v1.0/me/messages?$search="${encodeURIComponent(searchQuery)}"&$top=${maxResults}&$orderby=receivedDateTime desc`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.value || [];
    } catch (error) {
      console.error("Error searching Outlook:", error);
      throw new Error("Failed to search Outlook for bills");
    }
  }

  /**
   * Test connection to Outlook
   */
  async testConnection(account: EmailAccount): Promise<boolean> {
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Outlook connection test failed:", error);
      return false;
    }
  }
}

export const emailService = EmailService.getInstance();
export const outlookService = OutlookService.getInstance();
