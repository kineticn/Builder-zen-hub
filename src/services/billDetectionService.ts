import {
  detectBillFromEmail,
  detectRecurringBills,
  normalizeTransaction,
  calculateConfidenceScore,
  categorizeBill,
  extractDueDateFromText,
  extractAmountFromText,
  type EmailBillData,
  type TransactionData,
  type RecurringPattern,
} from "@/utils/billDetection";
import {
  emailService,
  outlookService,
  type EmailAccount,
} from "./emailService";
import { plaidService, type PlaidTransaction } from "./plaidService";

export interface DiscoveredBill {
  id: string;
  name: string;
  amount: number;
  dueDate?: string;
  category: string;
  source: "email" | "bank" | "manual";
  confidence: number;
  isRecurring: boolean;
  lastPaid?: string;
  merchantLogo?: string;
  status: "pending" | "confirmed" | "ignored";
  frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  accountName?: string;
  description?: string;
  sourceData?: {
    emailId?: string;
    transactionIds?: string[];
    emailSubject?: string;
    senderEmail?: string;
  };
}

export interface BillDetectionResult {
  bills: DiscoveredBill[];
  stats: {
    totalBillsFound: number;
    emailBillsFound: number;
    bankBillsFound: number;
    potentialSavings: number;
    subscriptionsFound: number;
    duplicatesFound: number;
  };
  errors?: string[];
}

export interface ScanProgress {
  step: string;
  progress: number;
  message: string;
  isComplete: boolean;
}

export class BillDetectionService {
  private static instance: BillDetectionService;

  public static getInstance(): BillDetectionService {
    if (!BillDetectionService.instance) {
      BillDetectionService.instance = new BillDetectionService();
    }
    return BillDetectionService.instance;
  }

