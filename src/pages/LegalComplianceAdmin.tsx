import React, { useState, useEffect } from "react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  FileText,
  Calendar,
  Users,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Eye,
  Clock,
  Globe,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LegalComplianceRecord {
  userId: string;
  userEmail: string;
  userName: string;
  completedAt: string;
  ipAddress: string;
  userAgent: string;
  agreements: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    electronicConsent: boolean;
    plaidTerms: boolean;
    dataSharing: boolean;
    communicationConsent: boolean;
  };
  agreementTimestamps: {
    [key: string]: string;
  };
  documentVersions: {
    [key: string]: string;
  };
  riskScore?: number;
  auditFlags?: string[];
}

interface ComplianceStats {
  totalUsers: number;
  compliantUsers: number;
  pendingReview: number;
  riskFlags: number;
  completionRate: number;
  averageTime: string;
}

// Mock data - in real app, this would come from your database
const mockComplianceRecords: LegalComplianceRecord[] = [
  {
    userId: "user_001",
    userEmail: "john.doe@example.com",
    userName: "John Doe",
    completedAt: "2024-03-15T14:30:25Z",
    ipAddress: "192.168.1.100",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    agreements: {
      termsOfService: true,
      privacyPolicy: true,
      electronicConsent: true,
      plaidTerms: true,
      dataSharing: false,
      communicationConsent: true,
    },
    agreementTimestamps: {
      termsOfService: "2024-03-15T14:28:15Z",
      privacyPolicy: "2024-03-15T14:28:32Z",
      electronicConsent: "2024-03-15T14:29:01Z",
      plaidTerms: "2024-03-15T14:29:45Z",
      communicationConsent: "2024-03-15T14:30:12Z",
    },
    documentVersions: {
      termsOfService: "2.1",
      privacyPolicy: "1.8",
      electronicConsent: "1.3",
      plaidTerms: "3.2",
      communicationConsent: "1.0",
    },
    riskScore: 5,
    auditFlags: [],
  },
  {
    userId: "user_002",
    userEmail: "sarah.smith@example.com",
    userName: "Sarah Smith",
    completedAt: "2024-03-15T10:15:45Z",
    ipAddress: "10.0.0.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    agreements: {
      termsOfService: true,
      privacyPolicy: true,
      electronicConsent: true,
      plaidTerms: true,
      dataSharing: true,
      communicationConsent: false,
    },
    agreementTimestamps: {
      termsOfService: "2024-03-15T10:12:30Z",
      privacyPolicy: "2024-03-15T10:13:15Z",
      electronicConsent: "2024-03-15T10:13:45Z",
      plaidTerms: "2024-03-15T10:14:20Z",
      dataSharing: "2024-03-15T10:15:00Z",
    },
    documentVersions: {
      termsOfService: "2.1",
      privacyPolicy: "1.8",
      electronicConsent: "1.3",
      plaidTerms: "3.2",
      dataSharing: "1.1",
    },
    riskScore: 2,
    auditFlags: [],
  },
  {
    userId: "user_003",
    userEmail: "mike.johnson@example.com",
    userName: "Mike Johnson",
    completedAt: "2024-03-14T16:45:12Z",
    ipAddress: "203.0.113.45",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    agreements: {
      termsOfService: true,
      privacyPolicy: true,
      electronicConsent: true,
      plaidTerms: false,
      dataSharing: false,
      communicationConsent: false,
    },
    agreementTimestamps: {
      termsOfService: "2024-03-14T16:42:20Z",
      privacyPolicy: "2024-03-14T16:43:05Z",
      electronicConsent: "2024-03-14T16:44:30Z",
    },
    documentVersions: {
      termsOfService: "2.0",
      privacyPolicy: "1.7",
      electronicConsent: "1.3",
    },
    riskScore: 8,
    auditFlags: ["missing_plaid_consent", "outdated_terms_version"],
  },
];

const mockStats: ComplianceStats = {
  totalUsers: 8549,
  compliantUsers: 8234,
  pendingReview: 45,
  riskFlags: 18,
  completionRate: 96.3,
  averageTime: "3.2 minutes",
};

