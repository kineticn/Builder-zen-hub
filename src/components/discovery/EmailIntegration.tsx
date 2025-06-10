import React, { useState, useEffect } from "react";
import {
  Mail,
  MessageSquare,
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
} from "lucide-react";
import { emailService, outlookService } from "@/services/emailService";
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

interface EmailAccount {
  id: string;
  email: string;
  provider: "gmail" | "outlook" | "yahoo";
  status: "connected" | "connecting" | "error" | "disconnected";
  lastSync: string;
  billsFound: number;
  autoSync: boolean;
}

interface EmailBill {
  id: string;
  subject: string;
  sender: string;
  amount?: number;
  dueDate?: string;
  confidence: number;
  category: string;
  receivedDate: string;
  status: "new" | "confirmed" | "ignored";
  emailPreview: string;
}

export const EmailIntegration: React.FC = () => {
  const { toast } = useToast();

  // Load accounts from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem("emailAccounts");
    if (savedAccounts) {
      const accounts = JSON.parse(savedAccounts);
      setEmailAccounts(accounts);
    }
  }, []);

  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([
    {
      id: "1",
      email: "john.doe@gmail.com",
      provider: "gmail",
      status: "connected",
      lastSync: "2024-12-20T10:30:00Z",
      billsFound: 15,
      autoSync: true,
    },
    {
      id: "2",
      email: "john.work@outlook.com",
      provider: "outlook",
      status: "connecting",
      lastSync: "2024-12-19T15:45:00Z",
      billsFound: 0,
      autoSync: false,
    },
  ]);

  const [discoveredBills, setDiscoveredBills] = useState<EmailBill[]>([
    {
      id: "1",
      subject: "Your Netflix bill is ready",
      sender: "Netflix <info@netflix.com>",
      amount: 15.99,
      dueDate: "2024-12-28",
      confidence: 95,
      category: "Entertainment",
      receivedDate: "2024-12-20T08:00:00Z",
      status: "confirmed",
      emailPreview:
        "Your Netflix subscription payment of $15.99 will be charged on December 28, 2024...",
    },
    {
      id: "2",
      subject: "Pacific Gas & Electric Statement Available",
      sender: "PG&E <noreply@pge.com>",
      amount: 142.33,
      dueDate: "2024-12-30",
      confidence: 88,
      category: "Utilities",
      receivedDate: "2024-12-19T12:30:00Z",
      status: "new",
      emailPreview:
        "Your December statement is now available. Amount due: $142.33. Pay by December 30 to avoid late fees...",
    },
    {
      id: "3",
      subject: "Spotify Premium - Payment Confirmation",
      sender: "Spotify <no-reply@spotify.com>",
      amount: 9.99,
      confidence: 98,
      category: "Entertainment",
      receivedDate: "2024-12-18T14:15:00Z",
      status: "confirmed",
      emailPreview:
        "Thank you for your Spotify Premium payment of $9.99. Your subscription continues...",
    },
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    category: "all",
    confidence: "all",
  });

  const handleConnectAccount = (provider: "gmail" | "outlook" | "yahoo") => {
    try {
      if (provider === "gmail") {
        const authUrl = emailService.generateAuthUrl();
        window.location.href = authUrl;
      } else if (provider === "outlook") {
        const authUrl = outlookService.generateAuthUrl();
        window.location.href = authUrl;
      } else {
        toast({
          title: "Coming Soon",
          description: "Yahoo integration will be available soon!",
        });
      }
    } catch (error) {
      console.error("OAuth error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to start OAuth flow",
        variant: "destructive",
      });
    }
  };

  const handleScanAccount = async (accountId: string) => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning process
    const steps = [
      { progress: 20, message: "Connecting to email server..." },
      { progress: 40, message: "Analyzing recent emails..." },
      { progress: 60, message: "Detecting bill patterns..." },
      { progress: 80, message: "Extracting bill information..." },
      { progress: 100, message: "Scan complete!" },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setScanProgress(step.progress);
    }

    setTimeout(() => {
      setIsScanning(false);
      setScanProgress(0);
    }, 1000);
  };

  const handleToggleAutoSync = (accountId: string, enabled: boolean) => {
    setEmailAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId ? { ...account, autoSync: enabled } : account,
      ),
    );
  };

  const handleBillAction = (
    billId: string,
    action: "confirm" | "ignore" | "view",
  ) => {
    if (action === "view") {
      // Open email in new tab or modal
      console.log("Opening bill details for", billId);
      return;
    }

    setDiscoveredBills((prev) =>
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

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "gmail":
        return <Mail className="h-5 w-5 text-red-600" />;
      case "outlook":
        return <Mail className="h-5 w-5 text-blue-600" />;
      case "yahoo":
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      default:
        return <Mail className="h-5 w-5 text-gray-600" />;
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

  const filteredBills = discoveredBills.filter((bill) => {
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
    if (selectedFilters.confidence !== "all") {
      const confidenceThreshold =
        selectedFilters.confidence === "high" ? 90 : 70;
      if (bill.confidence < confidenceThreshold) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Email Accounts Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <span>Connected Email Accounts</span>
          </CardTitle>
          <CardDescription>
            Connect your email accounts to automatically discover bills and
            statements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connected Accounts */}
          <div className="space-y-3">
            {emailAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {getProviderIcon(account.provider)}
                  <div>
                    <p className="font-medium">{account.email}</p>
                    <p className="text-sm text-gray-500">
                      Last sync:{" "}
                      {new Date(account.lastSync).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {account.billsFound} bills found
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Auto-sync:</span>
                      <Switch
                        checked={account.autoSync}
                        onCheckedChange={(checked) =>
                          handleToggleAutoSync(account.id, checked)
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
                      onClick={() => handleScanAccount(account.id)}
                      disabled={account.status !== "connected" || isScanning}
                    >
                      <Search className="h-4 w-4 mr-1" />
                      Scan
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
              <h3 className="font-medium text-gray-900">
                Connect Another Email Account
              </h3>
              <p className="text-sm text-gray-500">
                The more accounts you connect, the more bills we can discover
                automatically
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleConnectAccount("gmail")}
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4 text-red-600" />
                  <span>Gmail</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleConnectAccount("outlook")}
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>Outlook</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleConnectAccount("yahoo")}
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  <span>Yahoo</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scanning Progress */}
      {isScanning && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-medium text-blue-900">
                  Scanning emails for bills...
                </span>
              </div>
              <Progress value={scanProgress} className="h-2" />
              <p className="text-sm text-blue-700">
                Analyzing your recent emails to find bills and statements.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discovered Bills */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Discovered Bills from Email</CardTitle>
              <CardDescription>
                Bills and statements found in your connected email accounts
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="ignored">Ignored</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedFilters.category}
              onValueChange={(value) =>
                setSelectedFilters((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Software">Software</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedFilters.confidence}
              onValueChange={(value) =>
                setSelectedFilters((prev) => ({ ...prev, confidence: value }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence</SelectItem>
                <SelectItem value="high">High (90%+)</SelectItem>
                <SelectItem value="medium">Medium (70%+)</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-500">
              {filteredBills.length} of {discoveredBills.length} bills
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
                      <h4 className="font-medium">{bill.subject}</h4>
                      <Badge
                        variant={bill.confidence > 90 ? "default" : "secondary"}
                      >
                        {bill.confidence}% match
                      </Badge>
                      {bill.status === "new" && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{bill.sender}</p>
                    <p className="text-sm text-gray-500">{bill.emailPreview}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {bill.amount && <span>Amount: ${bill.amount}</span>}
                      {bill.dueDate && (
                        <span>
                          Due: {new Date(bill.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span>Category: {bill.category}</span>
                      <span>
                        Received:{" "}
                        {new Date(bill.receivedDate).toLocaleDateString()}
                      </span>
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
                    {bill.status === "new" && (
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
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No bills found matching your current filters.</p>
              <p className="text-sm">
                Try adjusting your filters or connecting more email accounts.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Discovery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <span>Discovery Settings</span>
          </CardTitle>
          <CardDescription>
            Configure how BillBuddy analyzes your emails for bills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Scan Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Automatic daily scan
                  </label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Scan promotional emails
                  </label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Include attachments
                  </label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Privacy & Security</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    Emails are processed securely and never stored
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">
                    Only bill-related content is extracted
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">You can revoke access anytime</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
