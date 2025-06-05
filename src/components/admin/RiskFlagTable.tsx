import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Settings,
  RefreshCw,
  Eye,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import { RiskFlag } from "@/types/admin";
import { cn } from "@/lib/utils";

interface RiskFlagTableProps {
  data: RiskFlag[];
  onAssign?: (flagId: string, assignee: string) => void;
  onUpdateStatus?: (flagId: string, status: RiskFlag["status"]) => void;
  onViewDetails?: (flag: RiskFlag) => void;
  onRefresh?: () => void;
  onConfigure?: () => void;
  configurable?: boolean;
  className?: string;
}

type SortField = keyof RiskFlag | "userName";
type SortDirection = "asc" | "desc";

export const RiskFlagTable: React.FC<RiskFlagTableProps> = ({
  data,
  onAssign,
  onUpdateStatus,
  onViewDetails,
  onRefresh,
  onConfigure,
  configurable = true,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((flag) => {
      const matchesSearch =
        flag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flag.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flag.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || flag.status === filterStatus;
      const matchesType = filterType === "all" || flag.type === filterType;
      const matchesCategory =
        filterCategory === "all" || flag.category === filterCategory;

      return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "createdAt" || sortField === "resolvedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    data,
    searchTerm,
    filterStatus,
    filterType,
    filterCategory,
    sortField,
    sortDirection,
  ]);

  const getTypeIcon = (type: RiskFlag["type"]) => {
    switch (type) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "low":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: RiskFlag["status"]) => {
    switch (status) {
      case "active":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "investigating":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "dismissed":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: RiskFlag["type"]) => {
    const variants = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-amber-100 text-amber-700 border-amber-200",
      low: "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
      <Badge variant="outline" className={variants[type]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: RiskFlag["category"]) => {
    const variants = {
      financial: "bg-green-100 text-green-700",
      security: "bg-purple-100 text-purple-700",
      compliance: "bg-indigo-100 text-indigo-700",
      operational: "bg-orange-100 text-orange-700",
    };

    return (
      <Badge variant="secondary" className={variants[category]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return "text-red-600 font-bold";
    if (severity >= 6) return "text-amber-600 font-medium";
    if (severity >= 4) return "text-blue-600";
    return "text-gray-600";
  };

  const statusCounts = useMemo(() => {
    return data.reduce(
      (acc, flag) => {
        acc[flag.status] = (acc[flag.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [data]);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold">
              Risk Flags Monitor
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {filteredAndSortedData.length} flags
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
            </Button>
            {configurable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onConfigure}
                className="h-8 w-8 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className="flex items-center justify-center space-x-1">
                {getStatusIcon(status as RiskFlag["status"])}
                <span className="text-lg font-semibold">{count}</span>
              </div>
              <p className="text-xs text-gray-500 capitalize">{status}</p>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search flags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("type")}
                    className="h-8 p-0"
                  >
                    {getSortIcon("type")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("title")}
                    className="h-8 p-0 justify-start"
                  >
                    Title {getSortIcon("title")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("userName")}
                    className="h-8 p-0 justify-start"
                  >
                    User {getSortIcon("userName")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("severity")}
                    className="h-8 p-0 justify-start"
                  >
                    Severity {getSortIcon("severity")}
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("status")}
                    className="h-8 p-0 justify-start"
                  >
                    Status {getSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("createdAt")}
                    className="h-8 p-0 justify-start"
                  >
                    Created {getSortIcon("createdAt")}
                  </Button>
                </TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      <Filter className="h-8 w-8 mx-auto mb-2" />
                      <p>No risk flags found matching your criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData.map((flag) => (
                  <TableRow key={flag.id}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {getTypeIcon(flag.type)}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {flag.type.charAt(0).toUpperCase() +
                                flag.type.slice(1)}{" "}
                              Risk
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {flag.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {flag.description}
                        </p>
                        <div className="flex items-center space-x-1">
                          {flag.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs px-1"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {flag.tags.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{flag.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {flag.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {flag.userName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-sm font-mono",
                          getSeverityColor(flag.severity),
                        )}
                      >
                        {flag.severity}/10
                      </span>
                    </TableCell>
                    <TableCell>{getCategoryBadge(flag.category)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(flag.status)}
                        <span className="text-sm capitalize">
                          {flag.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(flag.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
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
                            onClick={() => onViewDetails?.(flag)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {flag.status === "active" && (
                            <DropdownMenuItem
                              onClick={() =>
                                onUpdateStatus?.(flag.id, "investigating")
                              }
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Start Investigation
                            </DropdownMenuItem>
                          )}
                          {flag.status === "investigating" && (
                            <DropdownMenuItem
                              onClick={() =>
                                onUpdateStatus?.(flag.id, "resolved")
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Resolved
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              onAssign?.(flag.id, "admin@example.com")
                            }
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Assign to Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus?.(flag.id, "dismissed")
                            }
                            className="text-red-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Dismiss
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
