import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Building,
  CreditCard,
  Zap,
  Calendar,
  DollarSign,
  Globe,
  Smartphone,
  Home,
  Car,
  Heart,
  GraduationCap,
  ShoppingCart,
  Gamepad2,
  FileText,
  Upload,
  Camera,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface BillerSuggestion {
  id: string;
  name: string;
  logo?: string;
  category: string;
  isPopular: boolean;
  description?: string;
}

interface BillFormData {
  billerName: string;
  amount: string;
  dueDate: string;
  category: string;
  accountNumber: string;
  description: string;
  isRecurring: boolean;
  autopayEnabled: boolean;
  reminderDays: number;
}

const categories = [
  { id: "utilities", label: "Utilities", icon: <Zap className="h-4 w-4" /> },
  { id: "internet", label: "Internet", icon: <Globe className="h-4 w-4" /> },
  { id: "mobile", label: "Mobile", icon: <Smartphone className="h-4 w-4" /> },
  { id: "housing", label: "Housing", icon: <Home className="h-4 w-4" /> },
  { id: "insurance", label: "Insurance", icon: <Car className="h-4 w-4" /> },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    id: "education",
    label: "Education",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: <Gamepad2 className="h-4 w-4" />,
  },
  {
    id: "credit-card",
    label: "Credit Card",
    icon: <CreditCard className="h-4 w-4" />,
  },
  { id: "other", label: "Other", icon: <FileText className="h-4 w-4" /> },
];

const popularBillers: BillerSuggestion[] = [
  {
    id: "pg-e",
    name: "Pacific Gas & Electric",
    category: "utilities",
    isPopular: true,
    description: "Electricity and gas utility",
  },
  {
    id: "comcast",
    name: "Comcast Xfinity",
    category: "internet",
    isPopular: true,
    description: "Internet and cable TV",
  },
  {
    id: "verizon",
    name: "Verizon",
    category: "mobile",
    isPopular: true,
    description: "Mobile phone service",
  },
  {
    id: "chase",
    name: "Chase Bank",
    category: "credit-card",
    isPopular: true,
    description: "Credit card payments",
  },
  {
    id: "netflix",
    name: "Netflix",
    category: "entertainment",
    isPopular: true,
    description: "Streaming service",
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "entertainment",
    isPopular: true,
    description: "Music streaming",
  },
];

/**
 * Add Bill page for creating new bill entries
 * Features biller search, category selection, and smart form inputs
 * Mobile-first responsive design with file upload support
 */
const AddBillPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBiller, setSelectedBiller] = useState<BillerSuggestion | null>(
    null,
  );

  const [formData, setFormData] = useState<BillFormData>({
    billerName: "",
    amount: "",
    dueDate: "",
    category: "",
    accountNumber: "",
    description: "",
    isRecurring: true,
    autopayEnabled: false,
    reminderDays: 3,
  });

  const handleInputChange = (
    field: keyof BillFormData,
    value: string | boolean | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBillerSelect = (biller: BillerSuggestion) => {
    setSelectedBiller(biller);
    handleInputChange("billerName", biller.name);
    handleInputChange("category", biller.category);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would process the bill image/PDF
      toast({
        title: "File uploaded",
        description: "We'll extract the bill details for you.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (
      !formData.billerName ||
      !formData.amount ||
      !formData.dueDate ||
      !formData.category
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Bill added successfully",
      description: `${formData.billerName} has been added to your bills.`,
    });

    setIsLoading(false);
    navigate("/dashboard");
  };

  const filteredBillers = popularBillers.filter(
    (biller) =>
      biller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biller.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.icon || <FileText className="h-4 w-4" />;
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.label || "Other";
  };

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
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Add New Bill</h1>
          <div className="w-10"></div>
        </div>
        <p className="text-navy-200">
          Set up a new bill to track and manage payments
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Upload Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors">
                <Upload className="h-6 w-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 text-center">
                  Upload Bill
                </span>
                <span className="text-xs text-gray-400">PDF, JPG, PNG</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
                onClick={() => {
                  toast({
                    title: "Camera feature",
                    description: "Camera scanning will be available soon!",
                  });
                }}
              >
                <Camera className="h-6 w-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 text-center">
                  Scan Bill
                </span>
                <span className="text-xs text-gray-400">Take a photo</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Biller Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Choose Your Biller
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for your biller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Popular Billers */}
            {searchTerm === "" && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Popular Billers
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {popularBillers.slice(0, 6).map((biller) => (
                    <button
                      key={biller.id}
                      onClick={() => handleBillerSelect(biller)}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg border transition-colors text-left",
                        selectedBiller?.id === biller.id
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={biller.logo} alt={biller.name} />
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                          {biller.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {biller.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {biller.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(biller.category)}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchTerm !== "" && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Search Results ({filteredBillers.length})
                </h4>
                {filteredBillers.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No billers found</p>
                    <p className="text-sm text-gray-500">
                      Try a different search term or add manually
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {filteredBillers.map((biller) => (
                      <button
                        key={biller.id}
                        onClick={() => handleBillerSelect(biller)}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border transition-colors text-left",
                          selectedBiller?.id === biller.id
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                        )}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={biller.logo} alt={biller.name} />
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                            {biller.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {biller.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {biller.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(biller.category)}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bill Details Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">
              Bill Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Biller Name */}
              <div className="space-y-2">
                <Label htmlFor="billerName">Biller Name *</Label>
                <Input
                  id="billerName"
                  value={formData.billerName}
                  onChange={(e) =>
                    handleInputChange("billerName", e.target.value)
                  }
                  placeholder="Enter biller name"
                  required
                />
              </div>

              {/* Amount and Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      placeholder="0.00"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        handleInputChange("dueDate", e.target.value)
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          {category.icon}
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  placeholder="Account number or reference"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Additional notes about this bill..."
                  rows={3}
                />
              </div>

              {/* Settings */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900">Bill Settings</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Recurring Bill</p>
                    <p className="text-sm text-gray-500">
                      This bill repeats monthly
                    </p>
                  </div>
                  <Switch
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) =>
                      handleInputChange("isRecurring", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Enable Autopay</p>
                    <p className="text-sm text-gray-500">
                      Automatically pay when due
                    </p>
                  </div>
                  <Switch
                    checked={formData.autopayEnabled}
                    onCheckedChange={(checked) =>
                      handleInputChange("autopayEnabled", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminderDays">
                    Reminder (days before due)
                  </Label>
                  <Select
                    value={formData.reminderDays.toString()}
                    onValueChange={(value) =>
                      handleInputChange("reminderDays", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="14">2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
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
                      <span>Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Bill</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default AddBillPage;
