import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Building,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Settings,
  Search,
  Filter,
  Download,
  RefreshCw,
  Shield,
  Clock,
  Zap,
  Eye,
  Trash2,
  DollarSign,
  Calendar,
  BarChart3,
} from "lucide-react";
import { PlaidLinkComponent } from "./PlaidLinkComponent";
import { billDetectionService } from "@/services/billDetectionService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountType: "checking" | "savings" | "credit";
  lastSync: string;
  status: "connected" | "connecting" | "error" | "disconnected";
  billsDetected: number;
  autoAnalysis: boolean;
  balance?: number;
}

interface TransactionBill {
  id: string;
  merchantName: string;
  amount: number;
  frequency: "weekly" | "monthly" | "quarterly" | "yearly";
  lastTransaction: string;
  nextPredicted: string;
  confidence: number;
  category: string;
  accountId: string;
  status: "detected" | "confirmed" | "ignored";
  transactionHistory: Array<{
    date: string;
    amount: number;
    description: string;
  }>;
}

export const BankIntegration: React.FC = () => {
  const { toast } = useToast();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      accountName: "Chase Checking ****1234",
      bankName: "Chase Bank",
      accountType: "checking",
      lastSync: "2024-12-20T10:30:00Z",
      status: "connected",
      billsDetected: 8,
      autoAnalysis: true,
      balance: 2847.65,
    },
    {
      id: "2",
      accountName: "Wells Fargo Credit ****5678",
      bankName: "Wells Fargo",
      accountType: "credit",
      lastSync: "2024-12-20T09:15:00Z",
      status: "connected",
      billsDetected: 5,
      autoAnalysis: true,
    },
    {
      id: "3",
      accountName: "Bank of America Savings ****9012",
      bankName: "Bank of America",
      accountType: "savings",
      lastSync: "2024-12-19T18:45:00Z",
      status: "error",
      billsDetected: 0,
      autoAnalysis: false,
    },
  ]);

  const [detectedBills, setDetectedBills] = useState<TransactionBill[]>([
    {
      id: "1",
      merchantName: "Netflix",
      amount: 15.99,
      frequency: "monthly",
      lastTransaction: "2024-11-28",
      nextPredicted: "2024-12-28",
      confidence: 95,
      category: "Entertainment",
      accountId: "1",
      status: "confirmed",
      transactionHistory: [
        {
          date: "2024-11-28",
          amount: 15.99,
          description: "NETFLIX.COM - MONTHLY SUBSCRIPTION",
        },
        {
          date: "2024-10-28",
          amount: 15.99,
          description: "NETFLIX.COM - MONTHLY SUBSCRIPTION",
        },
        {
          date: "2024-09-28",
          amount: 15.99,
          description: "NETFLIX.COM - MONTHLY SUBSCRIPTION",
        },
      ],
    },
    {
      id: "2",
      merchantName: "Pacific Gas & Electric",
      amount: 142.33,
      frequency: "monthly",
      lastTransaction: "2024-11-30",
      nextPredicted: "2024-12-30",
      confidence: 88,
      category: "Utilities",
      accountId: "1",
      status: "detected",
      transactionHistory: [
        {
          date: "2024-11-30",
          amount: 142.33,
          description: "PACIFIC GAS ELECTRIC - UTILITY BILL",
        },
        {
          date: "2024-10-30",
          amount: 138.97,
          description: "PACIFIC GAS ELECTRIC - UTILITY BILL",
        },
        {
          date: "2024-09-30",
          amount: 156.22,
          description: "PACIFIC GAS ELECTRIC - UTILITY BILL",
        },
      ],
    },
    {
      id: "3",
      merchantName: "Adobe Creative Cloud",
      amount: 52.99,
      frequency: "monthly",
      lastTransaction: "2024-12-05",
      nextPredicted: "2025-01-05",
      confidence: 92,
      category: "Software",
      accountId: "2",
      status: "detected",
      transactionHistory: [
        {
          date: "2024-12-05",
          amount: 52.99,
          description: "ADOBE SYSTEMS INC - CREATIVE CLOUD",
        },
        {
          date: "2024-11-05",
          amount: 52.99,
          description: "ADOBE SYSTEMS INC - CREATIVE CLOUD",
        },
        {
          date: "2024-10-05",
          amount: 52.99,
          description: "ADOBE SYSTEMS INC - CREATIVE CLOUD",
        },
      ],
    },
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    category: "all",
    frequency: "all",
    account: "all",
  });

  const handleConnectBank = () => {
    // Simulate Plaid Link flow
    console.log("Opening Plaid Link...");
    // In real implementation, this would open Plaid Link
  };

  const handleAnalyzeAccount = async (accountId: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis process
    const steps = [
      { progress: 20, message: "Retrieving transaction history..." },
      { progress: 40, message: "Identifying recurring patterns..." },
      { progress: 60, message: "Analyzing payment frequencies..." },
      { progress: 80, message: "Categorizing detected bills..." },
      { progress: 100, message: "Analysis complete!" },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setAnalysisProgress(step.progress);
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }, 1000);
  };

  const handleBillAction = (
    billId: string,
    action: "confirm" | "ignore" | "view",
  ) => {
    if (action === "view") {
      console.log("Opening bill details for", billId);
      return;
    }

    setDetectedBills((prev) =>
      prev.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              status: action === "confirm" ? "confirmed" : "ignored",
            }
          : bill,
      ),
    );
  };

  const handleToggleAutoAnalysis = (accountId: string, enabled: boolean) => {
    setBankAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? { ...account, autoAnalysis: enabled }
          : account,
      ),
    );
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <Building className="h-5 w-5 text-blue-600" />;
      case "savings":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "credit":
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      default:
        return <Building className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case "connecting":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Connecting
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        );
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      weekly: "bg-blue-100 text-blue-700 border-blue-200",
      monthly: "bg-green-100 text-green-700 border-green-200",
      quarterly: "bg-purple-100 text-purple-700 border-purple-200",
      yearly: "bg-orange-100 text-orange-700 border-orange-200",
    };

    return (
      <Badge className={colors[frequency as keyof typeof colors] || ""}>
        {frequency}
      </Badge>
    );
  };

  const filteredBills = detectedBills.filter((bill) => {
    if (
      selectedFilters.status !== "all" &&
      bill.status !== selectedFilters.status
    )
      return false;
    if (
      selectedFilters.category !== "all" &&
      bill.category !== selectedFilters.category
    )
      return false;
    if (
      selectedFilters.frequency !== "all" &&
      bill.frequency !== selectedFilters.frequency
    )
      return false;
    if (
      selectedFilters.account !== "all" &&
      bill.accountId !== selectedFilters.account
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Connected Bank Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-600" />
            <span>Connected Bank Accounts</span>
          </CardTitle>
          <CardDescription>
            Connect your bank accounts to automatically detect recurring bills
            and subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connected Accounts */}
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {getAccountTypeIcon(account.accountType)}
                  <div>
                    <p className="font-medium">{account.accountName}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{account.bankName}</span>
                      <span>
                        Last sync:{" "}
                        {new Date(account.lastSync).toLocaleDateString()}
                      </span>
                      {account.balance && (
                        <span>
                          Balance: ${account.balance.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {account.billsDetected} bills detected
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        Auto-analysis:
                      </span>
                      <Switch
                        checked={account.autoAnalysis}
                        onCheckedChange={(checked) =>
                          handleToggleAutoAnalysis(account.id, checked)
                        }
                        size="sm"
                      />
                    </div>
                  </div>

                  {getStatusBadge(account.status)}

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAnalyzeAccount(account.id)}
                      disabled={account.status !== "connected" || isAnalyzing}
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analyze
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Account */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
            <div className="text-center space-y-4">
              <Building className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">
                  Connect Your Bank Account
                </h3>
                <p className="text-sm text-gray-500">
                  Securely connect your bank accounts to automatically detect
                  bills from transaction patterns
                </p>
              </div>
              <Button
                onClick={handleConnectBank}
                className="bg-teal-600 hover:bg-teal-700 flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Connect with Plaid</span>
              </Button>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>Read-only access</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Instant connection</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600 animate-pulse" />
                <span className="font-medium text-green-900">
                  Analyzing transaction patterns...
                </span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-sm text-green-700">
                Looking for recurring charges and subscription patterns in your
                transaction history.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detected Bills */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bills Detected from Transactions</CardTitle>
              <CardDescription>
                Recurring charges and subscriptions found in your bank accounts
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select
              value={selectedFilters.status}
              onValueChange={(value) =>
                setSelectedFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="detected">Detected</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="ignored">Ignored</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedFilters.frequency}
              onValueChange={(value) =>
                setSelectedFilters((prev) => ({ ...prev, frequency: value }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frequencies</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedFilters.account}
              onValueChange={(value) =>
                setSelectedFilters((prev) => ({ ...prev, account: value }))
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-500">
              {filteredBills.length} of {detectedBills.length} bills
            </div>
          </div>

          {/* Bills List */}
          <div className="space-y-3">
            {filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{bill.merchantName}</h4>
                      <Badge
                        variant={bill.confidence > 90 ? "default" : "secondary"}
                      >
                        {bill.confidence}% confidence
                      </Badge>
                      {getFrequencyBadge(bill.frequency)}
                      {bill.status === "detected" && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          New
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <p className="font-medium">${bill.amount}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Paid:</span>
                        <p className="font-medium">
                          {new Date(bill.lastTransaction).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Next Expected:</span>
                        <p className="font-medium">
                          {new Date(bill.nextPredicted).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{bill.category}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">
                        Recent transactions:
                      </p>
                      <div className="space-y-1">
                        {bill.transactionHistory.slice(0, 2).map((tx, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-gray-600 flex items-center justify-between"
                          >
                            <span>{tx.description}</span>
                            <span>
                              {new Date(tx.date).toLocaleDateString()} - $
                              {tx.amount}
                            </span>
                          </div>
                        ))}
                        {bill.transactionHistory.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{bill.transactionHistory.length - 2} more
                            transactions
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBillAction(bill.id, "view")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {bill.status === "detected" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBillAction(bill.id, "confirm")}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBillAction(bill.id, "ignore")}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Ignore
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBills.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No bills detected matching your current filters.</p>
              <p className="text-sm">
                Try analyzing your accounts or adjusting your filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <span>Analysis Settings</span>
          </CardTitle>
          <CardDescription>
            Configure how BillBuddy analyzes your bank transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Detection Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Minimum confidence threshold
                  </label>
                  <Select defaultValue="80">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60%</SelectItem>
                      <SelectItem value="70">70%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Analysis period (months)
                  </label>
                  <Select defaultValue="12">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Minimum amount threshold
                  </label>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">$1</SelectItem>
                      <SelectItem value="5">$5</SelectItem>
                      <SelectItem value="10">$10</SelectItem>
                      <SelectItem value="25">$25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Security & Privacy</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    Read-only access to transaction data
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    Data encrypted with bank-level security
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    No sensitive information stored
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">You can disconnect anytime</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
