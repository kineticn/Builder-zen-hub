import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Zap,
  CheckCircle,
  Mail,
  CreditCard,
  RefreshCw,
  Shield,
} from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

export const BillDiscoveryPageSimple: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleQuickTest = async () => {
    setIsScanning(true);
    setScanProgress(0);

    const steps = [
      { progress: 25, message: "Connecting to demo email..." },
      { progress: 50, message: "Scanning for bills..." },
      { progress: 75, message: "Analyzing patterns..." },
      { progress: 100, message: "Found 5 bills!" },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setScanProgress(step.progress);
    }

    toast({
      title: "Discovery Complete!",
      description: "Found 5 bills from your accounts",
    });

    setTimeout(() => {
      setIsScanning(false);
      setScanProgress(0);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
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

          <Button
            onClick={handleQuickTest}
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
                <span>Test Discovery</span>
              </>
            )}
          </Button>
        </div>

        {/* Scanning Progress */}
        {isScanning && (
          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-teal-600 animate-pulse" />
                  <span className="font-medium text-teal-900">
                    Discovering your bills...
                  </span>
                </div>
                <Progress value={scanProgress} className="h-2" />
                <p className="text-sm text-teal-700">
                  Testing bill discovery functionality
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Bills Found
                  </p>
                  <p className="text-2xl font-bold text-navy-900">23</p>
                </div>
                <Search className="h-8 w-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Email Sources
                  </p>
                  <p className="text-2xl font-bold text-blue-600">2</p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Bank Accounts
                  </p>
                  <p className="text-2xl font-bold text-green-600">1</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Setup */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="email">Email Setup</TabsTrigger>
            <TabsTrigger value="bank">Bank Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Connect your accounts to automatically discover bills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email Integration</p>
                        <p className="text-sm text-gray-500">
                          Scan Gmail, Outlook for bills
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Integration</CardTitle>
                <CardDescription>
                  Connect email accounts to scan for bills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    Connect Email Account
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    We'll scan your emails to find bills automatically
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() =>
                        toast({
                          title: "Gmail Setup",
                          description: "Gmail integration coming soon!",
                        })
                      }
                    >
                      <Mail className="h-4 w-4 mr-2 text-red-600" />
                      Gmail
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        toast({
                          title: "Outlook Setup",
                          description: "Outlook integration coming soon!",
                        })
                      }
                    >
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      Outlook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle>Bank Integration</CardTitle>
                <CardDescription>
                  Connect bank accounts to analyze transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    Connect Bank Account
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Securely connect to analyze transaction patterns
                  </p>
                  <Button
                    onClick={() =>
                      toast({
                        title: "Bank Setup",
                        description: "Bank integration coming soon!",
                      })
                    }
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Connect with Plaid
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
