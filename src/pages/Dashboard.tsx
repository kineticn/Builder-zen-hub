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
    totalMonthlyOutflow: 1200.5,
    upcomingJointBills: 4,
  },
  {
    id: "rental",
    name: "Rental Property",
    type: "rental",
    icon: <Building className="h-4 w-4" />,
    role: "editor",
    totalMonthlyOutflow: 850.0,
    upcomingJointBills: 2,
  },
  {
    id: "shared",
    name: "Shared Apartment",
    type: "shared",
    icon: <Users className="h-4 w-4" />,
    role: "editor",
    totalMonthlyOutflow: 650.0,
    upcomingJointBills: 3,
  },
];

const mockSmartSuggestions: SmartSuggestion[] = [
  {
    id: "sug1",
    type: "email_bill",
    name: "Netflix Premium",
    amount: 15.99,
    confidence: 0.95,
    source: "gmail",
    lastSeen: "2024-03-10",
    category: "Entertainment",
    estimatedDueDate: "2024-03-15",
    description: "Detected from billing email - monthly subscription",
  },
  {
    id: "sug2",
    type: "recurring_payee",
    name: "Gym Membership",
    amount: 45.0,
    confidence: 0.88,
    source: "plaid",
    lastSeen: "2024-03-08",
    category: "Health & Fitness",
    estimatedDueDate: "2024-03-12",
    description: "Recurring transaction pattern detected",
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

  // Smart suggestion handlers
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
      {/* Header */}
      <div
        className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-6 pt-12"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.primary.navy[900]}, ${tokens.colors.primary.navy[800]})`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">Welcome back,</p>
              <h1 className="text-xl font-bold">Sarah</h1>
            </div>
          </div>

          {/* Household Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 space-x-2"
              >
                {selectedHousehold.icon}
                <span className="hidden sm:inline">
                  {selectedHousehold.name}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {mockHouseholds.map((household) => (
                <DropdownMenuItem
                  key={household.id}
                  onClick={() => setSelectedHousehold(household)}
                  className={cn(
                    "flex items-center space-x-3 p-3",
                    selectedHousehold.id === household.id && "bg-teal-50",
                  )}
                >
                  {household.icon}
                  <div className="flex-1">
                    <div className="font-medium">{household.name}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {household.role} • {household.upcomingJointBills} bills
                    </div>
                  </div>
                  {selectedHousehold.id === household.id && (
                    <CheckCircle className="h-4 w-4 text-teal-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Stats */}
        <div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
          style={{
            background: tokens.colors.opacity.glass,
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-80">Monthly Outflow</p>
              <p className="text-2xl font-bold">
                {formatCurrency(selectedHousehold.totalMonthlyOutflow)}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-80">Upcoming Bills</p>
              <p className="text-2xl font-bold">
                {selectedHousehold.upcomingJointBills}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6">
          <Tabs
            value={currentView}
            onValueChange={(value) => setCurrentView(value as any)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 h-12">
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
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 pb-24" style={{ opacity: 1, visibility: "visible" }}>
        {/* List View */}
        {currentView === "list" && (
          <div className="space-y-6">
            {/* Smart Suggestions Card */}
            <AnimatePresence>
              {smartSuggestions.length > 0 && (
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  exit={
                    shouldReduceMotion ? {} : { opacity: 0, y: -20, height: 0 }
                  }
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Smart Bill Discovery
                        </h3>
                        <p className="text-sm text-gray-600">
                          AI found {smartSuggestions.length} potential bills
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      AI Powered
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {smartSuggestions.slice(0, 3).map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        initial={
                          shouldReduceMotion ? {} : { opacity: 0, x: -20 }
                        }
                        animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                        exit={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="flex items-center space-x-2">
                              {getSourceIcon(suggestion.source)}
                              <div className="w-2 h-2 bg-green-400 rounded-full" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">
                                  {suggestion.name}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    getConfidenceColor(suggestion.confidence),
                                  )}
                                >
                                  {Math.round(suggestion.confidence * 100)}%
                                  match
                                </Badge>
                              </div>

                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-lg font-semibold text-gray-900">
                                  {formatCurrency(suggestion.amount || 0)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {suggestion.category}
                                </span>
                                {suggestion.estimatedDueDate && (
                                  <span className="text-sm text-blue-600">
                                    Due{" "}
                                    {formatDate(
                                      new Date(suggestion.estimatedDueDate),
                                    )}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-gray-500 mt-1">
                                {suggestion.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDismissSuggestion(suggestion.id)
                              }
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleConfirmSuggestion(suggestion)
                              }
                              className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {smartSuggestions.length > 3 && (
                    <div className="mt-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600"
                      >
                        View {smartSuggestions.length - 3} more suggestions
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Toast */}
            <AnimatePresence>
              {showSuccessToast && (
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: -50 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, y: -50 }}
                  className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{showSuccessToast}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bills Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  Bills Overview
                </h2>
                {filteredBills.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {filteredBills.filter((b) => b.status !== "paid").length}{" "}
                    active
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Insights
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bill
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            {filteredBills.some((bill) => bill.status === "overdue") && (
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <h3 className="font-medium text-red-900">
                        Overdue Bills
                      </h3>
                      <p className="text-sm text-red-700">
                        {
                          filteredBills.filter((b) => b.status === "overdue")
                            .length
                        }{" "}
                        bills need immediate attention
                      </p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Pay Now
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Bills List */}
            <div className="space-y-4">
              {filteredBills.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No bills yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add your first bill or connect your bank account to get
                    started
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bill
                    </Button>
                    <Button variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Connect Bank
                    </Button>
                  </div>
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
                  {[
                    {
                      label: "Total Bills",
                      value: filteredBills.length,
                      icon: <FileText className="h-4 w-4" />,
                    },
                    {
                      label: "This Month",
                      value: formatCurrency(
                        filteredBills.reduce(
                          (sum, bill) => sum + bill.amount,
                          0,
                        ),
                      ),
                      icon: <DollarSign className="h-4 w-4" />,
                    },
                    {
                      label: "Due Soon",
                      value: filteredBills.filter(
                        (b) => b.status === "due-soon",
                      ).length,
                      icon: <Clock className="h-4 w-4" />,
                    },
                    {
                      label: "On Auto-Pay",
                      value: Math.floor(filteredBills.length * 0.6),
                      icon: <Zap className="h-4 w-4" />,
                    },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-600">
                        {stat.icon}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
        {/* Calendar View */}
        {currentView === "calendar" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
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
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCalendar("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
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
                      "min-h-[120px] p-2 border-r border-b border-gray-100 relative",
                      !day.isCurrentMonth && "bg-gray-50 text-gray-400",
                      day.isToday && "bg-teal-50 border-teal-200",
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          day.isToday && "text-teal-600",
                        )}
                      >
                        {day.date.getDate()}
                      </span>
                      {day.bills.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {day.bills.length}
                        </Badge>
                      )}
                    </div>

                    {/* Bills for this day */}
                    <div className="space-y-1">
                      {day.bills.slice(0, 2).map((bill) => (
                        <div
                          key={bill.id}
                          className={cn(
                            "px-2 py-1 rounded text-xs border",
                            getStatusColor(bill.status),
                          )}
                        >
                          <div className="font-medium truncate">
                            {bill.billerName}
                          </div>
                          <div className="text-xs">
                            {formatCurrency(bill.amount)}
                          </div>
                        </div>
                      ))}
                      {day.bills.length > 2 && (
                        <div className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                          +{day.bills.length - 2} more
                        </div>
                      )}
                    </div>

                    {day.totalAmount > 0 && (
                      <div className="absolute bottom-1 right-1 text-xs font-medium text-gray-600">
                        {formatCurrency(day.totalAmount)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cash Flow Timeline */}
        {currentView === "cashflow" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                7-Day Cash Flow
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCashflow("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {formatDate(cashflowDate)} -{" "}
                  {formatDate(
                    new Date(cashflowDate.getTime() + 6 * 24 * 60 * 60 * 1000),
                  )}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCashflow("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Horizontal Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-end space-x-4 h-64">
                {cashflowDays.map((day, index) => {
                  const maxOutflow =
                    Math.max(...cashflowDays.map((d) => d.outflow)) || 1;
                  const barHeight = (day.outflow / maxOutflow) * 200;

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      {/* Bar */}
                      <div className="relative w-full max-w-[60px] flex flex-col items-center">
                        <div className="text-xs text-gray-600 mb-2">
                          {formatCurrency(day.outflow)}
                        </div>
                        <div
                          className="w-full bg-gradient-to-t from-red-400 to-red-300 rounded-t-lg transition-all duration-300"
                          style={{ height: `${barHeight}px` }}
                        />
                        <div className="w-full h-1 bg-gray-200 rounded-b-lg" />
                      </div>

                      {/* Date */}
                      <div className="mt-3 text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {day.date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {day.date.toLocaleDateString("en-US", {
                            month: "numeric",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      {/* Bills count */}
                      {day.bills.length > 0 && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {day.bills.length}{" "}
                          {day.bills.length === 1 ? "bill" : "bills"}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded" />
                  <span>Outflow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded" />
                  <span>Inflow</span>
                </div>
              </div>
            </div>

            {/* Cash Flow Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Outflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(
                      cashflowDays.reduce((sum, day) => sum + day.outflow, 0),
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Next 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Peak Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {formatCurrency(
                      Math.max(...cashflowDays.map((d) => d.outflow)),
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {cashflowDays
                      .find(
                        (d) =>
                          d.outflow ===
                          Math.max(...cashflowDays.map((day) => day.outflow)),
                      )
                      ?.date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Bills Due
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {cashflowDays.reduce(
                      (sum, day) => sum + day.bills.length,
                      0,
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Next 7 days</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default Dashboard;
