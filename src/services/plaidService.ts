// Simplified Plaid service that works without external dependencies
// For production, install 'plaid' package and uncomment real implementation

export interface PlaidAccount {
  account_id: string;
  balances: {
    available: number | null;
    current: number | null;
    limit: number | null;
  };
  name: string;
  official_name: string | null;
  type: string;
  subtype: string | null;
  mask: string | null;
}

export interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  category: string[];
  category_id?: string;
  account_owner?: string;
}

export interface PlaidLinkTokenResponse {
  link_token: string;
  expiration: string;
  request_id: string;
}

export interface PlaidAccessTokenResponse {
  access_token: string;
  item_id: string;
  request_id: string;
}

export class PlaidService {
  private static instance: PlaidService;

  public static getInstance(): PlaidService {
    if (!PlaidService.instance) {
      PlaidService.instance = new PlaidService();
    }
    return PlaidService.instance;
  }

  /**
   * Create a link token for Plaid Link initialization
   */
  async createLinkToken(userId: string): Promise<PlaidLinkTokenResponse> {
    // Simulate API call for now
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      link_token: "link-sandbox-demo-token",
      expiration: new Date(Date.now() + 3600000).toISOString(),
      request_id: "request-" + Date.now(),
    };
  }

  /**
   * Exchange public token for access token
   */
  async exchangePublicToken(
    publicToken: string,
  ): Promise<PlaidAccessTokenResponse> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      access_token: "access-sandbox-demo-token",
      item_id: "item-" + Date.now(),
      request_id: "request-" + Date.now(),
    };
  }

  /**
   * Get accounts for a connected item
   */
  async getAccounts(accessToken: string): Promise<PlaidAccount[]> {
    // Return mock accounts for demo
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        account_id: "account-1",
        balances: {
          available: 2500.5,
          current: 2847.65,
          limit: null,
        },
        name: "Checking Account",
        official_name: "Chase Total Checking",
        type: "depository",
        subtype: "checking",
        mask: "1234",
      },
      {
        account_id: "account-2",
        balances: {
          available: 8500.0,
          current: 8750.25,
          limit: 10000.0,
        },
        name: "Credit Card",
        official_name: "Chase Sapphire Preferred",
        type: "credit",
        subtype: "credit card",
        mask: "5678",
      },
    ];
  }

  /**
   * Get transactions for analysis
   */
  async getTransactions(
    accessToken: string,
    startDate: string,
    endDate: string,
    accountIds?: string[],
  ): Promise<PlaidTransaction[]> {
    // Return mock transactions for demo
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        transaction_id: "tx-1",
        account_id: "account-1",
        amount: 15.99,
        date: "2024-12-15",
        name: "NETFLIX.COM",
        merchant_name: "Netflix",
        category: ["Payment", "Subscription"],
        category_id: "subscription",
      },
      {
        transaction_id: "tx-2",
        account_id: "account-1",
        amount: 142.33,
        date: "2024-12-10",
        name: "PACIFIC GAS ELECTRIC",
        merchant_name: "PG&E",
        category: ["Payment", "Utilities"],
        category_id: "utilities",
      },
      {
        transaction_id: "tx-3",
        account_id: "account-2",
        amount: 52.99,
        date: "2024-12-05",
        name: "ADOBE SYSTEMS INC",
        merchant_name: "Adobe",
        category: ["Payment", "Software"],
        category_id: "software",
      },
    ];
  }

  /**
   * Remove an item (disconnect bank account)
   */
  async removeItem(accessToken: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  /**
   * Get item status and institution info
   */
  async getItemStatus(accessToken: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      item: {
        item_id: "item-demo",
        institution_id: "chase",
        webhook: null,
      },
      status: {
        transactions: {
          last_successful_update: new Date().toISOString(),
        },
      },
    };
  }

  /**
   * Update webhook URL
   */
  async updateWebhook(accessToken: string, webhook: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

export const plaidService = PlaidService.getInstance();