  /**
   * Main detection orchestrator - scans all connected sources
   */
  async detectAllBills(
    emailAccounts: EmailAccount[],
    bankAccessTokens: string[],
    progressCallback?: (progress: ScanProgress) => void,
  ): Promise<BillDetectionResult> {
    const errors: string[] = [];
    let allBills: DiscoveredBill[] = [];

    try {
      // Step 1: Email Detection
      progressCallback?.({
        step: "email",
        progress: 10,
        message: "Scanning email accounts for bills...",
        isComplete: false,
      });

      const emailBills = await this.detectEmailBills(emailAccounts);
      allBills = [...allBills, ...emailBills];

      progressCallback?.({
        step: "email",
        progress: 40,
        message: `Found ${emailBills.length} bills from email`,
        isComplete: false,
      });

      // Step 2: Bank Transaction Analysis
      progressCallback?.({
        step: "bank",
        progress: 50,
        message: "Analyzing bank transactions...",
        isComplete: false,
      });

      const bankBills = await this.detectBankBills(bankAccessTokens);
      allBills = [...allBills, ...bankBills];

      progressCallback?.({
        step: "bank",
        progress: 80,
        message: `Found ${bankBills.length} recurring bills from transactions`,
        isComplete: false,
      });

      // Step 3: Deduplication and Enhancement
      progressCallback?.({
        step: "processing",
        progress: 90,
        message: "Processing and deduplicating results...",
        isComplete: false,
      });

      const deduplicatedBills = this.deduplicateBills(allBills);
      const enhancedBills = await this.enhanceBillData(deduplicatedBills);

      // Calculate statistics
      const stats = this.calculateStats(enhancedBills, allBills);

      progressCallback?.({
        step: "complete",
        progress: 100,
        message: `Discovery complete! Found ${enhancedBills.length} bills`,
        isComplete: true,
      });

      return {
        bills: enhancedBills,
        stats,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      console.error("Error in bill detection:", error);
      errors.push(
        error instanceof Error ? error.message : "Unknown error occurred",
      );

      return {
        bills: allBills,
        stats: this.calculateStats(allBills, allBills),
        errors,
      };
    }
  }

  /**
   * Detect bills from email accounts
   */
  async detectEmailBills(
    emailAccounts: EmailAccount[],
  ): Promise<DiscoveredBill[]> {
    const bills: DiscoveredBill[] = [];

    for (const account of emailAccounts) {
      try {
        let messages: any[] = [];

        if (account.provider === "gmail") {
          const gmailMessages = await emailService.searchBillEmails(account);
          messages = gmailMessages.map((msg) => {
            const parsed = emailService.parseEmailMessage(msg);
            return {
              id: parsed.id,
              from: parsed.from,
              subject: parsed.subject,
              body: parsed.body,
              date: parsed.date,
            };
          });
        } else if (account.provider === "outlook") {
          messages = await outlookService.searchBillEmails(account);
        }

        for (const message of messages) {
          try {
            const billData = detectBillFromEmail(
              message.subject || "",
              message.from || "",
              message.body || "",
            );

            if (billData.confidence >= 60) {
              // Only include bills with reasonable confidence
              const bill: DiscoveredBill = {
                id: `email_${message.id}`,
                name:
                  billData.merchant || this.extractCompanyName(message.from),
                amount: billData.amount || 0,
                dueDate: billData.dueDate?.toISOString(),
                category: billData.category || "other",
                source: "email",
                confidence: billData.confidence,
                isRecurring: true, // Most email bills are recurring
                status: "pending",
                description: billData.description,
                sourceData: {
                  emailId: message.id,
                  emailSubject: message.subject,
                  senderEmail: message.from,
                },
              };

              bills.push(bill);
            }
          } catch (error) {
            console.error("Error processing email message:", error);
            // Continue with next message
          }
        }
      } catch (error) {
        console.error(`Error scanning ${account.provider} account:`, error);
        // Continue with next account
      }
    }

    return bills;
  }

  /**
   * Detect bills from bank transactions
   */
  async detectBankBills(accessTokens: string[]): Promise<DiscoveredBill[]> {
    const bills: DiscoveredBill[] = [];

    for (const accessToken of accessTokens) {
      try {
        // Get accounts first
        const accounts = await plaidService.getAccounts(accessToken);

        // Get transactions for the last 12 months
        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        const transactions = await plaidService.getTransactions(
          accessToken,
          startDate,
          endDate,
        );

        // Convert to our format
        const transactionData: TransactionData[] = transactions.map((tx) => ({
          id: tx.transaction_id,
          date: new Date(tx.date),
          amount: Math.abs(tx.amount), // Plaid uses negative for outgoing
          description: tx.name,
          merchant: tx.merchant_name,
          category: tx.category.join(" > "),
        }));

        // Detect recurring patterns
        const patterns = detectRecurringBills(transactionData);

        for (const pattern of patterns) {
          if (pattern.confidence >= 70) {
            // Only include high-confidence patterns
            const account = accounts.find((acc) =>
              transactions.some(
                (tx) =>
                  tx.account_id === acc.account_id &&
                  pattern.dates.some(
                    (date) => tx.date === date.toISOString().split("T")[0],
                  ),
              ),
            );

            const avgAmount =
              pattern.amounts.reduce((sum, amt) => sum + amt, 0) /
              pattern.amounts.length;

            const bill: DiscoveredBill = {
              id: `bank_${pattern.merchant.replace(/\s+/g, "_").toLowerCase()}`,
              name: pattern.merchant,
              amount: avgAmount,
              category:
                pattern.category || categorizeBill(pattern.merchant, ""),
              source: "bank",
              confidence: pattern.confidence,
              isRecurring: true,
              frequency: pattern.frequency,
              lastPaid: pattern.dates[pattern.dates.length - 1]?.toISOString(),
              dueDate: pattern.nextPredicted?.toISOString(),
              status: "pending",
              accountName: account?.name,
              sourceData: {
                transactionIds: transactions
                  .filter((tx) =>
                    pattern.dates.some(
                      (date) => tx.date === date.toISOString().split("T")[0],
                    ),
                  )
                  .map((tx) => tx.transaction_id),
              },
            };

            bills.push(bill);
          }
        }
      } catch (error) {
        console.error("Error analyzing bank transactions:", error);
        // Continue with next account
      }
    }

    return bills;
  }

  /**
   * Remove duplicate bills found from multiple sources
   */
  private deduplicateBills(bills: DiscoveredBill[]): DiscoveredBill[] {
    const uniqueBills: DiscoveredBill[] = [];
    const seen = new Set<string>();

    for (const bill of bills) {
      // Create a normalized key for deduplication
      const key = this.createDeduplicationKey(bill);

      if (!seen.has(key)) {
        seen.add(key);
        uniqueBills.push(bill);
      } else {
        // If we've seen this bill before, enhance the existing one
        const existingIndex = uniqueBills.findIndex(
          (b) => this.createDeduplicationKey(b) === key,
        );
        if (existingIndex >= 0) {
          const existing = uniqueBills[existingIndex];
          // Merge data from multiple sources
          uniqueBills[existingIndex] = this.mergeBillData(existing, bill);
        }
      }
    }

    return uniqueBills;
  }

  /**
   * Create a key for deduplication
   */
  private createDeduplicationKey(bill: DiscoveredBill): string {
    const normalizedName = bill.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 10);
    const roundedAmount = Math.round(bill.amount);
    return `${normalizedName}_${roundedAmount}`;
  }

