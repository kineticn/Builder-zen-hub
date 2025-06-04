interface Bill {
  id: string;
  billerName: string;
  amount: number;
  dueDate: string;
  status: "upcoming" | "due-soon" | "overdue" | "paid";
  category?: string;
  isRecurring?: boolean;
  predictedAmount?: number;
  paymentHistory?: PaymentRecord[];
}

interface PaymentRecord {
  date: string;
  amount: number;
  status: "paid" | "failed";
}

interface SpendingPattern {
  category: string;
  monthlyAverage: number;
  trend: "increasing" | "decreasing" | "stable";
  variance: number;
  efficiency: number; // 0-100 score
}

interface SmartInsight {
  id: string;
  type:
    | "saving_opportunity"
    | "warning"
    | "optimization"
    | "achievement"
    | "prediction";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: {
    financial?: number; // potential savings/cost
    time?: number; // time saved/lost in minutes
    convenience?: number; // convenience score 1-10
  };
  action?: {
    label: string;
    type: "navigate" | "toggle" | "external";
    data?: any;
  };
  confidence: number; // 0-100 confidence in the insight
  category: string;
  expiresAt?: Date;
}

interface UserProfile {
  monthlyIncome?: number;
  billFrequency: "weekly" | "monthly" | "varies";
  riskTolerance: "conservative" | "moderate" | "aggressive";
  goals: Array<{
    type:
      | "save_money"
      | "automate_bills"
      | "reduce_late_fees"
      | "budget_better";
    target?: number;
    timeframe?: string;
  }>;
  preferences: {
    notifications: boolean;
    autopay: boolean;
    budgetAlerts: boolean;
  };
}

export class SmartInsightsEngine {
  private bills: Bill[];
  private userProfile: UserProfile;
  private paymentHistory: PaymentRecord[];

  constructor(
    bills: Bill[],
    userProfile: UserProfile,
    paymentHistory: PaymentRecord[] = [],
  ) {
    this.bills = bills;
    this.userProfile = userProfile;
    this.paymentHistory = paymentHistory;
  }

