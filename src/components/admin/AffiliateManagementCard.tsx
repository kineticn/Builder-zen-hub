import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Link,
  Tag,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Globe,
  CreditCard,
  Building,
  PiggyBank,
  Smartphone,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  tag: string;
  category: string;
  isActive: boolean;
  clickCount: number;
  conversionRate: number;
  lastUpdated: string;
}

interface AffiliateSettings {
  globalTag: string;
  defaultCommission: string;
  trackingEnabled: boolean;
  autoRedirect: boolean;
  customDomain: string;
  analyticsId: string;
  links: AffiliateLink[];
}

interface AffiliateManagementCardProps {
  onSave: (data: AffiliateSettings) => void;
  className?: string;
}

const defaultSettings: AffiliateSettings = {
  globalTag: "billbuddy-123",
  defaultCommission: "5.0",
  trackingEnabled: true,
  autoRedirect: true,
  customDomain: "",
  analyticsId: "",
  links: [
    {
      id: "1",
      name: "Chase Freedom Unlimited",
      url: "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
      tag: "billbuddy-chase-freedom",
      category: "Credit Cards",
      isActive: true,
      clickCount: 1247,
      conversionRate: 12.3,
      lastUpdated: "2024-12-15",
    },
    {
      id: "2",
      name: "Capital One Venture",
      url: "https://www.capitalone.com/credit-cards/venture/",
      tag: "billbuddy-venture",
      category: "Credit Cards",
      isActive: true,
      clickCount: 892,
      conversionRate: 8.7,
      lastUpdated: "2024-12-14",
    },
    {
      id: "3",
      name: "Marcus by Goldman Sachs Savings",
      url: "https://www.marcus.com/us/en/savings/high-yield-online-savings-account",
      tag: "billbuddy-marcus",
      category: "Banking",
      isActive: false,
      clickCount: 456,
      conversionRate: 15.2,
      lastUpdated: "2024-12-10",
    },
  ],
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Credit Cards": <CreditCard className="h-4 w-4" />,
  Banking: <Building className="h-4 w-4" />,
  Insurance: <Shield className="h-4 w-4" />,
  Cashback: <PiggyBank className="h-4 w-4" />,
  "Bill Pay": <Smartphone className="h-4 w-4" />,
  Other: <Globe className="h-4 w-4" />,
};

/**
 * Affiliate management component for configuring affiliate links and tracking
 * Allows admins to manage affiliate programs, track performance, and configure settings
 * Mobile-first responsive design with comprehensive link management
 */
export const AffiliateManagementCard: React.FC<
  AffiliateManagementCardProps
