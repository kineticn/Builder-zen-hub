import { PlaidApi, Configuration, PlaidEnvironments } from "plaid";

// Plaid configuration
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Use sandbox for development
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID":
        import.meta.env.VITE_PLAID_CLIENT_ID || "your_client_id",
      "PLAID-SECRET": import.meta.env.VITE_PLAID_SECRET || "your_secret_key",
    },
  },
});

const plaidClient = new PlaidApi(configuration);

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
    try {
      const response = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: userId,
        },
        client_name: "BillBuddy",
        products: ["transactions"],
        country_codes: ["US"],
        language: "en",
        webhook: process.env.VITE_PLAID_WEBHOOK_URL,
        account_filters: {
          depository: {
            account_subtypes: ["checking", "savings"],
          },
          credit: {
            account_subtypes: ["credit card"],
          },
        },
      });

      return {
        link_token: response.data.link_token,
        expiration: response.data.expiration,
        request_id: response.data.request_id,
      };
    } catch (error) {
      console.error("Error creating link token:", error);
      throw new Error("Failed to create Plaid link token");
    }
  }

  /**
   * Exchange public token for access token
   */
  async exchangePublicToken(
    publicToken: string,
  ): Promise<PlaidAccessTokenResponse> {
    try {
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      return {
        access_token: response.data.access_token,
        item_id: response.data.item_id,
        request_id: response.data.request_id,
      };
    } catch (error) {
      console.error("Error exchanging public token:", error);
      throw new Error("Failed to exchange public token");
    }
  }

  /**
   * Get accounts for a connected item
   */
  async getAccounts(accessToken: string): Promise<PlaidAccount[]> {
    try {
      const response = await plaidClient.accountsGet({
        access_token: accessToken,
      });

      return response.data.accounts.map((account) => ({
        account_id: account.account_id,
        balances: {
          available: account.balances.available,
          current: account.balances.current,
          limit: account.balances.limit,
        },
        name: account.name,
        official_name: account.official_name,
        type: account.type,
        subtype: account.subtype,
        mask: account.mask,
      }));
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw new Error("Failed to fetch accounts");
    }
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
    try {
      let allTransactions: PlaidTransaction[] = [];
      let hasMore = true;
      let offset = 0;
      const batchSize = 500;

      while (hasMore) {
        const response = await plaidClient.transactionsGet({
          access_token: accessToken,
          start_date: startDate,
          end_date: endDate,
          account_ids: accountIds,
          count: batchSize,
          offset: offset,
        });

        const transactions = response.data.transactions.map((transaction) => ({
          transaction_id: transaction.transaction_id,
          account_id: transaction.account_id,
          amount: transaction.amount,
          date: transaction.date,
          name: transaction.name,
          merchant_name: transaction.merchant_name || undefined,
          category: transaction.category || [],
          category_id: transaction.category_id || undefined,
          account_owner: transaction.account_owner || undefined,
        }));

        allTransactions = [...allTransactions, ...transactions];

        // Check if we have more transactions
        hasMore = response.data.transactions.length === batchSize;
        offset += batchSize;
      }

      return allTransactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw new Error("Failed to fetch transactions");
    }
  }

  /**
   * Remove an item (disconnect bank account)
   */
  async removeItem(accessToken: string): Promise<void> {
    try {
      await plaidClient.itemRemove({
        access_token: accessToken,
      });
    } catch (error) {
      console.error("Error removing item:", error);
      throw new Error("Failed to remove bank connection");
    }
  }

  /**
   * Get item status and institution info
   */
  async getItemStatus(accessToken: string) {
    try {
      const response = await plaidClient.itemGet({
        access_token: accessToken,
      });

      return {
        item: response.data.item,
        status: response.data.status,
      };
    } catch (error) {
      console.error("Error getting item status:", error);
      throw new Error("Failed to get item status");
    }
  }

  /**
   * Update webhook URL
   */
  async updateWebhook(accessToken: string, webhook: string): Promise<void> {
    try {
      await plaidClient.itemWebhookUpdate({
        access_token: accessToken,
        webhook: webhook,
      });
    } catch (error) {
      console.error("Error updating webhook:", error);
      throw new Error("Failed to update webhook");
    }
  }
}

export const plaidService = PlaidService.getInstance();
