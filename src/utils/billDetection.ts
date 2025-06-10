/**
 * Bill Detection Utilities
 * Advanced algorithms for detecting bills from emails and bank transactions
 */

// Common bill-related keywords and patterns
export const BILL_KEYWORDS = {
  // Payment-related terms
  payment: ["payment", "bill", "invoice", "statement", "due", "charge", "fee"],

  // Amount indicators
  amount: ["$", "USD", "amount", "total", "balance", "due", "owe", "pay"],

  // Date indicators
  date: ["due date", "payment date", "expires", "until", "by", "before"],

  // Merchant indicators
  merchant: ["subscription", "service", "monthly", "annual", "recurring"],

  // Urgency indicators
  urgency: [
    "overdue",
    "late",
    "final notice",
    "urgent",
    "immediate",
    "disconnect",
  ],
};

// Known bill categories and their indicators
export const BILL_CATEGORIES = {
  utilities: {
    keywords: [
      "electric",
      "gas",
      "water",
      "sewer",
      "utility",
      "power",
      "energy",
    ],
    patterns: [
      /pg&?e/i,
      /pacific gas/i,
      /edison/i,
      /duke energy/i,
      /xcel energy/i,
    ],
    merchants: ["PG&E", "Edison", "Duke Energy", "Xcel Energy", "ConEd"],
  },

  entertainment: {
    keywords: [
      "netflix",
      "spotify",
      "hulu",
      "disney",
      "streaming",
      "music",
      "video",
    ],
    patterns: [/netflix/i, /spotify/i, /apple music/i, /amazon prime/i],
    merchants: [
      "Netflix",
      "Spotify",
      "Apple Music",
      "Amazon Prime",
      "Hulu",
      "Disney+",
    ],
  },

  software: {
    keywords: [
      "adobe",
      "microsoft",
      "google",
      "software",
      "subscription",
      "license",
    ],
    patterns: [/adobe/i, /microsoft/i, /office 365/i, /google workspace/i],
    merchants: ["Adobe", "Microsoft", "Google", "Zoom", "Slack", "GitHub"],
  },

  insurance: {
    keywords: [
      "insurance",
      "premium",
      "policy",
      "coverage",
      "allstate",
      "geico",
    ],
    patterns: [/state farm/i, /geico/i, /progressive/i, /allstate/i],
    merchants: ["State Farm", "GEICO", "Progressive", "Allstate", "USAA"],
  },

  telecom: {
    keywords: [
      "verizon",
      "att",
      "tmobile",
      "sprint",
      "phone",
      "cellular",
      "wireless",
    ],
    patterns: [/verizon/i, /at&?t/i, /t-mobile/i, /sprint/i],
    merchants: ["Verizon", "AT&T", "T-Mobile", "Sprint", "Comcast", "Xfinity"],
  },

  finance: {
    keywords: [
      "credit card",
      "loan",
      "mortgage",
      "payment",
      "bank",
      "financial",
    ],
    patterns: [/chase/i, /bank of america/i, /wells fargo/i, /citi/i],
    merchants: [
      "Chase",
      "Bank of America",
      "Wells Fargo",
      "Citibank",
      "Capital One",
    ],
  },
};

