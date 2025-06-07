import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Zap,
  Camera,
  Edit,
  Bell,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Brain,
  Target,
  Gift,
  ArrowRight,
  Sparkles,
  Clock,
  CreditCard,
  ChevronDown,
  Home,
  Building,
  Users,
  UserCheck,
  CalendarDays,
  BarChart3,
  Share2,
  Star,
  Shield,
  Globe,
  PiggyBank,
  Lightbulb,
  X,
  List,
  Timeline,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Mail,
  FileText,
  Settings,
} from "lucide-react";
import { BillTile } from "@/components/BillTile";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { BottomNavBar } from "@/components/BottomNavBar";
import {
  LoadingScreen,
  PageSkeleton,
  BillTileSkeleton,
} from "@/components/ui/loading-skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { tokens } from "@/design-tokens";

interface Bill {
  id: string;
  billerName: string;
  billerLogo?: string;
  amount: number;
  dueDate: string;
  status: "upcoming" | "due-soon" | "overdue" | "paid";
  category?: string;
  isRecurring?: boolean;
  predictedAmount?: number;
  householdId?: string;
}

interface Insight {
  id: string;
  type: "saving" | "warning" | "optimization" | "achievement";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  priority: "high" | "medium" | "low";
  dismissed?: boolean;
}

interface SpendingPattern {
  category: string;
  amount: number;
  trend: "up" | "down" | "stable";
  percentage: number;
  color: string;
}

interface HouseholdContext {
  id: string;
  name: string;
  type: "home" | "rental" | "parents" | "shared";
  icon: React.ReactNode;
  role: "owner" | "editor" | "viewer";
  totalMonthlyOutflow: number;
  upcomingJointBills: number;
}

interface SmartSuggestion {
  id: string;
  type: "recurring_payee" | "email_bill" | "subscription";
  name: string;
  amount?: number;
  confidence: number;
  source: "plaid" | "gmail" | "pattern";
  lastSeen: string;
  category?: string;
  estimatedDueDate?: string;
  description?: string;
}

interface ReferralBanner {
  id: string;
  show: boolean;
  message: string;
  ctaText: string;
  reward: string;
}

interface CalendarDay {
  date: Date;
  bills: Bill[];
  isCurrentMonth: boolean;
  isToday: boolean;
  totalAmount: number;
}

interface CashFlowDay {
  date: Date;
  inflow: number;
  outflow: number;
  netFlow: number;
  bills: Bill[];
}

const mockBills: Bill[] = [
  {
    id: "1",
    billerName: "Electric Company",
    amount: 125.5,
    dueDate: "2024-03-15",
    status: "due-soon",
    category: "Utilities",
    isRecurring: true,
    predictedAmount: 118.75,
    householdId: "home",
  },
  {
    id: "2",
    billerName: "Internet Provider",
    amount: 79.99,
    dueDate: "2024-03-18",
    status: "upcoming",
    category: "Internet",
    isRecurring: true,
    householdId: "home",
  },
  {
    id: "3",
    billerName: "Credit Card",
    amount: 450.0,
    dueDate: "2024-03-12",
    status: "overdue",
    category: "Credit Card",
    householdId: "home",
  },
  {
    id: "4",
    billerName: "Phone Bill",
    amount: 65.0,
    dueDate: "2024-03-20",
    status: "paid",
    category: "Mobile",
    isRecurring: true,
    householdId: "home",
  },
  {
    id: "5",
    billerName: "Streaming Service",
    amount: 15.99,
    dueDate: "2024-03-25",
    status: "upcoming",
    category: "Entertainment",
    isRecurring: true,
    householdId: "home",
  },
  {
    id: "6",
    billerName: "Rent",
    amount: 1200.0,
    dueDate: "2024-03-01",
    status: "paid",
    category: "Housing",
    isRecurring: true,
    householdId: "home",
  },
  {
    id: "7",
    billerName: "Water & Sewer",
    amount: 89.5,
    dueDate: "2024-03-22",
    status: "upcoming",
    category: "Utilities",
    isRecurring: true,
    householdId: "home",
  },
  {
    id: "8",
    billerName: "Car Insurance",
    amount: 234.0,
    dueDate: "2024-03-28",
    status: "upcoming",
    category: "Insurance",
    isRecurring: true,
    householdId: "home",
  },
];