  /**
   * Merge bill data from multiple sources
   */
  private mergeBillData(
    existing: DiscoveredBill,
    newBill: DiscoveredBill,
  ): DiscoveredBill {
    return {
      ...existing,
      // Use higher confidence data
      confidence: calculateConfidenceScore(
        existing.source === "email" ? existing.confidence : 0,
        existing.source === "bank" ? existing.confidence : 0,
        true, // Has multiple sources
      ),
      // Prefer email amount if available and confident
      amount:
        newBill.source === "email" && newBill.confidence > 85
          ? newBill.amount
          : existing.amount,
      // Prefer email due date
      dueDate: newBill.dueDate || existing.dueDate,
      // Merge source data
      sourceData: {
        ...existing.sourceData,
        ...newBill.sourceData,
      },
    };
  }

  /**
   * Enhance bill data with additional information
   */
  private async enhanceBillData(
    bills: DiscoveredBill[],
  ): Promise<DiscoveredBill[]> {
    return bills.map((bill) => {
      // Add logo/icon based on merchant name
      const merchantLogo = this.getMerchantLogo(bill.name);

      // Improve category if not set
      let category = bill.category;
      if (!category || category === "other") {
        category = categorizeBill(bill.name, bill.description || "");
      }

      // Estimate next due date if missing
      let dueDate = bill.dueDate;
      if (!dueDate && bill.frequency && bill.lastPaid) {
        const lastPaidDate = new Date(bill.lastPaid);
        const intervals = {
          weekly: 7,
          monthly: 30,
          quarterly: 90,
          yearly: 365,
        };
        const nextDate = new Date(lastPaidDate);
        nextDate.setDate(
          nextDate.getDate() + (intervals[bill.frequency] || 30),
        );
        dueDate = nextDate.toISOString();
      }

      return {
        ...bill,
        merchantLogo,
        category,
        dueDate,
      };
    });
  }

  /**
   * Get merchant logo URL or fallback
   */
  private getMerchantLogo(merchantName: string): string | undefined {
    const logoMap: Record<string, string> = {
      netflix: "/logos/netflix.png",
      spotify: "/logos/spotify.png",
      amazon: "/logos/amazon.png",
      apple: "/logos/apple.png",
      google: "/logos/google.png",
      microsoft: "/logos/microsoft.png",
      adobe: "/logos/adobe.png",
      // Add more as needed
    };

    const normalizedName = merchantName.toLowerCase();
    for (const [key, logo] of Object.entries(logoMap)) {
      if (normalizedName.includes(key)) {
        return logo;
      }
    }
    return undefined;
  }

  /**
   * Extract company name from email address
   */
  private extractCompanyName(email: string): string {
    if (!email) return "Unknown";

    // Extract domain
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return "Unknown";

    // Remove common email prefixes
    const cleanDomain = domain
      .replace(/^(noreply\.|no-reply\.|billing\.|statements?\.)/, "")
      .replace(/\.(com|org|net|edu|gov)$/, "");

    // Capitalize first letter
    return cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
  }

  /**
   * Calculate discovery statistics
   */
  private calculateStats(
    finalBills: DiscoveredBill[],
    allBills: DiscoveredBill[],
  ) {
    const emailBills = finalBills.filter((b) => b.source === "email");
    const bankBills = finalBills.filter((b) => b.source === "bank");
    const subscriptions = finalBills.filter((b) => b.isRecurring);

    // Calculate potential savings from duplicates found
    const duplicatesFound = allBills.length - finalBills.length;
    const potentialSavings = duplicatesFound * 15; // Estimate $15 per duplicate subscription

    return {
      totalBillsFound: finalBills.length,
      emailBillsFound: emailBills.length,
      bankBillsFound: bankBills.length,
      potentialSavings,
      subscriptionsFound: subscriptions.length,
      duplicatesFound,
    };
  }

  /**
   * Scan a specific email account
   */
  async scanEmailAccount(
    account: EmailAccount,
    progressCallback?: (progress: ScanProgress) => void,
  ): Promise<DiscoveredBill[]> {
    progressCallback?.({
      step: "email",
      progress: 0,
      message: `Connecting to ${account.provider}...`,
      isComplete: false,
    });

    const bills = await this.detectEmailBills([account]);

    progressCallback?.({
      step: "email",
      progress: 100,
      message: `Found ${bills.length} bills in ${account.email}`,
      isComplete: true,
    });

    return bills;
  }

  /**
   * Analyze a specific bank account
   */
  async analyzeBankAccount(
    accessToken: string,
    progressCallback?: (progress: ScanProgress) => void,
  ): Promise<DiscoveredBill[]> {
    progressCallback?.({
      step: "bank",
      progress: 0,
      message: "Retrieving transaction history...",
      isComplete: false,
    });

    const bills = await this.detectBankBills([accessToken]);

    progressCallback?.({
      step: "bank",
      progress: 100,
      message: `Found ${bills.length} recurring bills`,
      isComplete: true,
    });

    return bills;
  }
}

export const billDetectionService = BillDetectionService.getInstance();
