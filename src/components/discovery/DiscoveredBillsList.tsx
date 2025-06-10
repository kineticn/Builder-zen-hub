import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Trash2,
  Plus,
  Calendar,
  DollarSign,
  Building,
  Mail,
  CreditCard,
  Star,
  AlertCircle,
  Clock,
  TrendingUp,
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
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/components/ui/checkbox";

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
  frequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  accountName?: string;
  description?: string;
}

interface DiscoveredBillsListProps {
  bills: DiscoveredBill[];
}

export const DiscoveredBillsList: React.FC<DiscoveredBillsListProps> = ({
  bills: initialBills,
}) => {
  const [bills, setBills] = useState<DiscoveredBill[]>(initialBills);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: "all",
    source: "all",
    category: "all",
    confidence: "all",
  });
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  // Extended mock data for better demonstration
  const extendedBills: DiscoveredBill[] = [
    ...initialBills,
    {
      id: "5",
      name: "Comcast Internet",
      amount: 89.99,
      dueDate: "2024-12-25",
      category: "Utilities",
      source: "bank",
      confidence: 91,
      isRecurring: true,
      frequency: "monthly",
      lastPaid: "2024-11-25",
      status: "pending",
      accountName: "Chase Checking",
      description: "Monthly internet service",
    },
    {
      id: "6",
      name: "State Farm Insurance",
      amount: 156.42,
      dueDate: "2025-01-15",
      category: "Insurance",
      source: "email",
      confidence: 94,
      isRecurring: true,
      frequency: "monthly",
      lastPaid: "2024-12-15",
      status: "confirmed",
      description: "Auto insurance premium",
    },
    {
      id: "7",
      name: "Amazon Prime",
      amount: 14.99,
      dueDate: "2024-12-30",
      category: "Entertainment",
      source: "bank",
      confidence: 96,
      isRecurring: true,
      frequency: "monthly",
      lastPaid: "2024-11-30",
      status: "confirmed",
      accountName: "Wells Fargo Credit",
      description: "Prime membership",
    },
    {
      id: "8",
      name: "Gym Membership",
      amount: 39.99,
      dueDate: "2025-01-01",
      category: "Health",
      source: "bank",
      confidence: 87,
      isRecurring: true,
      frequency: "monthly",
      lastPaid: "2024-12-01",
      status: "pending",
      accountName: "Chase Checking",
      description: "Monthly gym membership",
    },
  ];

  // Filter bills based on search and filters
  const filteredBills = extendedBills.filter((bill) => {
    const matchesSearch = bill.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filters.status === "all" || bill.status === filters.status;
    const matchesSource =
      filters.source === "all" || bill.source === filters.source;
    const matchesCategory =
      filters.category === "all" || bill.category === filters.category;
    const matchesConfidence =
      filters.confidence === "all" ||
      (filters.confidence === "high" && bill.confidence >= 90) ||
      (filters.confidence === "medium" && bill.confidence >= 70);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSource &&
      matchesCategory &&
      matchesConfidence
    );
  });

  const handleBillAction = (
    billId: string,
    action: "confirm" | "ignore" | "view" | "add",
  ) => {
    if (action === "view") {
      console.log("Opening bill details for", billId);
      return;
    }

    if (action === "add") {
      // Add bill to main bills list
      console.log("Adding bill to bills list", billId);
      setBills((prev) =>
        prev.map((bill) =>
          bill.id === billId ? { ...bill, status: "confirmed" } : bill,
        ),
      );
      return;
    }

    setBills((prev) =>
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

  const handleSelectBill = (billId: string, selected: boolean) => {
    if (selected) {
      setSelectedBills((prev) => [...prev, billId]);
    } else {
      setSelectedBills((prev) => prev.filter((id) => id !== billId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedBills(filteredBills.map((bill) => bill.id));
    } else {
      setSelectedBills([]);
    }
  };

  const handleBulkAction = (action: "confirm" | "ignore" | "add") => {
    setBills((prev) =>
      prev.map((bill) =>
        selectedBills.includes(bill.id)
          ? {
              ...bill,
              status:
                action === "confirm" || action === "add"
                  ? "confirmed"
                  : "ignored",
            }
          : bill,
      ),
    );
    setSelectedBills([]);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-600" />;
      case "bank":
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case "manual":
        return <Plus className="h-4 w-4 text-purple-600" />;
      default:
        return <Building className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "ignored":
        return (
          <Badge variant="secondary">
            <Trash2 className="h-3 w-3 mr-1" />
            Ignored
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 95) {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
          <Star className="h-3 w-3 mr-1" />
          {confidence}%
        </Badge>
      );
    } else if (confidence >= 85) {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          {confidence}%
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          {confidence}%
        </Badge>
      );
    }
  };

  const stats = {
    total: filteredBills.length,
    confirmed: filteredBills.filter((b) => b.status === "confirmed").length,
    pending: filteredBills.filter((b) => b.status === "pending").length,
    totalValue: filteredBills.reduce((sum, bill) => sum + bill.amount, 0),
    recurring: filteredBills.filter((b) => b.isRecurring).length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bills</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Search className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.confirmed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${stats.totalValue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Discovered Bills</CardTitle>
              <CardDescription>
                Review and manage bills found automatically from your accounts
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cards">Cards</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="ignored">Ignored</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.source}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, source: value }))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, category: value }))
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
                <SelectItem value="Health">Health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedBills.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-teal-900">
                  {selectedBills.length} bills selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("add")}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Bills
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("confirm")}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("ignore")}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Ignore
                </Button>
              </div>
            </div>
          )}

          {/* Bills Display */}
          {viewMode === "cards" ? (
            <div className="space-y-3">
              {filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedBills.includes(bill.id)}
                        onCheckedChange={(checked) =>
                          handleSelectBill(bill.id, !!checked)
                        }
                        className="mt-1"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium">{bill.name}</h4>
                          {getStatusBadge(bill.status)}
                          {getConfidenceBadge(bill.confidence)}
                          {bill.isRecurring && (
                            <Badge variant="outline">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Recurring
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Amount:</span>
                            <p className="font-medium">${bill.amount}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Due Date:</span>
                            <p className="font-medium">
                              {new Date(bill.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Category:</span>
                            <p className="font-medium">{bill.category}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-500">Source:</span>
                            <div className="flex items-center space-x-1">
                              {getSourceIcon(bill.source)}
                              <p className="font-medium capitalize">
                                {bill.source}
                              </p>
                            </div>
                          </div>
                        </div>

                        {bill.description && (
                          <p className="text-sm text-gray-600">
                            {bill.description}
                          </p>
                        )}

                        {bill.accountName && (
                          <p className="text-xs text-gray-500">
                            From: {bill.accountName}
                          </p>
                        )}
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
                      {bill.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBillAction(bill.id, "add")}
                            className="text-teal-600 border-teal-200 hover:bg-teal-50"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Bill
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBillAction(bill.id, "ignore")}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedBills.length === filteredBills.length &&
                          filteredBills.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedBills.includes(bill.id)}
                          onCheckedChange={(checked) =>
                            handleSelectBill(bill.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{bill.name}</TableCell>
                      <TableCell>${bill.amount}</TableCell>
                      <TableCell>
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{bill.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getSourceIcon(bill.source)}
                          <span className="capitalize">{bill.source}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(bill.status)}</TableCell>
                      <TableCell>
                        {getConfidenceBadge(bill.confidence)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBillAction(bill.id, "view")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {bill.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBillAction(bill.id, "add")}
                                className="text-teal-600 border-teal-200 hover:bg-teal-50"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleBillAction(bill.id, "ignore")
                                }
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredBills.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-medium mb-2">No bills found</h3>
              <p className="text-sm">
                {searchTerm || Object.values(filters).some((f) => f !== "all")
                  ? "Try adjusting your search or filters"
                  : "Connect your email and bank accounts to start discovering bills automatically"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