const mockHouseholds: HouseholdContext[] = [
  {
    id: "home",
    name: "Primary Home",
    type: "home",
    icon: <Home className="h-4 w-4" />,
    role: "owner",
    totalMonthlyOutflow: 2260.48,
    upcomingJointBills: 4,
  },
  {
    id: "rental",
    name: "Rental Property",
    type: "rental",
    icon: <Building className="h-4 w-4" />,
    role: "owner",
    totalMonthlyOutflow: 890.0,
    upcomingJointBills: 2,
  },
  {
    id: "parents",
    name: "Parents' House",
    type: "parents",
    icon: <Users className="h-4 w-4" />,
    role: "editor",
    totalMonthlyOutflow: 1540.25,
    upcomingJointBills: 3,
  },
  {
    id: "shared",
    name: "Shared Apartment",
    type: "shared",
    icon: <UserCheck className="h-4 w-4" />,
    role: "viewer",
    totalMonthlyOutflow: 675.33,
    upcomingJointBills: 1,
  },
];

const mockSmartSuggestions: SmartSuggestion[] = [
  {
    id: "sug1",
    type: "recurring_payee",
    name: "Netflix",
    amount: 15.99,
    confidence: 0.95,
    source: "plaid",
    lastSeen: "2024-03-01",
    category: "Entertainment",
    estimatedDueDate: "2024-03-15",
    description: "Recurring monthly charge detected",
  },
  {
    id: "sug2",
    type: "email_bill",
    name: "Gym Membership",
    amount: 29.99,
    confidence: 0.87,
    source: "gmail",
    lastSeen: "2024-03-03",
    category: "Health & Fitness",
    estimatedDueDate: "2024-03-18",
    description: "Bill found in your Gmail",
  },
  {
    id: "sug3",
    type: "subscription",
    name: "Adobe Creative Cloud",
    amount: 52.99,
    confidence: 0.92,
    source: "pattern",
    lastSeen: "2024-03-05",
    category: "Software",
    estimatedDueDate: "2024-03-20",
    description: "Software subscription identified from spending pattern",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdContext>(
    mockHouseholds[0],
  );
  const [currentView, setCurrentView] = useState<
    "list" | "calendar" | "cashflow"
  >("list");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cashflowDate, setCashflowDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [smartSuggestions, setSmartSuggestions] =
    useState<SmartSuggestion[]>(mockSmartSuggestions);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Filter bills by selected household
  const filteredBills = bills.filter(
    (bill) => bill.householdId === selectedHousehold.id,
  );

  // Calendar generation
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dayBills = filteredBills.filter((bill) => {
        const billDate = new Date(bill.dueDate);
        return billDate.toDateString() === current.toDateString();
      });

      days.push({
        date: new Date(current),
        bills: dayBills,
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        totalAmount: dayBills.reduce((sum, bill) => sum + bill.amount, 0),
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // Cash flow timeline generation
  const generateCashFlowDays = (): CashFlowDay[] => {
    const days: CashFlowDay[] = [];
    const start = new Date(cashflowDate);

    for (let i = 0; i < 7; i++) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);

      const dayBills = filteredBills.filter((bill) => {
        const billDate = new Date(bill.dueDate);
        return billDate.toDateString() === current.toDateString();
      });

      const outflow = dayBills.reduce((sum, bill) => sum + bill.amount, 0);
      const inflow = 0; // Would come from income data

      days.push({
        date: current,
        inflow,
        outflow,
        netFlow: inflow - outflow,
        bills: dayBills,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const cashflowDays = generateCashFlowDays();

  // Navigation handlers
  const navigateCalendar = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateCashflow = (direction: "prev" | "next") => {
    const newDate = new Date(cashflowDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCashflowDate(newDate);
  };

  const getStatusColor = (status: Bill["status"]) => {
    switch (status) {
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200";
      case "due-soon":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "upcoming":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleConfirmSuggestion = (suggestion: SmartSuggestion) => {
    const newBill: Bill = {
      id: `bill_${Date.now()}`,
      billerName: suggestion.name,
      amount: suggestion.amount || 0,
      dueDate:
        suggestion.estimatedDueDate ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      status: "upcoming",
      category: suggestion.category || "Other",
      isRecurring: true,
      householdId: selectedHousehold.id,
    };

    setBills((prev) => [...prev, newBill]);
    setSmartSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
    setShowSuccessToast(`${suggestion.name} added to your bills!`);

    // Auto-hide success toast
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setSmartSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
  };

  const getSourceIcon = (source: SmartSuggestion["source"]) => {
    switch (source) {
      case "plaid":
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case "gmail":
        return <Mail className="h-4 w-4 text-red-600" />;
      case "pattern":
        return <Brain className="h-4 w-4 text-purple-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-amber-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600 bg-green-100";
    if (confidence >= 0.8) return "text-amber-600 bg-amber-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div
      className="min-h-screen bg-gray-50 pb-20"
      style={{ opacity: 1, visibility: "visible" }}
    >
      {/* Success Toast */}
      {showSuccessToast && (
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -50 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? {} : { opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>{showSuccessToast}</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div
        className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-6 pt-12"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.primary.navy[900]}, ${tokens.colors.primary.navy[800]})`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm opacity-80">Welcome back,</p>
              <h1 className="text-lg sm:text-xl font-bold truncate">Sarah</h1>
            </div>
          </div>

          {/* Household Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-white border-white/20 hover:bg-white/10 min-h-[44px] px-3 sm:px-4"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  {selectedHousehold.icon}
                  <span className="truncate text-xs sm:text-sm">
                    {selectedHousehold.name}
                  </span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {mockHouseholds.map((household) => (
                <DropdownMenuItem
                  key={household.id}
                  onClick={() => setSelectedHousehold(household)}
                  className="flex items-center justify-between p-3"
                >
                  <div className="flex items-center space-x-3">
                    {household.icon}
                    <div>
                      <p className="font-medium">{household.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {household.role} •{" "}
                        {formatCurrency(household.totalMonthlyOutflow)}/mo
                      </p>
                    </div>
                  </div>
                  {selectedHousehold.id === household.id && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </DropdownMenuItem>
              ))}
              <div className="border-t border-gray-200 mt-1 pt-1">
                <DropdownMenuItem
                  onClick={() => navigate("/household/manage")}
                  className="flex items-center space-x-3 p-3 text-teal-600"
                >
                  <Settings className="h-4 w-4" />
                  <span>Manage Households</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold">
              {filteredBills.filter((b) => b.status !== "paid").length}
            </p>
            <p className="text-xs sm:text-sm opacity-80">Active Bills</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-teal-400">
              {formatCurrency(
                filteredBills.reduce((sum, bill) => sum + bill.amount, 0),
              )}
            </p>
            <p className="text-xs sm:text-sm opacity-80">Total Amount</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-amber-400">
              {filteredBills.filter((b) => b.status === "overdue").length}
            </p>
            <p className="text-xs sm:text-sm opacity-80">Overdue</p>
          </div>
        </div>
      </div>

      <div className="p-6 pb-24">
        {/* Smart Suggestions */}
        {smartSuggestions.length > 0 && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4 mb-6"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Smart Suggestions</h3>
              <Badge variant="secondary" className="text-xs">
                AI-powered
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              We found {smartSuggestions.length} potential bills based on your
              spending patterns and emails.
            </p>
            <div className="space-y-3">
              {smartSuggestions.slice(0, 3).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getSourceIcon(suggestion.source)}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {suggestion.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                          >
                            {Math.round(suggestion.confidence * 100)}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {suggestion.description}
                        </p>
                        {suggestion.amount && (
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {formatCurrency(suggestion.amount)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismissSuggestion(suggestion.id)}
                        className="min-h-[36px] min-w-[36px] p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleConfirmSuggestion(suggestion)}
                        className="bg-blue-600 hover:bg-blue-700 min-h-[36px]"
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Overdue Bills Alert */}
        {filteredBills.filter((b) => b.status === "overdue").length > 0 && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">
                    Attention Required
                  </h3>
                  <p className="text-sm text-red-700">
                    {filteredBills.filter((b) => b.status === "overdue").length}{" "}
                    bills need immediate attention
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  const overdueBills = filteredBills.filter(
                    (b) => b.status === "overdue",
                  );
                  if (overdueBills.length === 1) {
                    navigate(`/bill/${overdueBills[0].id}`);
                  } else {
                    // Navigate to a filtered view of overdue bills
                    alert(
                      `You have ${overdueBills.length} overdue bills:\n\n${overdueBills.map((b) => `• ${b.billerName}: ${formatCurrency(b.amount)}`).join("\n")}\n\nClick on individual bills to pay them.`,
                    );
                  }
                }}
              >
                Pay Now
              </Button>
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <Tabs
          value={currentView}
          onValueChange={(value) => setCurrentView(value as any)}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="flex items-center space-x-2"
            >
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger
              value="cashflow"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Cash Flow</span>
            </TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list" className="space-y-6">
            {/* Bills Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Bills Overview
                </h2>
                {filteredBills.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {filteredBills.filter((b) => b.status !== "paid").length}{" "}
                    active
                  </Badge>
                )}
              </div>
              <Button
                onClick={() => navigate("/add-bill")}
                className="bg-teal-400 hover:bg-teal-500 text-navy-900 min-h-[44px]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Bill
              </Button>
            </div>

            {/* Bills List */}
            <div className="space-y-3">
              {filteredBills.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No bills yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your first bill to get started with BillBuddy
                  </p>
                  <Button
                    onClick={() => navigate("/add-bill")}
                    className="bg-teal-400 hover:bg-teal-500 text-navy-900"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Bill
                  </Button>
                </div>
              ) : (
                filteredBills.map((bill) => (
                  <BillTile
                    key={bill.id}
                    bill={bill}
                    onClick={() => navigate(`/bill/${bill.id}`)}
                  />
                ))
              )}
            </div>

            {/* Bill Categories Summary */}
            {filteredBills.length > 0 && (
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4">
                  Monthly Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(
                    filteredBills
                      .filter((b) => b.status !== "paid")
                      .reduce(
                        (acc, bill) => {
                          const category = bill.category || "Other";
                          acc[category] = (acc[category] || 0) + bill.amount;
                          return acc;
                        },
                        {} as Record<string, number>,
                      ),
                  ).map(([category, amount]) => (
                    <div key={category} className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(amount)}
                      </p>
                      <p className="text-sm text-gray-600">{category}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCalendar("prev")}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                  className="min-h-[44px] px-4"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCalendar("next")}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[100px] p-2 border-b border-r border-gray-200",
                      !day.isCurrentMonth && "bg-gray-50",
                      day.isToday && "bg-blue-50",
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          !day.isCurrentMonth && "text-gray-400",
                          day.isToday && "text-blue-600",
                        )}
                      >
                        {day.date.getDate()}
                      </span>
                      {day.bills.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {formatCurrency(day.totalAmount)}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {day.bills.slice(0, 2).map((bill) => (
                        <div
                          key={bill.id}
                          className={cn(
                            "text-xs p-1 rounded truncate border",
                            getStatusColor(bill.status),
                          )}
                        >
                          {bill.billerName}
                        </div>
                      ))}
                      {day.bills.length > 2 && (
                        <div className="text-xs text-gray-500 p-1">
                          +{day.bills.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Cash Flow View */}
          <TabsContent value="cashflow" className="space-y-6">
            {/* Cash Flow Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Cash Flow Timeline
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCashflow("prev")}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 px-4">
                  {formatDate(cashflowDate)} -{" "}
                  {formatDate(
                    new Date(cashflowDate.getTime() + 6 * 24 * 60 * 60 * 1000),
                  )}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCashflow("next")}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Cash Flow Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Outflow</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(
                          cashflowDays.reduce(
                            (sum, day) => sum + day.outflow,
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
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Peak Day</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(
                          Math.max(...cashflowDays.map((d) => d.outflow)),
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-gray-600">Bills Due</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {cashflowDays.reduce(
                          (sum, day) => sum + day.bills.length,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cash Flow Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                7-Day Overview
              </h3>
              <div className="space-y-4">
                {cashflowDays.map((day, index) => {
                  const maxAmount = Math.max(
                    ...cashflowDays.map((d) => d.outflow),
                  );
                  const percentage =
                    maxAmount > 0 ? (day.outflow / maxAmount) * 100 : 0;

                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 text-sm text-gray-600">
                        {formatDate(day.date)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(day.outflow)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {day.bills.length} bills
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => navigate("/add-bill")}
        aria-label="Add new bill"
      />

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default Dashboard;