  generateInsights(): SmartInsight[] {
    const insights: SmartInsight[] = [];

    // High priority insights
    insights.push(...this.analyzeOverdueBills());
    insights.push(...this.analyzeUpcomingBills());
    insights.push(...this.analyzeBudgetOptimization());

    // Medium priority insights
    insights.push(...this.analyzeAutopayOpportunities());
    insights.push(...this.analyzeSpendingPatterns());
    insights.push(...this.analyzeDueDateOptimization());

    // Low priority insights
    insights.push(...this.analyzeAchievements());
    insights.push(...this.analyzePredictions());

    // Sort by priority and confidence
    return insights
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.confidence - a.confidence;
      })
      .slice(0, 5); // Limit to top 5 insights
  }

  private analyzeOverdueBills(): SmartInsight[] {
    const overdueBills = this.bills.filter((bill) => bill.status === "overdue");
    if (overdueBills.length === 0) return [];

    const totalOverdue = overdueBills.reduce(
      (sum, bill) => sum + bill.amount,
      0,
    );
    const lateFeeEstimate = overdueBills.length * 25; // Average late fee

    return [
      {
        id: "overdue-bills",
        type: "warning",
        priority: "high",
        title: "Overdue Bills Need Attention",
        description: `You have ${overdueBills.length} overdue bill${overdueBills.length !== 1 ? "s" : ""} totaling $${totalOverdue.toFixed(2)}. Acting now could save you up to $${lateFeeEstimate} in late fees.`,
        impact: {
          financial: lateFeeEstimate,
          convenience: 2,
        },
        action: {
          label: "Pay Now",
          type: "navigate",
          data: { route: `/bill/${overdueBills[0].id}` },
        },
        confidence: 95,
        category: "payment_management",
      },
    ];
  }

  private analyzeUpcomingBills(): SmartInsight[] {
    const dueSoonBills = this.bills.filter((bill) => {
      const dueDate = new Date(bill.dueDate);
      const today = new Date();
      const daysUntilDue = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      return (
        daysUntilDue <= 3 && daysUntilDue >= 0 && bill.status === "due-soon"
      );
    });

    if (dueSoonBills.length === 0) return [];

    const totalDueSoon = dueSoonBills.reduce(
      (sum, bill) => sum + bill.amount,
      0,
    );

    return [
      {
        id: "upcoming-bills",
        type: "warning",
        priority: "high",
        title: "Bills Due This Week",
        description: `${dueSoonBills.length} bill${dueSoonBills.length !== 1 ? "s" : ""} totaling $${totalDueSoon.toFixed(2)} ${dueSoonBills.length === 1 ? "is" : "are"} due within 3 days.`,
        impact: {
          financial: totalDueSoon,
          convenience: 8,
        },
        action: {
          label: "Quick Pay",
          type: "navigate",
          data: { route: "/quick-pay" },
        },
        confidence: 90,
        category: "payment_management",
      },
    ];
  }

  private analyzeBudgetOptimization(): SmartInsight[] {
    const insights: SmartInsight[] = [];

    // Analyze spending by category
    const categorySpending = this.calculateCategorySpending();
    const totalMonthlyBills = Object.values(categorySpending).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    if (this.userProfile.monthlyIncome) {
      const billsPercentage =
        (totalMonthlyBills / this.userProfile.monthlyIncome) * 100;

      if (billsPercentage > 50) {
        insights.push({
          id: "high-bills-ratio",
          type: "warning",
          priority: "high",
          title: "Bills Taking Up Large Portion of Income",
          description: `Your bills represent ${billsPercentage.toFixed(1)}% of your income. Consider ways to reduce expenses.`,
          impact: {
            financial: totalMonthlyBills * 0.1, // Potential 10% savings
            convenience: 6,
          },
          action: {
            label: "View Budget Tips",
            type: "navigate",
            data: { route: "/budget-tips" },
          },
          confidence: 85,
          category: "budget_optimization",
        });
      }
    }

    // Look for unusually high bills
    const averages = this.calculateBillAverages();
    for (const bill of this.bills) {
      const categoryAverage = averages[bill.category || "other"];
      if (categoryAverage && bill.amount > categoryAverage * 1.5) {
        insights.push({
          id: `high-bill-${bill.id}`,
          type: "saving_opportunity",
          priority: "medium",
          title: `${bill.billerName} Bill Seems High`,
          description: `Your ${bill.billerName} bill ($${bill.amount}) is ${Math.round((bill.amount / categoryAverage - 1) * 100)}% higher than average for ${bill.category}.`,
          impact: {
            financial: bill.amount - categoryAverage,
            convenience: 7,
          },
          action: {
            label: "View Tips",
            type: "navigate",
            data: { route: `/bill/${bill.id}/optimization` },
          },
          confidence: 75,
          category: "cost_optimization",
        });
      }
    }

    return insights;
  }

  private analyzeAutopayOpportunities(): SmartInsight[] {
    const recurringBills = this.bills.filter(
      (bill) =>
        bill.isRecurring &&
        !bill.category?.includes("autopay") &&
        bill.status !== "paid",
    );

    if (recurringBills.length < 2) return [];

    const timesSaved = recurringBills.length * 10; // 10 minutes per bill per month

    return [
      {
        id: "autopay-opportunity",
        type: "optimization",
        priority: "medium",
        title: "Automate Your Recurring Bills",
        description: `Set up autopay for ${recurringBills.length} recurring bills to save ${timesSaved} minutes monthly and never miss a payment.`,
        impact: {
          time: timesSaved,
          convenience: 9,
          financial: recurringBills.length * 25, // Potential late fee savings
        },
        action: {
          label: "Set Up Autopay",
          type: "navigate",
          data: { route: "/autopay-setup" },
        },
        confidence: 88,
        category: "automation",
      },
    ];
  }

  private analyzeSpendingPatterns(): SmartInsight[] {
    const insights: SmartInsight[] = [];
    const patterns = this.calculateSpendingPatterns();

    for (const pattern of patterns) {
      if (pattern.trend === "increasing" && pattern.variance > 0.2) {
        insights.push({
          id: `spending-trend-${pattern.category}`,
          type: "warning",
          priority: "medium",
          title: `${pattern.category} Costs Rising`,
          description: `Your ${pattern.category.toLowerCase()} spending has increased by ${(pattern.variance * 100).toFixed(1)}% recently.`,
          impact: {
            financial: pattern.monthlyAverage * pattern.variance,
            convenience: 5,
          },
          confidence: 70,
          category: "spending_analysis",
        });
      }
    }

    return insights;
  }

  private analyzeDueDateOptimization(): SmartInsight[] {
    const insights: SmartInsight[] = [];

    // Analyze if bills are clustered around certain dates
    const dueDates = this.bills.map((bill) => new Date(bill.dueDate).getDate());
    const dateFrequency: { [key: number]: number } = {};

    dueDates.forEach((date) => {
      dateFrequency[date] = (dateFrequency[date] || 0) + 1;
    });

    const clusteredDates = Object.entries(dateFrequency)
      .filter(([_, count]) => count >= 3)
      .map(([date, count]) => ({ date: parseInt(date), count }));

    if (clusteredDates.length > 0) {
      const maxCluster = clusteredDates.reduce((max, current) =>
        current.count > max.count ? current : max,
      );

      insights.push({
        id: "due-date-clustering",
        type: "optimization",
        priority: "low",
        title: "Spread Out Your Due Dates",
        description: `${maxCluster.count} bills are due on the ${maxCluster.date}th. Spreading them out could improve cash flow.`,
        impact: {
          convenience: 7,
          financial: 0,
        },
        action: {
          label: "Optimize Dates",
          type: "navigate",
          data: { route: "/due-date-optimizer" },
        },
        confidence: 65,
        category: "cash_flow",
      });
    }

    return insights;
  }

  private analyzeAchievements(): SmartInsight[] {
    const insights: SmartInsight[] = [];

    // Check for on-time payment streaks
    const paidOnTimeBills = this.bills.filter((bill) => bill.status === "paid");
    if (paidOnTimeBills.length >= 10) {
      insights.push({
        id: "payment-streak",
        type: "achievement",
        priority: "low",
        title: "Great Payment Record! 🎉",
        description: `You've successfully paid ${paidOnTimeBills.length} bills on time. Keep up the excellent work!`,
        impact: {
          convenience: 10,
        },
        confidence: 100,
        category: "achievements",
      });
    }

    // Check for budget adherence
    const categorySpending = this.calculateCategorySpending();
    const totalSpending = Object.values(categorySpending).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    if (
      this.userProfile.monthlyIncome &&
      totalSpending < this.userProfile.monthlyIncome * 0.3
    ) {
      insights.push({
        id: "budget-discipline",
        type: "achievement",
        priority: "low",
        title: "Excellent Budget Control",
        description:
          "Your bills are well within your income limits. You're practicing great financial discipline!",
        impact: {
          convenience: 9,
        },
        confidence: 90,
        category: "achievements",
      });
    }

    return insights;
  }

  private analyzePredictions(): SmartInsight[] {
    const insights: SmartInsight[] = [];

    // Predict next month's total based on trends
    const monthlyTotal = this.bills
      .filter((bill) => bill.isRecurring)
      .reduce((sum, bill) => sum + (bill.predictedAmount || bill.amount), 0);

    insights.push({
      id: "monthly-prediction",
      type: "prediction",
      priority: "low",
      title: "Next Month Forecast",
      description: `Based on your patterns, next month's bills will likely total around $${monthlyTotal.toFixed(2)}.`,
      impact: {
        convenience: 6,
      },
      confidence: 75,
      category: "predictions",
    });

    return insights;
  }

  private calculateCategorySpending(): { [category: string]: number } {
    const spending: { [category: string]: number } = {};

    this.bills.forEach((bill) => {
      const category = bill.category || "other";
      spending[category] = (spending[category] || 0) + bill.amount;
    });

    return spending;
  }

  private calculateBillAverages(): { [category: string]: number } {
    const categoryData: { [category: string]: number[] } = {};

    this.bills.forEach((bill) => {
      const category = bill.category || "other";
      if (!categoryData[category]) categoryData[category] = [];
      categoryData[category].push(bill.amount);
    });

    const averages: { [category: string]: number } = {};
    Object.entries(categoryData).forEach(([category, amounts]) => {
      averages[category] =
        amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    });

    return averages;
  }

  private calculateSpendingPatterns(): SpendingPattern[] {
    // This would typically analyze historical data
    // For now, return mock patterns based on current data
    const categorySpending = this.calculateCategorySpending();

    return Object.entries(categorySpending).map(([category, amount]) => ({
      category,
      monthlyAverage: amount,
      trend: "stable" as const,
      variance: Math.random() * 0.3 - 0.15, // -15% to +15%
      efficiency: Math.floor(Math.random() * 30) + 70, // 70-100
    }));
  }
}

// Utility functions for insights
export const getInsightIcon = (type: SmartInsight["type"]) => {
  const icons = {
    saving_opportunity: "💰",
    warning: "⚠️",
    optimization: "🚀",
    achievement: "🎉",
    prediction: "🔮",
  };
  return icons[type];
};

export const getInsightColor = (type: SmartInsight["type"]) => {
  const colors = {
    saving_opportunity: "green",
    warning: "red",
    optimization: "blue",
    achievement: "purple",
    prediction: "teal",
  };
  return colors[type];
};

export const formatImpact = (impact: SmartInsight["impact"]) => {
  const parts = [];

  if (impact.financial) {
    parts.push(`Save $${impact.financial.toFixed(2)}`);
  }

  if (impact.time) {
    parts.push(`Save ${impact.time} minutes`);
  }

  if (impact.convenience) {
    parts.push(`Convenience: ${impact.convenience}/10`);
  }

  return parts.join(" • ");
};
