import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  CreditCard,
  Search,
  Zap,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  Building,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailIntegration } from "@/components/discovery/EmailIntegration";
import { BankIntegration } from "@/components/discovery/BankIntegration";
import { DiscoveredBillsList } from "@/components/discovery/DiscoveredBillsList";
import { useNavigate } from "react-router-dom";

interface DiscoveryStats {
  totalBillsFound: number;
  emailBillsFound: number;
  bankBillsFound: number;
  potentialSavings: number;
  subscriptionsFound: number;
  duplicatesFound: number;
}

interface DiscoveredBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  source: "email" | "bank" | "manual";
  confidence: number;
  isRecurring: boolean;
  lastPaid?: string;
  merchantLogo?: string;
  status: "pending" | "confirmed" | "ignored";
}

export const BillDiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState("");
  const [discoveryStats, setDiscoveryStats] = useState<DiscoveryStats>({
    totalBillsFound: 23,
    emailBillsFound: 15,
    bankBillsFound: 8,
    potentialSavings: 127.5,
    subscriptionsFound: 12,
    duplicatesFound: 3,
  });

  const [discoveredBills] = useState<DiscoveredBill[]>([
    {
      id: "1",
      name: "Netflix Subscription",
      amount: 15.99,
      dueDate: "2024-12-28",
      category: "Entertainment",
      source: "email",
      confidence: 95,
      isRecurring: true,
      lastPaid: "2024-11-28",
      status: "confirmed",
    },
    {
      id: "2",
      name: "Pacific Gas & Electric",
      amount: 142.33,
      dueDate: "2024-12-30",
      category: "Utilities",
      source: "bank",
      confidence: 88,
      isRecurring: true,
      lastPaid: "2024-11-30",
      status: "pending",
    },
    {
      id: "3",
      name: "Spotify Premium",
      amount: 9.99,
      dueDate: "2024-12-25",
      category: "Entertainment",
      source: "email",
      confidence: 98,
      isRecurring: true,
      lastPaid: "2024-11-25",
      status: "confirmed",
    },
    {
      id: "4",
      name: "Adobe Creative Cloud",
      amount: 52.99,
      dueDate: "2025-01-05",
      category: "Software",
      source: "bank",
      confidence: 92,
      isRecurring: true,
      lastPaid: "2024-12-05",
      status: "pending",
    },
  ]);

  const handleFullScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const steps = [
      { progress: 20, message: "Connecting to email..." },
      { progress: 40, message: "Scanning emails for bills..." },
      { progress: 60, message: "Analyzing bank transactions..." },
      { progress: 80, message: "Detecting patterns..." },
      { progress: 100, message: "Discovery complete!" },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setScanProgress(step.progress);
    }

    setTimeout(() => {
      setIsScanning(false);
      setScanProgress(0);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-navy-900 font-display">
                Bill Discovery
              </h1>
              <p className="text-gray-600">
                Automatically find and organize all your bills
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleFullScan}
              disabled={isScanning}
              className="bg-teal-600 hover:bg-teal-700 flex items-center space-x-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Start Full Scan</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Scanning Progress */}
        {isScanning && (
          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-teal-600" />
                    <span className="font-medium text-teal-900">
                      Discovering your bills...
                    </span>
                  </div>
                  <span className="text-sm text-teal-700">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
                <p className="text-sm text-teal-700">
                  This may take a few minutes as we analyze your emails and
                  transactions.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discovery Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Bills Found
                  </p>
                  <p className="text-2xl font-bold text-navy-900">
                    {discoveryStats.totalBillsFound}
                  </p>
                </div>
                <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Search className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
                <span>{discoveryStats.emailBillsFound} from email</span>
                <span>{discoveryStats.bankBillsFound} from bank</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Potential Savings
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${discoveryStats.potentialSavings}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                {discoveryStats.duplicatesFound} duplicate subscriptions found
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Subscriptions
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {discoveryStats.subscriptionsFound}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Recurring monthly charges detected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coverage</p>
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Of your bills automatically detected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="email">Email Discovery</TabsTrigger>
            <TabsTrigger value="bank">Bank Analysis</TabsTrigger>
            <TabsTrigger value="discovered">Discovered Bills</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Setup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>Quick Setup</span>
                  </CardTitle>
                  <CardDescription>
                    Connect your accounts to start discovering bills
                    automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Email Integration</p>
                          <p className="text-sm text-gray-500">
                            Scan Gmail, Outlook for bills
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Connected</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Bank Accounts</p>
                          <p className="text-sm text-gray-500">
                            Analyze transactions for bills
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Utility Providers</p>
                          <p className="text-sm text-gray-500">
                            Direct bill import
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Setup
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Discoveries */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Discoveries</CardTitle>
                  <CardDescription>
                    Bills we've found in the last 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {discoveredBills.slice(0, 4).map((bill) => (
                      <div
                        key={bill.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              bill.status === "confirmed"
                                ? "bg-green-500"
                                : bill.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-gray-400"
                            }`}
                          />
                          <div>
                            <p className="font-medium">{bill.name}</p>
                            <p className="text-sm text-gray-500">
                              ${bill.amount} • {bill.source}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            bill.confidence > 90 ? "default" : "secondary"
                          }
                        >
                          {bill.confidence}% match
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Discovery Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Discovery Methods</CardTitle>
                <CardDescription>
                  How BillBuddy finds your bills automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">Email Analysis</h3>
                    <p className="text-sm text-gray-600">
                      Scans your inbox for bills, invoices, and payment
                      reminders using AI
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CreditCard className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold">Transaction Patterns</h3>
                    <p className="text-sm text-gray-600">
                      Analyzes bank transactions to identify recurring bills and
                      subscriptions
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Search className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Smart Detection</h3>
                    <p className="text-sm text-gray-600">
                      Uses machine learning to recognize new bills and improve
                      accuracy over time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <EmailIntegration />
          </TabsContent>

          <TabsContent value="bank">
            <BankIntegration />
          </TabsContent>

          <TabsContent value="discovered">
            <DiscoveredBillsList bills={discoveredBills} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