// Email-specific patterns for bill detection
export const EMAIL_PATTERNS = {
  subject: [
    /bill.*ready/i,
    /statement.*available/i,
    /payment.*due/i,
    /invoice.*\d+/i,
    /your.*bill/i,
    /monthly.*statement/i,
    /payment.*reminder/i,
    /account.*summary/i,
  ],

  sender: [
    /noreply@/i,
    /billing@/i,
    /statements@/i,
    /notices@/i,
    /no-reply@/i,
    /donotreply@/i,
  ],

  amount: [
    /\$\d+\.\d{2}/g,
    /\$\d{1,3}(?:,\d{3})*\.\d{2}/g,
    /amount due[:\s]*\$\d+/i,
    /total[:\s]*\$\d+/i,
    /balance[:\s]*\$\d+/i,
  ],

  dueDate: [
    /due\s+(?:date\s+)?(?:is\s+)?(\w+\s+\d{1,2},?\s+\d{4})/i,
    /pay\s+by\s+(\w+\s+\d{1,2},?\s+\d{4})/i,
    /payment\s+due\s+(\w+\s+\d{1,2},?\s+\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/g,
    /(\d{4}-\d{2}-\d{2})/g,
  ],
};

// Transaction-specific patterns for bill detection
export const TRANSACTION_PATTERNS = {
  recurring: {
    // Same merchant, similar amount, regular intervals
    minOccurrences: 3,
    maxAmountVariation: 0.1, // 10% variation allowed
    intervals: {
      weekly: { days: 7, tolerance: 2 },
      monthly: { days: 30, tolerance: 5 },
      quarterly: { days: 90, tolerance: 10 },
      yearly: { days: 365, tolerance: 30 },
    },
  },

  merchantNormalization: [
    // Remove common transaction prefixes/suffixes
    /^(paypal\s*\*|sq\s*\*|sp\s*\*|amzn\s*mktp|tst\s*\*)/i,
    // Remove location/ID suffixes
    /\s+\d{4,}\s*$/,
    /\s+[A-Z]{2}\s*$/,
    // Remove common descriptors
    /\s*(inc|llc|corp|ltd|co)\.?$/i,
    /\s*(autopay|monthly|subscription|recurring)$/i,
  ],

  categories: {
    utilities: /electric|gas|water|power|energy|utility|pg&?e|edison/i,
    entertainment: /netflix|spotify|hulu|disney|apple music|amazon prime/i,
    software: /adobe|microsoft|google|zoom|slack|github|office/i,
    insurance: /insurance|allstate|geico|progressive|state farm/i,
    telecom: /verizon|at&?t|t-mobile|sprint|comcast|xfinity/i,
  },
};

/**
 * Email Bill Detection
 */
export interface EmailBillData {
  confidence: number;
  amount?: number;
  dueDate?: Date;
  merchant?: string;
  category?: string;
  description?: string;
}

export function detectBillFromEmail(
  subject: string,
  sender: string,
  body: string,
): EmailBillData {
  let confidence = 0;
  let amount: number | undefined;
  let dueDate: Date | undefined;
  let merchant: string | undefined;
  let category: string | undefined;

  // Check subject line for bill indicators
  const subjectScore = EMAIL_PATTERNS.subject.reduce((score, pattern) => {
    return score + (pattern.test(subject) ? 20 : 0);
  }, 0);
  confidence += Math.min(subjectScore, 40);

  // Check sender for bill-related domains
  const senderScore = EMAIL_PATTERNS.sender.reduce((score, pattern) => {
    return score + (pattern.test(sender) ? 15 : 0);
  }, 0);
  confidence += Math.min(senderScore, 30);

  // Extract amount from email content
  const amountMatches = body.match(/\$\d+(?:\.\d{2})?/g);
  if (amountMatches) {
    confidence += 20;
    // Take the largest amount found (usually the bill total)
    const amounts = amountMatches.map((match) =>
      parseFloat(match.replace("$", "")),
    );
    amount = Math.max(...amounts);
  }

  // Extract due date
  EMAIL_PATTERNS.dueDate.forEach((pattern) => {
    const match = body.match(pattern);
    if (match && !dueDate) {
      const dateStr = match[1] || match[0];
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        dueDate = parsedDate;
        confidence += 15;
      }
    }
  });

  // Determine merchant and category
  const senderDomain = sender.split("@")[1]?.toLowerCase() || "";
  const combinedText = (subject + " " + sender + " " + body).toLowerCase();

  // Check against known categories
  for (const [categoryName, categoryData] of Object.entries(BILL_CATEGORIES)) {
    const keywordMatch = categoryData.keywords.some((keyword) =>
      combinedText.includes(keyword.toLowerCase()),
    );
    const patternMatch = categoryData.patterns.some((pattern) =>
      pattern.test(combinedText),
    );
    const merchantMatch = categoryData.merchants.some((merchantName) =>
      combinedText.includes(merchantName.toLowerCase()),
    );

    if (keywordMatch || patternMatch || merchantMatch) {
      category = categoryName;
      confidence += 15;

      if (merchantMatch) {
        merchant = categoryData.merchants.find((m) =>
          combinedText.includes(m.toLowerCase()),
        );
        confidence += 10;
      }
      break;
    }
  }

  // If no specific merchant found, try to extract from sender
  if (!merchant) {
    const senderName = sender.split("@")[0].replace(/[^a-zA-Z\s]/g, "");
    if (senderName.length > 2) {
      merchant = senderName.charAt(0).toUpperCase() + senderName.slice(1);
    }
  }

  return {
    confidence: Math.min(confidence, 100),
    amount,
    dueDate,
    merchant,
    category,
    description: subject,
  };
}

/**
 * Transaction Bill Detection
 */
export interface TransactionData {
  id: string;
  date: Date;
  amount: number;
  description: string;
  merchant?: string;
  category?: string;
}

export interface RecurringPattern {
  merchant: string;
  amounts: number[];
  dates: Date[];
  frequency: "weekly" | "monthly" | "quarterly" | "yearly";
  confidence: number;
  nextPredicted?: Date;
  category?: string;
}