const LegalComplianceAdmin: React.FC = () => {
  const [records, setRecords] = useState<LegalComplianceRecord[]>(
    mockComplianceRecords,
  );
  const [filteredRecords, setFilteredRecords] = useState<
    LegalComplianceRecord[]
  >(mockComplianceRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<
    "all" | "compliant" | "risk" | "pending"
  >("all");
  const [selectedRecord, setSelectedRecord] =
    useState<LegalComplianceRecord | null>(null);

  useEffect(() => {
    let filtered = records;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.userId.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    switch (filterBy) {
      case "compliant":
        filtered = filtered.filter(
          (record) => record.riskScore && record.riskScore <= 3,
        );
        break;
      case "risk":
        filtered = filtered.filter(
          (record) => record.riskScore && record.riskScore > 5,
        );
        break;
      case "pending":
        filtered = filtered.filter(
          (record) => record.auditFlags && record.auditFlags.length > 0,
        );
        break;
    }

    setFilteredRecords(filtered);
  }, [searchTerm, filterBy, records]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const getRiskBadge = (riskScore?: number) => {
    if (!riskScore) return null;

    if (riskScore <= 3) {
      return <Badge className="bg-green-100 text-green-700">Low Risk</Badge>;
    } else if (riskScore <= 5) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700">Medium Risk</Badge>
      );
    } else {
      return <Badge className="bg-red-100 text-red-700">High Risk</Badge>;
    }
  };

  const getDeviceInfo = (userAgent: string) => {
    if (userAgent.includes("iPhone") || userAgent.includes("Android")) {
      return { type: "Mobile", icon: <Smartphone className="h-4 w-4" /> };
    } else if (
      userAgent.includes("Windows") ||
      userAgent.includes("Macintosh")
    ) {
      return { type: "Desktop", icon: <Globe className="h-4 w-4" /> };
    } else {
      return { type: "Unknown", icon: <Globe className="h-4 w-4" /> };
    }
  };

  const exportCompliance = () => {
    // In real app, this would generate and download a CSV/PDF report
    const dataStr = JSON.stringify(filteredRecords, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compliance-report-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-6 pt-12">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div>
            <h1 className="text-2xl font-bold font-display flex items-center">
              <Shield className="h-6 w-6 mr-3" />
              Legal Compliance Dashboard
            </h1>
            <p className="text-navy-200 mt-1">
              Monitor user agreements and regulatory compliance
            </p>
          </div>
          <Button
            onClick={exportCompliance}
            variant="secondary"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-6 gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">
                  Total Users
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {mockStats.totalUsers.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-600">
                  Compliant
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {mockStats.compliantUsers.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">
                  Pending
                </span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {mockStats.pendingReview}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-600">
                  Risk Flags
                </span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {mockStats.riskFlags}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-600">
                  Completion
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {mockStats.completionRate}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-teal-500" />
                <span className="text-sm font-medium text-gray-600">
                  Avg Time
                </span>
              </div>
              <p className="text-2xl font-bold text-teal-600">
                {mockStats.averageTime}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 items-center justify-between"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm"
            >
              <option value="all">All Records</option>
              <option value="compliant">Compliant Only</option>
              <option value="risk">High Risk</option>
              <option value="pending">Pending Review</option>
            </select>
          </div>
        </motion.div>

        {/* Records Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Compliance Records ({filteredRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => {
                    const deviceInfo = getDeviceInfo(record.userAgent);
                    return (
                      <TableRow key={record.userId}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {record.userName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {record.userEmail}
                            </p>
                            <p className="text-xs text-gray-400">
                              ID: {record.userId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {formatDate(record.completedAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {deviceInfo.icon}
                            <span className="text-sm">{deviceInfo.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {record.ipAddress}
                          </code>
                        </TableCell>
                        <TableCell>{getRiskBadge(record.riskScore)}</TableCell>
                        <TableCell>
                          {record.auditFlags && record.auditFlags.length > 0 ? (
                            <Badge variant="destructive" className="text-xs">
                              {record.auditFlags.length} flag
                              {record.auditFlags.length !== 1 ? "s" : ""}
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Clean
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRecord(record)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Legal Compliance Details
                                </DialogTitle>
                              </DialogHeader>
                              {selectedRecord && (
                                <ComplianceDetailView record={selectedRecord} />
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BottomNavBar />
    </div>
  );
};

const ComplianceDetailView: React.FC<{ record: LegalComplianceRecord }> = ({
  record,
}) => {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  const agreementLabels = {
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    electronicConsent: "Electronic Consent (E-SIGN)",
    plaidTerms: "Bank Connection Terms (Plaid)",
    dataSharing: "Data Sharing Agreement",
    communicationConsent: "Marketing Communications",
  };

  return (
    <div className="space-y-6">
      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-sm text-gray-900">{record.userName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-sm text-gray-900">{record.userEmail}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                User ID
              </label>
              <p className="text-sm text-gray-900 font-mono">{record.userId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Completion Date
              </label>
              <p className="text-sm text-gray-900">
                {formatDate(record.completedAt)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                IP Address
              </label>
              <p className="text-sm text-gray-900 font-mono">
                {record.ipAddress}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Risk Score
              </label>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-900">{record.riskScore}/10</p>
                {record.riskScore && record.riskScore <= 3 && (
                  <Badge className="bg-green-100 text-green-700">
                    Low Risk
                  </Badge>
                )}
                {record.riskScore &&
                  record.riskScore > 3 &&
                  record.riskScore <= 5 && (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      Medium Risk
                    </Badge>
                  )}
                {record.riskScore && record.riskScore > 5 && (
                  <Badge className="bg-red-100 text-red-700">High Risk</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agreement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(record.agreements).map(([key, agreed]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {agreed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {agreementLabels[key as keyof typeof agreementLabels]}
                    </p>
                    {agreed && record.agreementTimestamps[key] && (
                      <p className="text-xs text-gray-500">
                        Agreed: {formatDate(record.agreementTimestamps[key])}
                      </p>
                    )}
                    {record.documentVersions[key] && (
                      <p className="text-xs text-gray-500">
                        Version: {record.documentVersions[key]}
                      </p>
                    )}
                  </div>
                </div>
                <Badge
                  variant={agreed ? "default" : "secondary"}
                  className={agreed ? "bg-green-100 text-green-700" : ""}
                >
                  {agreed ? "Accepted" : "Not Accepted"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Flags */}
      {record.auditFlags && record.auditFlags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Audit Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {record.auditFlags.map((flag, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded"
                >
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">
                    {flag.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">
                User Agent
              </label>
              <p className="text-xs text-gray-900 font-mono p-2 bg-gray-50 rounded mt-1">
                {record.userAgent}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Timestamp (UTC)
              </label>
              <p className="text-sm text-gray-900 font-mono">
                {record.completedAt}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalComplianceAdmin;