> = ({ onSave, className }) => {
  const [settings, setSettings] = useState<AffiliateSettings>(defaultSettings);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof AffiliateSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleLinkUpdate = (
    linkId: string,
    updates: Partial<AffiliateLink>,
  ) => {
    setSettings((prev) => ({
      ...prev,
      links: prev.links.map((link) =>
        link.id === linkId
          ? {
              ...link,
              ...updates,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : link,
      ),
    }));
    setHasChanges(true);
    setIsEditing(null);
  };

  const handleAddLink = () => {
    const newLink: AffiliateLink = {
      id: Date.now().toString(),
      name: "New Affiliate Link",
      url: "",
      tag: settings.globalTag + "-new",
      category: "Other",
      isActive: false,
      clickCount: 0,
      conversionRate: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setSettings((prev) => ({
      ...prev,
      links: [...prev.links, newLink],
    }));
    setIsEditing(newLink.id);
    setHasChanges(true);
  };

  const handleDeleteLink = (linkId: string) => {
    setSettings((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== linkId),
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
    setIsEditing(null);
  };

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    // Note: In real implementation, would show toast
    console.log(`Copied ${description}: ${text}`);
  };

  const generateAffiliateUrl = (baseUrl: string, tag: string) => {
    if (!baseUrl) return "";
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}ref=${tag}`;
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Affiliate Management</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Configure affiliate links and tracking for the offers page
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="links">Affiliate Links</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="globalTag">Global Affiliate Tag</Label>
                <div className="flex space-x-2">
                  <Input
                    id="globalTag"
                    value={settings.globalTag}
                    onChange={(e) =>
                      handleSettingChange("globalTag", e.target.value)
                    }
                    placeholder="your-affiliate-tag"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(settings.globalTag, "Global Tag")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Used as default tag for new affiliate links
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission">Default Commission (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  step="0.1"
                  value={settings.defaultCommission}
                  onChange={(e) =>
                    handleSettingChange("defaultCommission", e.target.value)
                  }
                  placeholder="5.0"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Enable Click Tracking
                  </p>
                  <p className="text-sm text-gray-500">
                    Track clicks and conversions
                  </p>
                </div>
                <Switch
                  checked={settings.trackingEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange("trackingEnabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto-redirect</p>
                  <p className="text-sm text-gray-500">
                    Automatically redirect to affiliate links
                  </p>
                </div>
                <Switch
                  checked={settings.autoRedirect}
                  onCheckedChange={(checked) =>
                    handleSettingChange("autoRedirect", checked)
                  }
                />
              </div>
            </div>

            {showAdvanced && (
              <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-gray-900">Advanced Settings</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customDomain">
                      Custom Domain (Optional)
                    </Label>
                    <Input
                      id="customDomain"
                      value={settings.customDomain}
                      onChange={(e) =>
                        handleSettingChange("customDomain", e.target.value)
                      }
                      placeholder="your-domain.com"
                    />
                    <p className="text-xs text-gray-500">
                      Use your own domain for affiliate links
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="analyticsId">Google Analytics ID</Label>
                    <Input
                      id="analyticsId"
                      value={settings.analyticsId}
                      onChange={(e) =>
                        handleSettingChange("analyticsId", e.target.value)
                      }
                      placeholder="GA-XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Affiliate Links Tab */}
          <TabsContent value="links" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Manage Affiliate Links</h3>
              <Button
                onClick={handleAddLink}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            <div className="space-y-3">
              {settings.links.map((link) => (
                <Card
                  key={link.id}
                  className={cn("p-4", !link.isActive && "opacity-60")}
                >
                  {isEditing === link.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={link.name}
                            onChange={(e) =>
                              handleLinkUpdate(link.id, {
                                name: e.target.value,
                              })
                            }
                            placeholder="Affiliate link name"
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select
                            value={link.category}
                            onValueChange={(value) =>
                              handleLinkUpdate(link.id, { category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(categoryIcons).map((category) => (
                                <SelectItem key={category} value={category}>
                                  <div className="flex items-center space-x-2">
                                    {categoryIcons[category]}
                                    <span>{category}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Base URL</Label>
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            handleLinkUpdate(link.id, { url: e.target.value })
                          }
                          placeholder="https://example.com/product"
                        />
                      </div>

                      <div>
                        <Label>Affiliate Tag</Label>
                        <Input
                          value={link.tag}
                          onChange={(e) =>
                            handleLinkUpdate(link.id, { tag: e.target.value })
                          }
                          placeholder="your-affiliate-tag"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={link.isActive}
                            onCheckedChange={(checked) =>
                              handleLinkUpdate(link.id, { isActive: checked })
                            }
                          />
                          <span className="text-sm">Active</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setIsEditing(null)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                          {categoryIcons[link.category] || (
                            <Globe className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {link.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className={cn(
                                link.isActive
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200",
                              )}
                            >
                              {link.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {generateAffiliateUrl(link.url, link.tag)}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{formatNumber(link.clickCount)} clicks</span>
                            <span>
                              {formatPercentage(link.conversionRate)} conversion
                            </span>
                            <span>Updated {link.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              generateAffiliateUrl(link.url, link.tag),
                              "Affiliate URL",
                            )
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              generateAffiliateUrl(link.url, link.tag),
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(link.id)}
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLink(link.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {settings.links.length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No affiliate links yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your first affiliate link to start monetizing the offers
                    page
                  </p>
                  <Button
                    onClick={handleAddLink}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Link
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <h3 className="text-lg font-medium">Performance Analytics</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Link className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Clicks</p>
                      <p className="text-lg font-semibold">
                        {formatNumber(
                          settings.links.reduce(
                            (sum, link) => sum + link.clickCount,
                            0,
                          ),
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Avg Conversion</p>
                      <p className="text-lg font-semibold">
                        {formatPercentage(
                          settings.links.reduce(
                            (sum, link) => sum + link.conversionRate,
                            0,
                          ) / settings.links.length || 0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Active Links</p>
                      <p className="text-lg font-semibold">
                        {settings.links.filter((link) => link.isActive).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Top Performing Links</h4>
              {settings.links
                .sort((a, b) => b.clickCount - a.clickCount)
                .slice(0, 5)
                .map((link, index) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-bold text-gray-500">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{link.name}</p>
                        <p className="text-sm text-gray-500">{link.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatNumber(link.clickCount)} clicks
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPercentage(link.conversionRate)} conversion
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Changes
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
