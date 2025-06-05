import React, { useState, useMemo } from "react";
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
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  Settings,
  RefreshCw,
  Wifi,
  WifiOff,
  Pause,
  AlertTriangle,
  Timer,
  Database,
  Globe,
  Server,
} from "lucide-react";
import { BillSyncMetrics, WebhookHealth } from "@/types/admin";
import { cn } from "@/lib/utils";
import { tokens } from "@/design-tokens";

interface BillSyncStatusProps {
  data: BillSyncMetrics;
  onRefresh?: () => void;
  onConfigure?: () => void;
  onWebhookAction?: (
    webhookId: string,
    action: "restart" | "pause" | "test",
  ) => void;
  configurable?: boolean;
  className?: string;
}

export const BillSyncStatus: React.FC<BillSyncStatusProps> = ({
  data,
  onRefresh,
  onConfigure,
  onWebhookAction,
  configurable = true,
  className,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const getStatusIcon = (
    status: WebhookHealth["status"],
    size: "sm" | "md" = "sm",
  ) => {
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

    switch (status) {
      case "healthy":
        return <CheckCircle className={cn(sizeClass, "text-green-600")} />;
      case "degraded":
        return <AlertTriangle className={cn(sizeClass, "text-amber-600")} />;
      case "down":
        return <WifiOff className={cn(sizeClass, "text-red-600")} />;
      case "maintenance":
        return <Pause className={cn(sizeClass, "text-blue-600")} />;
      default:
        return <AlertCircle className={cn(sizeClass, "text-gray-600")} />;
    }
  };

  const getStatusBadge = (status: WebhookHealth["status"]) => {
    const variants = {
      healthy: "bg-green-100 text-green-700 border-green-200",
      degraded: "bg-amber-100 text-amber-700 border-amber-200",
      down: "bg-red-100 text-red-700 border-red-200",
      maintenance: "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getProviderIcon = (provider: string) => {
    const icons = {
      Plaid: <Database className="h-4 w-4 text-blue-600" />,
      Yodlee: <Globe className="h-4 w-4 text-green-600" />,
      Finicity: <Server className="h-4 w-4 text-purple-600" />,
      MX: <Activity className="h-4 w-4 text-orange-600" />,
      TrueLayer: <Wifi className="h-4 w-4 text-indigo-600" />,
    };
    return (
      icons[provider as keyof typeof icons] || (
        <Server className="h-4 w-4 text-gray-600" />
      )
    );
  };

  const formatResponseTime = (ms: number) => {
    if (ms === 0) return "N/A";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatLastPing = (dateString: string) => {
    const now = new Date();
    const lastPing = new Date(dateString);
    const diffMs = now.getTime() - lastPing.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return lastPing.toLocaleDateString();
  };

  const getResponseTimeColor = (ms: number) => {
    if (ms === 0) return "text-gray-500";
    if (ms < 500) return "text-green-600";
    if (ms < 1000) return "text-amber-600";
    return "text-red-600";
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return "text-green-600";
    if (uptime >= 95) return "text-amber-600";
    return "text-red-600";
  };

  const filteredWebhooks = useMemo(() => {
    if (selectedProvider === "all") return data.webhooks;
    return data.webhooks.filter(
      (webhook) =>
        webhook.provider.toLowerCase() === selectedProvider.toLowerCase(),
    );
  }, [data.webhooks, selectedProvider]);

  const healthySummary = useMemo(() => {
    const total = data.webhooks.length;
    const healthy = data.webhooks.filter((w) => w.status === "healthy").length;
    const degraded = data.webhooks.filter(
      (w) => w.status === "degraded",
    ).length;
    const down = data.webhooks.filter((w) => w.status === "down").length;
    const maintenance = data.webhooks.filter(
      (w) => w.status === "maintenance",
    ).length;

    return { total, healthy, degraded, down, maintenance };
  }, [data.webhooks]);

  const avgResponseTime = useMemo(() => {
    const activeWebhooks = data.webhooks.filter(
      (w) => w.status !== "down" && w.status !== "maintenance",
    );
    if (activeWebhooks.length === 0) return 0;

    const total = activeWebhooks.reduce((sum, w) => sum + w.responseTime, 0);
    return Math.round(total / activeWebhooks.length);
  }, [data.webhooks]);

  const overallSuccessRate = useMemo(() => {
    const totalRequests = data.webhooks.reduce(
      (sum, w) => sum + w.totalRequests,
      0,
    );
    const totalFailed = data.webhooks.reduce(
      (sum, w) => sum + w.failedRequests,
      0,
    );

    if (totalRequests === 0) return 100;
    return ((totalRequests - totalFailed) / totalRequests) * 100;
  }, [data.webhooks]);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg font-semibold">
              Bill Sync Status
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {data.webhooks.length} webhooks
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

        {/* Overall Health Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                {healthySummary.healthy} Healthy
              </span>
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">
                {healthySummary.degraded} Degraded
              </span>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <WifiOff className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">
                {healthySummary.down} Down
              </span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Pause className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {healthySummary.maintenance} Maintenance
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Timer className="h-4 w-4 text-gray-600" />
              <span
                className={cn(
                  "text-lg font-bold",
                  getResponseTimeColor(avgResponseTime),
                )}
              >
                {formatResponseTime(avgResponseTime)}
              </span>
            </div>
            <p className="text-xs text-gray-500">Avg Response Time</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Activity className="h-4 w-4 text-gray-600" />
              <span className="text-lg font-bold text-green-600">
                {overallSuccessRate.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-gray-500">Success Rate</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-lg font-bold text-blue-600">
                {data.queueLength}
              </span>
            </div>
            <p className="text-xs text-gray-500">Queue Length</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8"
            >
              List
            </Button>
          </div>

          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger className="w-40 h-8">
              <SelectValue placeholder="Filter provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {Array.from(new Set(data.webhooks.map((w) => w.provider))).map(
                (provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Webhook Status Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWebhooks.map((webhook) => (
              <Card key={webhook.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getProviderIcon(webhook.provider)}
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">
                          {webhook.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {webhook.provider}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(webhook.status)}
                      {getStatusBadge(webhook.status)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Response Time</span>
                      <span
                        className={getResponseTimeColor(webhook.responseTime)}
                      >
                        {formatResponseTime(webhook.responseTime)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Success Rate</span>
                      <span
                        className={
                          webhook.successRate >= 95
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {webhook.successRate.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Uptime</span>
                      <span className={getUptimeColor(webhook.uptime)}>
                        {webhook.uptime.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Last Ping</span>
                      <span className="text-gray-900">
                        {formatLastPing(webhook.lastPing)}
                      </span>
                    </div>

                    {webhook.status !== "healthy" &&
                      webhook.errorMessages.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                          <p className="text-xs text-red-700 font-medium mb-1">
                            Latest Errors:
                          </p>
                          {webhook.errorMessages
                            .slice(0, 2)
                            .map((error, index) => (
                              <p key={index} className="text-xs text-red-600">
                                • {error}
                              </p>
                            ))}
                        </div>
                      )}
                  </div>

                  <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onWebhookAction?.(webhook.id, "test")
                            }
                            className="h-7 px-2"
                          >
                            <Zap className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Test webhook</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {webhook.status === "down" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onWebhookAction?.(webhook.id, "restart")
                              }
                              className="h-7 px-2"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Restart webhook</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    {webhook.status === "healthy" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onWebhookAction?.(webhook.id, "pause")
                              }
                              className="h-7 px-2"
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pause webhook</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredWebhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  {getProviderIcon(webhook.provider)}
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">
                      {webhook.name}
                    </h4>
                    <p className="text-xs text-gray-500">{webhook.provider}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-xs text-gray-600">
                    <span
                      className={getResponseTimeColor(webhook.responseTime)}
                    >
                      {formatResponseTime(webhook.responseTime)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span
                      className={
                        webhook.successRate >= 95
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {webhook.successRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatLastPing(webhook.lastPing)}
                  </div>
                  {getStatusBadge(webhook.status)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sync Statistics */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="font-medium text-sm text-gray-900 mb-3">
            Sync Statistics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">
                {data.totalSynced.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Synced</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-600">
                {data.syncErrors.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Sync Errors</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {data.syncFrequency.charAt(0).toUpperCase() +
                  data.syncFrequency.slice(1)}
              </p>
              <p className="text-xs text-gray-500">Frequency</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">
                {formatLastPing(data.lastSyncTime)}
              </p>
              <p className="text-xs text-gray-500">Last Sync</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
