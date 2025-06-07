import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Filter,
  Search,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CreditCard,
  DollarSign,
  Receipt,
  RefreshCw,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BottomNavBar } from "@/components/BottomNavBar";
import { tokens } from "@/design-tokens";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "payment" | "income" | "refund" | "fee";
  amount: number;
  description: string;
  payee: string;
  category: string;
  status: "completed" | "pending" | "failed" | "cancelled";
  date: string;
  accountLast4?: string;
  confirmationNumber?: string;
  householdId: string;
}

interface ActivitySummary {
  totalSpent: number;
  totalIncome: number;
  billsPaid: number;
  pendingPayments: number;
  period: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    type: "payment",
    amount: -125.5,
    description: "Electric Bill Payment",
    payee: "Electric Company",
    category: "Utilities",
    status: "completed",
    date: "2024-12-05T10:30:00Z",
    accountLast4: "4532",
    confirmationNumber: "EC-2024-001",
    householdId: "home",
  },
  {
    id: "txn_002",
    type: "payment",
    amount: -79.99,
    description: "Internet Service Payment",
    payee: "Internet Provider",
    category: "Internet",
    status: "completed",
    date: "2024-12-04T15:45:00Z",
    accountLast4: "4532",
    confirmationNumber: "IP-2024-045",
    householdId: "home",
  },
  {
    id: "txn_003",
    type: "payment",
    amount: -450.0,
    description: "Credit Card Payment",
    payee: "Chase Bank",
    category: "Credit Card",
    status: "pending",
    date: "2024-12-04T09:15:00Z",
    accountLast4: "4532",
    householdId: "home",
  },
  {
    id: "txn_004",
    type: "refund",
    amount: 25.99,
    description: "Streaming Service Refund",
    payee: "Netflix",
    category: "Entertainment",
    status: "completed",
    date: "2024-12-03T14:20:00Z",
    accountLast4: "4532",
    confirmationNumber: "NF-REF-2024",
    householdId: "home",
  },
  {
    id: "txn_005",
    type: "payment",
    amount: -1200.0,
    description: "Rent Payment",
    payee: "Property Management",
    category: "Housing",
    status: "completed",
    date: "2024-12-01T08:00:00Z",
    accountLast4: "4532",
    confirmationNumber: "RENT-DEC-2024",
    householdId: "home",
  },
  {
    id: "txn_006",
    type: "fee",
    amount: -2.99,
    description: "BillBuddy Pro Subscription",
    payee: "BillBuddy",
    category: "Software",
    status: "completed",
    date: "2024-11-30T12:00:00Z",
    accountLast4: "4532",
    confirmationNumber: "BB-SUB-2024",
    householdId: "home",
  },
  {
    id: "txn_007",
    type: "payment",
    amount: -89.5,
    description: "Water & Sewer Bill",
    payee: "Water Department",
    category: "Utilities",
    status: "failed",
    date: "2024-11-28T16:30:00Z",
    accountLast4: "4532",
    householdId: "home",
  },
  {
    id: "txn_008",
    type: "income",
    amount: 50.0,
    description: "Cashback Reward",
    payee: "BillBuddy Rewards",
    category: "Rewards",
    status: "completed",
    date: "2024-11-27T11:15:00Z",
    accountLast4: "4532",
    confirmationNumber: "RWD-2024-11",
    householdId: "home",
  },
];

const mockSummary: ActivitySummary = {
  totalSpent: 1947.98,
  totalIncome: 75.99,
  billsPaid: 12,
  pendingPayments: 1,
  period: "Last 30 days",
};

/**
 * Comprehensive activity page showing transaction history and account activity
 * Features filtering, search, export functionality, and detailed transaction views
 * Mobile-first responsive design with accessibility compliance
 */
const ActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30");

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleExport = () => {
    const csvContent = [
      "Date,Description,Payee,Category,Amount,Status,Confirmation Number",
      ...filteredTransactions.map((transaction) =>
        [
          new Date(transaction.date).toLocaleDateString(),
          `"${transaction.description}"`,
          `"${transaction.payee}"`,
          transaction.category,
          transaction.amount,
          transaction.status,
          transaction.confirmationNumber || "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `billbuddy-transactions-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    // Show transaction details in a modal or navigate to detail page
    alert(
      `Transaction Details:\n\nID: ${transaction.id}\nAmount: ${formatCurrency(transaction.amount)}\nPayee: ${transaction.payee}\nDate: ${formatDate(transaction.date)}\nStatus: ${transaction.status}${transaction.confirmationNumber ? `\nConfirmation: ${transaction.confirmationNumber}` : ""}`,
    );
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "payment":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case "income":
        return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      case "refund":
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case "fee":
        return <Receipt className="h-4 w-4 text-gray-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    const variants = {
      completed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    };

    return (
      <Badge variant="outline" className={cn("text-xs", variants[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    const daysAgo = new Date(
      now.getTime() - parseInt(selectedPeriod) * 24 * 60 * 60 * 1000,
    );

    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.payee.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || transaction.type === selectedFilter;

    const matchesPeriod = transactionDate >= daysAgo;

    return matchesSearch && matchesFilter && matchesPeriod;
  });

  // Calculate filtered statistics
  const filteredSummary = {
    totalSpent: filteredTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    totalIncome: filteredTransactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0),
    billsPaid: filteredTransactions.filter(
      (t) => t.status === "completed" && t.amount < 0,
    ).length,
    pendingPayments: filteredTransactions.filter((t) => t.status === "pending")
      .length,
    period:
      selectedPeriod === "7"
        ? "Last 7 days"
        : selectedPeriod === "30"
          ? "Last 30 days"
          : selectedPeriod === "90"
            ? "Last 90 days"
            : "Last year",
  };

  return (
    <div
      className="min-h-screen bg-gray-50 pb-20"
      style={{ opacity: 1, visibility: "visible" }}
    >
      {/* Header */}
      <header
        className="bg-gradient-to-r text-white p-6 pt-12"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.primary.navy[900]}, ${tokens.colors.primary.navy[800]})`,
        }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Receipt className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Activity</h1>
          </div>
        </div>

        <p className="text-navy-200 mb-6">
          View your transaction history and account activity
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-400">
              {formatCurrency(filteredSummary.totalSpent)}
            </div>
            <div className="text-xs opacity-80">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(filteredSummary.totalIncome)}
            </div>
            <div className="text-xs opacity-80">Income & Refunds</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {filteredSummary.billsPaid}
            </div>
            <div className="text-xs opacity-80">Bills Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">
              {filteredSummary.pendingPayments}
            </div>
            <div className="text-xs opacity-80">Pending</div>
          </div>
        </div>

        {/* Period indicator */}
        <div className="text-center mt-4">
          <p className="text-sm text-navy-200">
            Showing results for {filteredSummary.period}
          </p>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                  <SelectItem value="fee">Fees</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={handleExport}
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Transactions</span>
              <Badge variant="outline">
                {filteredTransactions.length} transactions
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No transactions found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                    animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.3,
                      delay: shouldReduceMotion ? 0 : index * 0.05,
                    }}
                    className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                        {getTransactionIcon(transaction.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {transaction.description}
                          </h3>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{transaction.payee}</span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                          {transaction.accountLast4 && (
                            <>
                              <span>•</span>
                              <span>****{transaction.accountLast4}</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(transaction.date)}
                          {transaction.confirmationNumber && (
                            <span className="ml-2">
                              #{transaction.confirmationNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div
                          className={cn(
                            "font-semibold",
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-gray-900",
                          )}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </div>
                        {getStatusIcon(transaction.status)}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleTransactionClick(transaction)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              // Generate a simple receipt download
                              const receiptContent = `BillBuddy Receipt\n\nTransaction ID: ${transaction.id}\nDate: ${formatDate(transaction.date)}\nPayee: ${transaction.payee}\nDescription: ${transaction.description}\nAmount: ${formatCurrency(transaction.amount)}\nStatus: ${transaction.status}\n${transaction.confirmationNumber ? `Confirmation: ${transaction.confirmationNumber}\n` : ""}Category: ${transaction.category}\nAccount: ${transaction.accountLast4 ? `****${transaction.accountLast4}` : "N/A"}\n\nThank you for using BillBuddy!`;

                              const blob = new Blob([receiptContent], {
                                type: "text/plain;charset=utf-8;",
                              });
                              const link = document.createElement("a");
                              const url = URL.createObjectURL(blob);
                              link.setAttribute("href", url);
                              link.setAttribute(
                                "download",
                                `receipt-${transaction.id}.txt`,
                              );
                              link.style.visibility = "hidden";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                          {transaction.status === "failed" && (
                            <DropdownMenuItem
                              onClick={() => {
                                // In a real app, this would retry the payment
                                alert(
                                  `Retrying payment for ${transaction.description}.\n\nThis would redirect to the payment flow to complete the transaction.`,
                                );
                              }}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Retry Payment
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Load More / Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                alert(
                  "Load more functionality would fetch additional transactions from the server.\n\nIn a real app, this would load older transactions with pagination.",
                );
              }}
            >
              Load More Transactions
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default ActivityPage;
