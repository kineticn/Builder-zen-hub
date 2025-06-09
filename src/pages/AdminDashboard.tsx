import React, { useState, useEffect } from "react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Settings,
  Shield,
  Activity,
  Zap,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  Bell,
  BellOff,
} from "lucide-react";
import { ComplianceStatusCard } from "@/components/admin/ComplianceStatusCard";
import { RiskFlagTable } from "@/components/admin/RiskFlagTable";
import { BillSyncStatus } from "@/components/admin/BillSyncStatus";
import {
  mockComplianceData,
  mockRiskFlags,
  mockBillSyncData,
  mockAdminConfig,
} from "@/data/adminData";
import {
  ComplianceMetrics,
  RiskFlag,
  BillSyncMetrics,
  AdminConfiguration,
  AdminWidget,
} from "@/types/admin";
import { cn } from "@/lib/utils";
import { tokens } from "@/design-tokens";

interface ConfigurationPanelProps {
  config: AdminConfiguration;
  onConfigChange: (config: AdminConfiguration) => void;
  onClose: () => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  config,
  onConfigChange,
  onClose,
}) => {
  const [localConfig, setLocalConfig] = useState<AdminConfiguration>(config);

  const handleSave = () => {
    onConfigChange(localConfig);
    onClose();
  };

  const updateWidgetSetting = (
    widgetId: string,
    settingKey: string,
    value: any,
  ) => {
    setLocalConfig((prev) => ({
      ...prev,
      widgets: prev.widgets.map((widget) =>
        widget.id === widgetId
          ? { ...widget, settings: { ...widget.settings, [settingKey]: value } }
          : widget,
      ),
    }));
  };

  const updateWidgetRefreshInterval = (widgetId: string, interval: number) => {
    setLocalConfig((prev) => ({
      ...prev,
      widgets: prev.widgets.map((widget) =>
        widget.id === widgetId
          ? { ...widget, refreshInterval: interval }
          : widget,
      ),
    }));
  };

  const toggleWidgetAutoRefresh = (widgetId: string, autoRefresh: boolean) => {
    setLocalConfig((prev) => ({
      ...prev,
      widgets: prev.widgets.map((widget) =>
        widget.id === widgetId ? { ...widget, autoRefresh } : widget,
      ),
    }));
  };

  const updateThreshold = (category: string, type: string, value: number) => {
    setLocalConfig((prev) => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [category]: {
          ...prev.thresholds[category as keyof typeof prev.thresholds],
          [type]: value,
        },
      },
    }));
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Admin Dashboard Configuration</DialogTitle>
        <DialogDescription>
          Configure widgets, thresholds, and notifications for your admin
          dashboard. Changes are applied immediately and saved to your profile.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="widgets" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="widgets" className="space-y-4">
          <div className="space-y-6">
            {localConfig.widgets.map((widget) => (
              <Card key={widget.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base">{widget.title}</span>
                    <Badge
                      variant={widget.configurable ? "default" : "secondary"}
                    >
                      {widget.configurable ? "Configurable" : "Fixed"}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600">{widget.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Refresh Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`refresh-${widget.id}`}>
                        Refresh Interval (seconds)
                      </Label>
                      <Input
                        id={`refresh-${widget.id}`}
                        type="number"
                        value={widget.refreshInterval}
                        onChange={(e) =>
                          updateWidgetRefreshInterval(
                            widget.id,
                            parseInt(e.target.value),
                          )
                        }
                        min="30"
                        max="3600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`auto-refresh-${widget.id}`}>
                        Auto Refresh
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`auto-refresh-${widget.id}`}
                          checked={widget.autoRefresh}
                          onCheckedChange={(checked) =>
                            toggleWidgetAutoRefresh(widget.id, checked)
                          }
                        />
                        <span className="text-sm text-gray-600">
                          {widget.autoRefresh ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Widget-specific Settings */}
                  {widget.type === "compliance" && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium">Compliance Settings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Display Mode</Label>
                          <Select
                            value={widget.settings.displayMode}
                            onValueChange={(value) =>
                              updateWidgetSetting(
                                widget.id,
                                "displayMode",
                                value,
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="circular">
                                Circular Progress
                              </SelectItem>
                              <SelectItem value="linear">
                                Linear Progress
                              </SelectItem>
                              <SelectItem value="detailed">
                                Detailed View
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Alert Threshold (%)</Label>
                          <Input
                            type="number"
                            value={widget.settings.alertThreshold}
                            onChange={(e) =>
                              updateWidgetSetting(
                                widget.id,
                                "alertThreshold",
                                parseInt(e.target.value),
                              )
                            }
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={widget.settings.showTrends}
                          onCheckedChange={(checked) =>
                            updateWidgetSetting(
                              widget.id,
                              "showTrends",
                              checked,
                            )
                          }
                        />
                        <Label>Show Trend Analytics</Label>
                      </div>
                    </div>
                  )}

                  {widget.type === "risk" && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium">Risk Management Settings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Auto-assign Escalation Time (seconds)</Label>
                          <Input
                            type="number"
                            value={widget.settings.escalationTime}
                            onChange={(e) =>
                              updateWidgetSetting(
                                widget.id,
                                "escalationTime",
                                parseInt(e.target.value),
                              )
                            }
                            min="300"
                            max="86400"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={widget.settings.autoAssign}
                              onCheckedChange={(checked) =>
                                updateWidgetSetting(
                                  widget.id,
                                  "autoAssign",
                                  checked,
                                )
                              }
                            />
                            <Label>Auto-assign High Priority Flags</Label>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={widget.settings.showResolved}
                          onCheckedChange={(checked) =>
                            updateWidgetSetting(
                              widget.id,
                              "showResolved",
                              checked,
                            )
                          }
                        />
                        <Label>Show Resolved Flags</Label>
                      </div>
                    </div>
                  )}

                  {widget.type === "sync" && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium">Sync Monitoring Settings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Response Time Alert Threshold (ms)</Label>
                          <Input
                            type="number"
                            value={widget.settings.responseTimeThreshold}
                            onChange={(e) =>
                              updateWidgetSetting(
                                widget.id,
                                "responseTimeThreshold",
                                parseInt(e.target.value),
                              )
                            }
                            min="100"
                            max="10000"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={widget.settings.alertOnDowntime}
                              onCheckedChange={(checked) =>
                                updateWidgetSetting(
                                  widget.id,
                                  "alertOnDowntime",
                                  checked,
                                )
                              }
                            />
                            <Label>Alert on Downtime</Label>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={widget.settings.showMaintenanceMode}
                          onCheckedChange={(checked) =>
                            updateWidgetSetting(
                              widget.id,
                              "showMaintenanceMode",
                              checked,
                            )
                          }
                        />
                        <Label>Show Maintenance Mode Webhooks</Label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Grid Layout</Label>
                <Select
                  value={localConfig.layout.grid}
                  onValueChange={(value) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      layout: { ...prev.layout, grid: value as any },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2x2">2x2 Grid</SelectItem>
                    <SelectItem value="3x1">3x1 Horizontal</SelectItem>
                    <SelectItem value="1x3">1x3 Vertical</SelectItem>
                    <SelectItem value="custom">Custom Layout</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Mobile Breakpoint (px)</Label>
                  <Input
                    type="number"
                    value={localConfig.layout.breakpoints.mobile}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({
                        ...prev,
                        layout: {
                          ...prev.layout,
                          breakpoints: {
                            ...prev.layout.breakpoints,
                            mobile: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tablet Breakpoint (px)</Label>
                  <Input
                    type="number"
                    value={localConfig.layout.breakpoints.tablet}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({
                        ...prev,
                        layout: {
                          ...prev.layout,
                          breakpoints: {
                            ...prev.layout.breakpoints,
                            tablet: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Desktop Breakpoint (px)</Label>
                  <Input
                    type="number"
                    value={localConfig.layout.breakpoints.desktop}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({
                        ...prev,
                        layout: {
                          ...prev.layout,
                          breakpoints: {
                            ...prev.layout.breakpoints,
                            desktop: parseInt(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Compliance Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Critical Threshold (%)</Label>
                  <Input
                    type="number"
                    value={localConfig.thresholds.compliance.critical}
                    onChange={(e) =>
                      updateThreshold(
                        "compliance",
                        "critical",
                        parseInt(e.target.value),
                      )
                    }
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Warning Threshold (%)</Label>
                  <Input
                    type="number"
                    value={localConfig.thresholds.compliance.warning}
                    onChange={(e) =>
                      updateThreshold(
                        "compliance",
                        "warning",
                        parseInt(e.target.value),
                      )
                    }
                    min="0"
                    max="100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Risk Thresholds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>High Risk Threshold (1-10)</Label>
                  <Input
                    type="number"
                    value={localConfig.thresholds.risk.high}
                    onChange={(e) =>
                      updateThreshold("risk", "high", parseInt(e.target.value))
                    }
                    min="1"
                    max="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Escalation Time (seconds)</Label>
                  <Input
                    type="number"
                    value={localConfig.thresholds.risk.escalation}
                    onChange={(e) =>
                      updateThreshold(
                        "risk",
                        "escalation",
                        parseInt(e.target.value),
                      )
                    }
                    min="300"
                    max="86400"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sync Thresholds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Downtime Alert (seconds)</Label>
                  <Input
                    type="number"
                    value={localConfig.thresholds.sync.downtime}
                    onChange={(e) =>
                      updateThreshold(
                        "sync",
                        "downtime",
                        parseInt(e.target.value),
                      )
                    }
                    min="60"
                    max="3600"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Error Rate Alert (%)</Label>
                  <Input
                    type="number"
                    value={localConfig.thresholds.sync.errorRate}
                    onChange={(e) =>
                      updateThreshold(
                        "sync",
                        "errorRate",
                        parseInt(e.target.value),
                      )
                    }
                    min="1"
                    max="50"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Receive email alerts for critical events
                    </p>
                  </div>
                  <Switch
                    checked={localConfig.notifications.email}
                    onCheckedChange={(checked) =>
                      setLocalConfig((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          email: checked,
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Browser Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Show browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={localConfig.notifications.browser}
                    onCheckedChange={(checked) =>
                      setLocalConfig((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          browser: checked,
                        },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Slack Integration</Label>
                    <p className="text-sm text-gray-600">
                      Send alerts to Slack channels
                    </p>
                  </div>
                  <Switch
                    checked={localConfig.notifications.slack}
                    onCheckedChange={(checked) =>
                      setLocalConfig((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          slack: checked,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setLocalConfig(mockAdminConfig)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

const AdminDashboard: React.FC = () => {
  const [complianceData, setComplianceData] =
    useState<ComplianceMetrics>(mockComplianceData);
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>(mockRiskFlags);
  const [syncData, setSyncData] = useState<BillSyncMetrics>(mockBillSyncData);
  const [adminConfig, setAdminConfig] =
    useState<AdminConfiguration>(mockAdminConfig);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh functionality
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    adminConfig.widgets.forEach((widget) => {
      if (widget.autoRefresh) {
        const interval = setInterval(() => {
          handleRefreshWidget(widget.type);
        }, widget.refreshInterval * 1000);
        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [adminConfig.widgets]);

  const handleRefreshWidget = async (type: "compliance" | "risk" | "sync") => {
    // In a real application, these would be API calls
    switch (type) {
      case "compliance":
        // Simulate API call
        setTimeout(() => {
          setComplianceData((prev) => ({
            ...prev,
            overall: {
              ...prev.overall,
              lastUpdated: new Date().toISOString(),
            },
          }));
        }, 500);
        break;
      case "risk":
        // Simulate API call for risk flags
        break;
      case "sync":
        // Simulate API call for sync data
        break;
    }
    setLastRefresh(new Date());
  };

  const handleRiskFlagAction = (flagId: string, status: RiskFlag["status"]) => {
    setRiskFlags((prev) =>
      prev.map((flag) =>
        flag.id === flagId
          ? {
              ...flag,
              status,
              resolvedAt:
                status === "resolved" ? new Date().toISOString() : undefined,
            }
          : flag,
      ),
    );
  };

  const handleWebhookAction = (
    webhookId: string,
    action: "restart" | "pause" | "test",
  ) => {
    setSyncData((prev) => ({
      ...prev,
      webhooks: prev.webhooks.map((webhook) =>
        webhook.id === webhookId
          ? {
              ...webhook,
              status:
                action === "restart"
                  ? "healthy"
                  : action === "pause"
                    ? "maintenance"
                    : webhook.status,
              lastPing: new Date().toISOString(),
            }
          : webhook,
      ),
    }));
  };

  const getLayoutClasses = () => {
    switch (adminConfig.layout.grid) {
      case "2x2":
        return "grid grid-cols-1 lg:grid-cols-2 gap-6";
      case "3x1":
        return "grid grid-cols-1 lg:grid-cols-3 gap-6";
      case "1x3":
        return "grid grid-cols-1 gap-6";
      default:
        return "grid grid-cols-1 lg:grid-cols-3 gap-6";
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 pb-20"
      style={{ opacity: 1, visibility: "visible" }}
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-6 pt-12"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.primary.navy[900]}, ${tokens.colors.primary.navy[800]})`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-navy-200 mt-1">
              System monitoring and configuration
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-navy-200">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Auto-refresh based on widget settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* TEST REPOSITORY PUSH BUTTON */}
            <Button
              onClick={() => {
                alert(
                  "🚀 REPOSITORY PUSH TEST SUCCESSFUL! 🚀\n\nIf you see this alert, the code change worked!\n\nNow check Builder.io for:\n- Push/Commit options\n- Git sync buttons\n- Repository management options",
                );
                console.log(
                  "Repository push test - code change detected at:",
                  new Date().toISOString(),
                );
              }}
              className="bg-red-600 hover:bg-red-700 text-white border-red-300 animate-pulse font-bold"
              size="sm"
            >
              🚀 TEST REPO PUSH 🚀
            </Button>

            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </DialogTrigger>
              <ConfigurationPanel
                config={adminConfig}
                onConfigChange={setAdminConfig}
                onClose={() => setIsConfigOpen(false)}
              />
            </Dialog>
          </div>
        </div>

        {/* Quick Status Indicators */}
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Shield className="h-5 w-5" />
              <span className="text-2xl font-bold">
                {complianceData.overall.percentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs opacity-80">Compliance Rate</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-2xl font-bold text-amber-400">
                {riskFlags.filter((f) => f.status === "active").length}
              </span>
            </div>
            <p className="text-xs opacity-80">Active Risk Flags</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Activity className="h-5 w-5" />
              <span className="text-2xl font-bold text-teal-400">
                {syncData.webhooks.filter((w) => w.status === "healthy").length}
                /{syncData.webhooks.length}
              </span>
            </div>
            <p className="text-xs opacity-80">Healthy Webhooks</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Widget Grid */}
        <div className={getLayoutClasses()}>
          {/* Compliance Status Widget */}
          <div
            className={adminConfig.layout.grid === "1x3" ? "lg:col-span-1" : ""}
          >
            <ComplianceStatusCard
              data={complianceData}
              refreshInterval={
                adminConfig.widgets.find((w) => w.type === "compliance")
                  ?.refreshInterval
              }
              onRefresh={() => handleRefreshWidget("compliance")}
              onConfigure={() => setIsConfigOpen(true)}
              configurable={
                adminConfig.widgets.find((w) => w.type === "compliance")
                  ?.configurable
              }
              className="h-full"
            />
          </div>

          {/* Bill Sync Status Widget */}
          <div
            className={adminConfig.layout.grid === "1x3" ? "lg:col-span-1" : ""}
          >
            <BillSyncStatus
              data={syncData}
              onRefresh={() => handleRefreshWidget("sync")}
              onConfigure={() => setIsConfigOpen(true)}
              onWebhookAction={handleWebhookAction}
              configurable={
                adminConfig.widgets.find((w) => w.type === "sync")?.configurable
              }
              className="h-full"
            />
          </div>

          {/* Risk Flag Table Widget */}
          <div
            className={
              adminConfig.layout.grid === "2x2"
                ? "lg:col-span-2"
                : adminConfig.layout.grid === "1x3"
                  ? "lg:col-span-1"
                  : ""
            }
          >
            <RiskFlagTable
              data={riskFlags}
              onUpdateStatus={handleRiskFlagAction}
              onRefresh={() => handleRefreshWidget("risk")}
              onConfigure={() => setIsConfigOpen(true)}
              configurable={
                adminConfig.widgets.find((w) => w.type === "risk")?.configurable
              }
              className="h-full"
            />
          </div>
        </div>

        {/* Affiliate Management Section */}
        <div className="mt-6">
          <AffiliateManagementCard
            onSave={(data) => {
              console.log("Affiliate settings saved:", data);
              toast({
                title: "Affiliate settings saved",
                description:
                  "Your affiliate configuration has been updated successfully.",
              });
            }}
          />
        </div>

        {/* Additional System Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-lg font-semibold">8,549</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">API Requests</p>
                  <p className="text-lg font-semibold">125.4K</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-lg font-semibold">142ms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">System Health</p>
                  <p className="text-lg font-semibold">98.2%</p>
                </div>
              </div>
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
