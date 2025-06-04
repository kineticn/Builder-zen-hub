import React, { useState } from "react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Eye,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
}

interface ScrapingJob {
  id: string;
  provider: "tesseract" | "google-vision";
  status: "running" | "completed" | "failed";
  accuracy: number;
  processedCount: number;
  totalCount: number;
  startTime: string;
  duration?: string;
}

const kpiData: KPICard[] = [
  {
    title: "Daily Transactions",
    value: "1,247",
    change: 12.5,
    icon: <DollarSign className="h-4 w-4" />,
    trend: "up",
  },
  {
    title: "Success Rate",
    value: "98.2%",
    change: 2.1,
    icon: <CheckCircle className="h-4 w-4" />,
    trend: "up",
  },
  {
    title: "OCR Accuracy",
    value: "94.8%",
    change: -1.2,
    icon: <Eye className="h-4 w-4" />,
    trend: "down",
  },
  {
    title: "Active Users",
    value: "8,549",
    change: 8.7,
    icon: <Users className="h-4 w-4" />,
    trend: "up",
  },
];

const mockScrapingJobs: ScrapingJob[] = [
  {
    id: "1",
    provider: "google-vision",
    status: "completed",
    accuracy: 96.5,
    processedCount: 1250,
    totalCount: 1250,
    startTime: "2024-03-15T10:30:00Z",
    duration: "2m 34s",
  },
  {
    id: "2",
    provider: "tesseract",
    status: "running",
    accuracy: 89.2,
    processedCount: 890,
    totalCount: 1100,
    startTime: "2024-03-15T11:15:00Z",
  },
  {
    id: "3",
    provider: "google-vision",
    status: "failed",
    accuracy: 0,
    processedCount: 45,
    totalCount: 1000,
    startTime: "2024-03-15T09:45:00Z",
    duration: "0m 12s",
  },
  {
    id: "4",
    provider: "tesseract",
    status: "completed",
    accuracy: 91.8,
    processedCount: 750,
    totalCount: 750,
    startTime: "2024-03-15T08:20:00Z",
    duration: "5m 18s",
  },
];

const AdminDashboard: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>("all");

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: ScrapingJob["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ScrapingJob["status"]) => {
    const variants = {
      completed: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
      running: "bg-blue-100 text-blue-700",
    };

    return (
      <Badge variant="secondary" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getProviderBadge = (provider: ScrapingJob["provider"]) => {
    const variants = {
      "google-vision": "bg-purple-100 text-purple-700",
      tesseract: "bg-orange-100 text-orange-700",
    };

    return (
      <Badge variant="secondary" className={variants[provider]}>
        {provider === "google-vision" ? "Google Vision" : "Tesseract"}
      </Badge>
    );
  };

  const filteredJobs =
    selectedProvider === "all"
      ? mockScrapingJobs
      : mockScrapingJobs.filter((job) => job.provider === selectedProvider);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display">Admin Dashboard</h1>
            <p className="text-navy-200 mt-1">
              System monitoring and configuration
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-teal-100 rounded-lg">{kpi.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">
                      {kpi.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xl font-bold text-gray-900">
                        {kpi.value}
                      </p>
                      <div
                        className={cn(
                          "flex items-center text-xs font-medium",
                          kpi.trend === "up"
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      >
                        {kpi.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(kpi.change)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* OCR Provider Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-display">
                OCR Processing Jobs
              </CardTitle>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="google-vision">Google Vision</SelectItem>
                  <SelectItem value="tesseract">Tesseract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </TableCell>
                    <TableCell>{getProviderBadge(job.provider)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {job.processedCount}/{job.totalCount}
                          </span>
                          <span className="text-gray-500">
                            {Math.round(
                              (job.processedCount / job.totalCount) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              job.status === "failed"
                                ? "bg-red-500"
                                : job.status === "completed"
                                  ? "bg-green-500"
                                  : "bg-blue-500",
                            )}
                            style={{
                              width: `${(job.processedCount / job.totalCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-medium",
                          job.accuracy > 95
                            ? "text-green-600"
                            : job.accuracy > 90
                              ? "text-yellow-600"
                              : "text-red-600",
                        )}
                      >
                        {job.accuracy > 0
                          ? `${job.accuracy.toFixed(1)}%`
                          : "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatTime(job.startTime)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {job.duration ||
                        (job.status === "running" ? "Running..." : "N/A")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  API Response Time
                </span>
                <span className="text-sm font-bold text-green-600">142ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Database Connection
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">
                    Healthy
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Queue Processing
                </span>
                <span className="text-sm font-bold text-blue-600">24 jobs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Error Rate
                </span>
                <span className="text-sm font-bold text-red-600">0.3%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Configure OCR Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="mr-2 h-4 w-4" />
                View System Logs
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage User Accounts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Payment Processing Stats
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default AdminDashboard;