export function normalizeTransaction(description: string): string {
  let normalized = description.toUpperCase().trim();

  // Apply normalization patterns
  TRANSACTION_PATTERNS.merchantNormalization.forEach((pattern) => {
    normalized = normalized.replace(pattern, "");
  });

  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

export function detectRecurringBills(
  transactions: TransactionData[],
): RecurringPattern[] {
  const merchantGroups = new Map<string, TransactionData[]>();

  // Group transactions by normalized merchant name
  transactions.forEach((transaction) => {
    const normalized = normalizeTransaction(transaction.description);
    if (!merchantGroups.has(normalized)) {
      merchantGroups.set(normalized, []);
    }
    merchantGroups.get(normalized)!.push(transaction);
  });

  const patterns: RecurringPattern[] = [];

  merchantGroups.forEach((merchantTransactions, merchantName) => {
    if (
      merchantTransactions.length <
      TRANSACTION_PATTERNS.recurring.minOccurrences
    ) {
      return; // Not enough transactions to establish pattern
    }

    // Sort by date
    merchantTransactions.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate intervals between transactions
    const intervals: number[] = [];
    for (let i = 1; i < merchantTransactions.length; i++) {
      const daysDiff = Math.round(
        (merchantTransactions[i].date.getTime() -
          merchantTransactions[i - 1].date.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      intervals.push(daysDiff);
    }

    // Check for recurring patterns
    const frequency = detectFrequency(intervals);
    if (!frequency) return;

    // Check amount consistency
    const amounts = merchantTransactions.map((t) => t.amount);
    const avgAmount =
      amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const amountVariation = Math.max(...amounts) - Math.min(...amounts);
    const variationPercent = amountVariation / avgAmount;

    if (variationPercent > TRANSACTION_PATTERNS.recurring.maxAmountVariation) {
      return; // Amounts too inconsistent
    }

    // Calculate confidence score
    let confidence = 60; // Base confidence for recurring pattern

    // Bonus for consistent amounts
    if (variationPercent < 0.05)
      confidence += 20; // Less than 5% variation
    else if (variationPercent < 0.1) confidence += 10; // Less than 10% variation

    // Bonus for regular intervals
    const intervalVariation = Math.max(...intervals) - Math.min(...intervals);
    const expectedInterval =
      TRANSACTION_PATTERNS.recurring.intervals[frequency].days;
    if (
      intervalVariation <=
      TRANSACTION_PATTERNS.recurring.intervals[frequency].tolerance
    ) {
      confidence += 15;
    }

    // Bonus for more occurrences
    confidence += Math.min(merchantTransactions.length * 2, 20);

    // Determine category
    let category: string | undefined;
    for (const [categoryName, pattern] of Object.entries(
      TRANSACTION_PATTERNS.categories,
    )) {
      if (pattern.test(merchantName)) {
        category = categoryName;
        confidence += 10;
        break;
      }
    }

    // Predict next payment
    const lastTransaction =
      merchantTransactions[merchantTransactions.length - 1];
    const nextPredicted = new Date(lastTransaction.date);
    nextPredicted.setDate(nextPredicted.getDate() + expectedInterval);

    patterns.push({
      merchant: formatMerchantName(merchantName),
      amounts,
      dates: merchantTransactions.map((t) => t.date),
      frequency,
      confidence: Math.min(confidence, 100),
      nextPredicted,
      category,
    });
  });

  // Sort by confidence (highest first)
  return patterns.sort((a, b) => b.confidence - a.confidence);
}

function detectFrequency(
  intervals: number[],
): "weekly" | "monthly" | "quarterly" | "yearly" | null {
  if (intervals.length === 0) return null;

  const avgInterval =
    intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

  // Check against known frequencies with tolerance
  for (const [frequency, config] of Object.entries(
    TRANSACTION_PATTERNS.recurring.intervals,
  )) {
    if (Math.abs(avgInterval - config.days) <= config.tolerance) {
      return frequency as "weekly" | "monthly" | "quarterly" | "yearly";
    }
  }

  return null;
}

function formatMerchantName(normalized: string): string {
  // Convert back to title case and clean up
  return normalized
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/\b(And|The|Of|For|Inc|Llc|Corp|Ltd|Co)\b/g, (match) =>
      match.toLowerCase(),
    );
}

/**
 * Utility functions for bill management
 */
export function calculateConfidenceScore(
  emailConfidence: number,
  transactionConfidence: number,
  hasMultipleSources: boolean,
): number {
  const avgConfidence = (emailConfidence + transactionConfidence) / 2;

  // Bonus for multiple source confirmation
  if (
    hasMultipleSources &&
    emailConfidence > 70 &&
    transactionConfidence > 70
  ) {
    return Math.min(avgConfidence + 15, 100);
  }

  return Math.max(emailConfidence, transactionConfidence);
}

export function categorizeBill(merchant: string, description: string): string {
  const text = (merchant + " " + description).toLowerCase();

  for (const [category, categoryData] of Object.entries(BILL_CATEGORIES)) {
    const keywordMatch = categoryData.keywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );
    const patternMatch = categoryData.patterns.some((pattern) =>
      pattern.test(text),
    );

    if (keywordMatch || patternMatch) {
      return category;
    }
  }

  return "other";
}

export function extractDueDateFromText(text: string): Date | null {
  for (const pattern of EMAIL_PATTERNS.dueDate) {
    const match = text.match(pattern);
    if (match) {
      const dateStr = match[1] || match[0];
      const date = new Date(dateStr);
      if (!isNaN(date.getTime()) && date > new Date()) {
        return date;
      }
    }
  }
  return null;
}

export function extractAmountFromText(text: string): number | null {
  const matches = text.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g);
  if (!matches) return null;

  // Return the largest amount found
  const amounts = matches.map((match) =>
    parseFloat(match.replace(/[$,]/g, "")),
  );

  return Math.max(...amounts);
}
