import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Settings,
  RefreshCw,
  Info,
} from "lucide-react";
import { ComplianceMetrics } from "@/types/admin";
import { cn } from "@/lib/utils";
import { tokens } from "@/design-tokens";

interface ComplianceStatusCardProps {
  data: ComplianceMetrics;
  refreshInterval?: number;
  onRefresh?: () => void;
  onConfigure?: () => void;
  configurable?: boolean;
  className?: string;
}

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  critical?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size,
  strokeWidth,
  critical = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (critical) return tokens.colors.semantic.error;
    if (percentage >= 90) return tokens.colors.semantic.success;
    if (percentage >= 75) return tokens.colors.primary.teal[400];
    return tokens.colors.semantic.warning;
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">
          {percentage.toFixed(1)}%
        </span>
        <span className="text-xs text-gray-500 text-center">Compliance</span>
      </div>
    </div>
  );
};

export const ComplianceStatusCard: React.FC<ComplianceStatusCardProps> = ({
  data,
  refreshInterval = 300,
  onRefresh,
  onConfigure,
  configurable = true,
  className,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) {
      return <TrendingUp className="h-3 w-3 text-green-600" />;
    } else if (value < 0) {
      return <TrendingDown className="h-3 w-3 text-red-600" />;
    }
    return null;
  };

  const getCriticalCategories = () => {
    return data.categories.filter((cat) => cat.critical || cat.percentage < 80);
  };

  const filteredCategories =
    selectedCategory === "all"
      ? data.categories
      : data.categories.filter((cat) =>
          cat.category.toLowerCase().includes(selectedCategory.toLowerCase()),
        );

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold">
              Compliance Status
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Legal agreement completion statistics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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

        {/* Critical Alerts */}
        {getCriticalCategories().length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                {getCriticalCategories().length} categories need attention
              </span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "overview" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("overview")}
              className="h-8"
            >
              Overview
            </Button>
            <Button
              variant={viewMode === "detailed" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("detailed")}
              className="h-8"
            >
              Detailed
            </Button>
          </div>

          {viewMode === "detailed" && (
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-40 h-8">
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {data.categories.map((category) => (
                  <SelectItem key={category.category} value={category.category}>
                    {category.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {viewMode === "overview" ? (
          <div className="space-y-4">
            {/* Overall Compliance Circle */}
            <div className="flex flex-col items-center space-y-3">
              <CircularProgress
                percentage={data.overall.percentage}
                size={120}
                strokeWidth={8}
                critical={data.overall.critical}
              />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {data.overall.completed} of {data.overall.total} completed
                </p>
                <p className="text-xs text-gray-500">
                  Updated {formatLastUpdated(data.overall.lastUpdated)}
                </p>
              </div>
            </div>

            {/* Trends */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-sm font-medium text-gray-900">
                    {data.trends.week > 0 ? "+" : ""}
                    {data.trends.week}%
                  </span>
                  {getTrendIcon(data.trends.week)}
                </div>
                <p className="text-xs text-gray-500">This Week</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-sm font-medium text-gray-900">
                    {data.trends.month > 0 ? "+" : ""}
                    {data.trends.month}%
                  </span>
                  {getTrendIcon(data.trends.month)}
                </div>
                <p className="text-xs text-gray-500">This Month</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-sm font-medium text-gray-900">
                    {data.trends.quarter > 0 ? "+" : ""}
                    {data.trends.quarter}%
                  </span>
                  {getTrendIcon(data.trends.quarter)}
                </div>
                <p className="text-xs text-gray-500">This Quarter</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Category Details */}
            {filteredCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {category.category}
                    </span>
                    {category.critical && (
                      <Badge variant="destructive" className="text-xs">
                        Critical
                      </Badge>
                    )}
                    {category.percentage >= 95 && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {category.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={category.percentage}
                  className="h-2"
                  style={
                    {
                      "--progress-background": category.critical
                        ? tokens.colors.semantic.error
                        : category.percentage >= 90
                          ? tokens.colors.semantic.success
                          : category.percentage >= 75
                            ? tokens.colors.primary.teal[400]
                            : tokens.colors.semantic.warning,
                    } as React.CSSProperties
                  }
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {category.completed} / {category.total} completed
                  </span>
                  <span>Updated {formatLastUpdated(category.lastUpdated)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
