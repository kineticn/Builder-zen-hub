import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Building,
  Users,
  UserCheck,
  Shield,
  Globe,
  Eye,
  EyeOff,
  MapPin,
  DollarSign,
  Save,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { tokens } from "@/design-tokens";

interface HouseholdFormData {
  name: string;
  description: string;
  type: "home" | "rental" | "parents" | "shared" | "office" | "other";
  address: string;
  isPrivate: boolean;
  autoApproveInvites: boolean;
  allowBillSharing: boolean;
  monthlyBudget: string;
  currency: string;
}

const householdTypes = [
  {
    id: "home",
    label: "Primary Home",
    description: "Your main residence",
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: "rental",
    label: "Rental Property",
    description: "Investment or rental property",
    icon: <Building className="h-5 w-5" />,
  },
  {
    id: "parents",
    label: "Family Home",
    description: "Parents' or family member's home",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "shared",
    label: "Shared Living",
    description: "Shared apartment or house",
    icon: <UserCheck className="h-5 w-5" />,
  },
  {
    id: "office",
    label: "Office Space",
    description: "Business or office property",
    icon: <Building className="h-5 w-5" />,
  },
  {
    id: "other",
    label: "Other",
    description: "Custom household type",
    icon: <MapPin className="h-5 w-5" />,
  },
];

/**
 * Create household page for setting up new household management
 * Includes property details, privacy settings, and member permissions
 * Mobile-first responsive design with comprehensive form validation
 */
const CreateHouseholdPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [formData, setFormData] = useState<HouseholdFormData>({
    name: "",
    description: "",
    type: "home",
    address: "",
    isPrivate: false,
    autoApproveInvites: true,
    allowBillSharing: true,
    monthlyBudget: "",
    currency: "USD",
  });

  const [errors, setErrors] = useState<Partial<HouseholdFormData>>({});

  const handleInputChange = (
    field: keyof HouseholdFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<HouseholdFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Household name is required";
    }

    if (!formData.type) {
      newErrors.type = "Please select a household type";
    }

    if (formData.monthlyBudget && isNaN(Number(formData.monthlyBudget))) {
      newErrors.monthlyBudget = "Please enter a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate invite code
      const inviteCode = `${formData.type.toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      toast({
        title: "Household created successfully!",
        description: `${formData.name} is ready. Invite code: ${inviteCode}`,
      });

      // Navigate back to household management
      navigate("/household/manage");
    } catch (error) {
      toast({
        title: "Error creating household",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedType = householdTypes.find((type) => type.id === formData.type);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div
        className="bg-gradient-to-r text-white p-6 pt-12"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.primary.navy[900]}, ${tokens.colors.primary.navy[800]})`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/household/manage")}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Create Household</h1>
          <div className="w-10"></div>
        </div>
        <p className="text-navy-200 text-sm">
          Set up a new household to manage bills and invite members
        </p>
      </div>

      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Household Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Johnson Family Home"
                  className={cn(errors.name && "border-red-500")}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description of this household..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
            </CardContent>
          </Card>

          {/* Household Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Household Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {householdTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange("type", type.id)}
                    className={cn(
                      "flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors text-left",
                      formData.type === type.id
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        formData.type === type.id
                          ? "bg-teal-100 text-teal-600"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {type.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        {type.label}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacy & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Private Household</p>
                  <p className="text-sm text-gray-500">
                    Only invited members can join
                  </p>
                </div>
                <Switch
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) =>
                    handleInputChange("isPrivate", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Auto-approve Invites
                  </p>
                  <p className="text-sm text-gray-500">
                    New members join automatically
                  </p>
                </div>
                <Switch
                  checked={formData.autoApproveInvites}
                  onCheckedChange={(checked) =>
                    handleInputChange("autoApproveInvites", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Allow Bill Sharing
                  </p>
                  <p className="text-sm text-gray-500">
                    Members can create shared bills
                  </p>
                </div>
                <Switch
                  checked={formData.allowBillSharing}
                  onCheckedChange={(checked) =>
                    handleInputChange("allowBillSharing", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Advanced Settings</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-teal-600"
                >
                  {showAdvanced ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {showAdvanced && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Monthly Budget</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="budget"
                        type="number"
                        step="0.01"
                        value={formData.monthlyBudget}
                        onChange={(e) =>
                          handleInputChange("monthlyBudget", e.target.value)
                        }
                        placeholder="0.00"
                        className={cn(
                          "pl-10",
                          errors.monthlyBudget && "border-red-500",
                        )}
                      />
                    </div>
                    {errors.monthlyBudget && (
                      <p className="text-red-600 text-sm">
                        {errors.monthlyBudget}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) =>
                        handleInputChange("currency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/household/manage")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Create Household</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default CreateHouseholdPage;
