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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
}

interface ReferralBanner {
  id: string;
  show: boolean;
  message: string;
  ctaText: string;
  reward: string;
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
];

const mockSmartSuggestions: SmartSuggestion[] = [
  {
    id: "1",
    type: "recurring_payee",
    name: "State Farm Insurance",
    amount: 89.0,
    confidence: 92,
    source: "plaid",
    lastSeen: "2024-03-10",
  },
  {
    id: "2",
    type: "email_bill",
    name: "Adobe Creative Cloud",
    amount: 52.99,
    confidence: 88,
    source: "gmail",
    lastSeen: "2024-03-08",
  },
  {
    id: "3",
    type: "subscription",
    name: "Gym Membership",
    amount: 29.99,
    confidence: 76,
    source: "pattern",
    lastSeen: "2024-03-05",
  },
];

const mockSpendingPatterns: SpendingPattern[] = [
  {
    category: "Utilities",
    amount: 245.5,
    trend: "up",
    percentage: 35,
    color: "bg-blue-500",
  },
  {
    category: "Internet",
    amount: 79.99,
    trend: "stable",
    percentage: 25,
    color: "bg-green-500",
  },
  {
    category: "Entertainment",
    amount: 47.97,
    trend: "down",
    percentage: 20,
    color: "bg-purple-500",
  },
  {
    category: "Mobile",
    amount: 65.0,
    trend: "stable",
    percentage: 20,
    color: "bg-orange-500",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showInsights, setShowInsights] = useState(true);
  const [selectedHousehold, setSelectedHousehold] = useState<string>("home");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [userName] = useState(
    localStorage.getItem("billbuddy_user_name") || "there",
  );
  const [householdType] = useState(
    localStorage.getItem("billbuddy_household_type") || "home",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [smartSuggestions, setSmartSuggestions] =
    useState<SmartSuggestion[]>(mockSmartSuggestions);
  const [showReferralBanner, setShowReferralBanner] = useState(true);
  const [showSavingsBadge, setShowSavingsBadge] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Show savings badge after autopay setup (simulated)
  useEffect(() => {
    const timer = setTimeout(() => setShowSavingsBadge(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageSkeleton />;
  }

  const currentHousehold =
    mockHouseholds.find((h) => h.id === selectedHousehold) || mockHouseholds[0];
  const householdBills = bills.filter(
    (bill) => bill.householdId === selectedHousehold,
  );

  const totalDue = householdBills
    .filter((bill) => bill.status !== "paid")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const overdueBills = householdBills.filter(
    (bill) => bill.status === "overdue",
  );
  const dueSoonBills = householdBills.filter(
    (bill) => bill.status === "due-soon",
  );
  const upcomingBills = householdBills.filter(
    (bill) => bill.status === "upcoming",
  );
  const paidBills = householdBills.filter((bill) => bill.status === "paid");

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getInsights = (): Insight[] =>
    [
      {
        id: "1",
        type: "warning",
        title: "Overdue Payment Alert",
        description: `You have ${overdueBills.length} overdue bill${overdueBills.length !== 1 ? "s" : ""} totaling $${overdueBills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}`,
        action: {
          label: "Pay Now",
          onClick: () => navigate(`/bill/${overdueBills[0].id}`),
        },
        priority: "high",
      },
      {
        id: "2",
        type: "saving",
        title: "Potential Savings Detected",
        description:
          "Your electric bill is 6% higher than last month. Consider energy-saving tips.",
        action: {
          label: "View Tips",
          onClick: () => console.log("Show energy tips"),
        },
        priority: "medium",
      },
      {
        id: "3",
        type: "optimization",
        title: "Auto-pay Recommendation",
        description: `Enable auto-pay for ${householdBills.filter((b) => b.isRecurring && b.status !== "paid").length} recurring bills to never miss a payment.`,
        action: {
          label: "Set Up",
          onClick: () => setShowSavingsBadge(true),
        },
        priority: "medium",
      },
      {
        id: "4",
        type: "achievement",
        title: "Great Job! 🎉",
        description: "You've paid all bills on time for 3 months straight!",
        priority: "low",
      },
    ].filter((insight) => {
      if (insight.id === "1" && overdueBills.length === 0) return false;
      return true;
    });

  const handlePayNow = (billId: string) => {
    setBills(
      bills.map((bill) =>
        bill.id === billId ? { ...bill, status: "paid" as const } : bill,
      ),
    );
  };

  const handleViewDetails = (billId: string) => {
    navigate(`/bill/${billId}`);
  };

  const handleDeleteBill = (billId: string) => {
    setBills(bills.filter((bill) => bill.id !== billId));
  };

  const handleAddBill = () => {
    setIsBottomSheetOpen(true);
  };

  const handleConfirmSuggestion = (suggestionId: string) => {
    const suggestion = smartSuggestions.find((s) => s.id === suggestionId);
    if (suggestion) {
      // Add as new bill
      const newBill: Bill = {
        id: `new_${suggestionId}`,
        billerName: suggestion.name,
        amount: suggestion.amount || 0,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "upcoming",
        category:
          suggestion.type === "subscription" ? "Entertainment" : "Other",
        isRecurring: true,
        householdId: selectedHousehold,
      };
      setBills([...bills, newBill]);
      setSmartSuggestions(
        smartSuggestions.filter((s) => s.id !== suggestionId),
      );
    }
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setSmartSuggestions(smartSuggestions.filter((s) => s.id !== suggestionId));
  };

  const activeBills = householdBills.filter((bill) => bill.status !== "paid");
  const insights = getInsights();

  // Generate calendar data
  const generateCalendarData = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const days = [];

    for (
      let d = new Date(startOfMonth);
      d <= endOfMonth;
      d.setDate(d.getDate() + 1)
    ) {
      const dayBills = householdBills.filter((bill) => {
        const billDate = new Date(bill.dueDate);
        return billDate.toDateString() === d.toDateString();
      });

      days.push({
        date: new Date(d),
        bills: dayBills,
        totalAmount: dayBills.reduce((sum, bill) => sum + bill.amount, 0),
      });
    }

    return days;
  };

  const calendarData = generateCalendarData();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Referral Banner */}
      <AnimatePresence>
        {showReferralBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-3 relative"
          >
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <div className="flex items-center space-x-2">
                <Gift className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Give $5, get $5 off your next bill
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs"
                  onClick={() => console.log("Referral clicked")}
                >
                  Refer Friends
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 h-auto text-white hover:bg-white/20"
                  onClick={() => setShowReferralBanner(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Savings Achievement Badge */}
      <AnimatePresence>
        {showSavingsBadge && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-20 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-xs"
          >
            <div className="flex items-start space-x-2">
              <PiggyBank className="h-5 w-5 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Savings Unlocked! 🎉</h3>
                <p className="text-xs mt-1">
                  You'll save $25/month in late fees with autopay
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs mt-2"
                  onClick={() => console.log("Share savings")}
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Share My Success
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-auto text-white hover:bg-white/20"
                onClick={() => setShowSavingsBadge(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Header with Household Selector */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <motion.div
              className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-20 h-20 border border-white/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        <div className="relative p-6 pt-12">
          {/* Household Selector */}
          <motion.div
            className="mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Select
              value={selectedHousehold}
              onValueChange={setSelectedHousehold}
            >
              <SelectTrigger className="w-auto bg-white/10 border-white/20 text-white">
                <div className="flex items-center space-x-2">
                  {currentHousehold.icon}
                  <span>{currentHousehold.name}</span>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 ml-2"
                  >
                    {currentHousehold.role}
                  </Badge>
                </div>
              </SelectTrigger>
              <SelectContent>
                {mockHouseholds.map((household) => (
                  <SelectItem key={household.id} value={household.id}>
                    <div className="flex items-center space-x-2">
                      {household.icon}
                      <span>{household.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {household.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold font-display">
                {getGreeting()}, {userName}! 👋
              </h1>
              <p className="text-navy-200 mt-1 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </motion.div>

            <motion.div
              className="flex space-x-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {insights.filter((i) => i.priority === "high").length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Summary Cards with Household Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Household Overview */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-navy-200 text-sm font-medium">
                        Monthly Outflow
                      </p>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <p className="text-3xl font-bold font-display">
                          ${currentHousehold.totalMonthlyOutflow.toFixed(2)}
                        </p>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 text-xs"
                        >
                          {currentHousehold.upcomingJointBills} joint bills
                        </Badge>
                      </div>
                    </div>
                    <Button
                      className="bg-teal-500 hover:bg-teal-600 text-white border-0"
                      onClick={() => {
                        /* Enable autopay logic */
                      }}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Auto-pay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cash Flow Timeline Preview */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-navy-200 text-sm font-medium">
                        Next 7 Days
                      </p>
                      <div className="flex space-x-2 mt-3">
                        {[...Array(7)].map((_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() + i);
                          const dayBills = householdBills.filter((bill) => {
                            const billDate = new Date(bill.dueDate);
                            return (
                              billDate.toDateString() === date.toDateString()
                            );
                          });
                          const amount = dayBills.reduce(
                            (sum, bill) => sum + bill.amount,
                            0,
                          );

                          return (
                            <div key={i} className="text-center">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                  amount > 0
                                    ? amount > 100
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                    : "bg-green-500",
                                )}
                              >
                                {dayBills.length || "·"}
                              </div>
                              <p className="text-xs text-navy-200 mt-1">
                                {date.getDate()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${totalDue.toFixed(0)}
                      </div>
                      <p className="text-xs text-navy-200">this period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* View Mode Toggle */}
          <motion.div
            className="flex justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs
              value={viewMode}
              onValueChange={(value) =>
                setViewMode(value as "list" | "calendar")
              }
            >
              <TabsList className="bg-white/10 border-white/20">
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-navy-200"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  List View
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-navy-200"
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Calendar View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Smart Suggestions Card */}
        {smartSuggestions.length > 0 && (
          <motion.div
            className="space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-900 font-display">
                Smart Suggestions
              </h2>
              <Badge className="bg-teal-100 text-teal-700">New</Badge>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {smartSuggestions.slice(0, 2).map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          {suggestion.source === "plaid" && (
                            <CreditCard className="h-5 w-5 text-teal-600" />
                          )}
                          {suggestion.source === "gmail" && (
                            <Bell className="h-5 w-5 text-teal-600" />
                          )}
                          {suggestion.source === "pattern" && (
                            <Brain className="h-5 w-5 text-teal-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {suggestion.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            {suggestion.amount && (
                              <span>${suggestion.amount.toFixed(2)}</span>
                            )}
                            <span>•</span>
                            <span>{suggestion.confidence}% confidence</span>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDismissSuggestion(suggestion.id)}
                        >
                          Dismiss
                        </Button>
                        <Button
                          size="sm"
                          className="bg-teal-500 hover:bg-teal-600"
                          onClick={() => handleConfirmSuggestion(suggestion.id)}
                        >
                          Add Bill
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Trust Cues Section */}
        <motion.div
          className="bg-teal-50 border border-teal-200 rounded-lg p-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-teal-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-teal-800">
                Your Data is Secure
              </h3>
              <p className="text-sm text-teal-700 mt-1">
                We use Plaid—bank-level security with read-only access to your
                financial data.
                <a href="/security" className="underline font-medium ml-1">
                  Learn more about our security
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content with View Toggle */}
        <Tabs value={viewMode} className="space-y-6">
          <TabsContent value="list" className="space-y-6">
            {/* Smart Insights Section */}
            {insights.length > 0 && showInsights && (
              <motion.div
                className="space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 font-display flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-teal-600" />
                    Smart Insights
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInsights(false)}
                    className="text-gray-500"
                  >
                    Dismiss All
                  </Button>
                </div>

                <div className="space-y-3">
                  {insights.slice(0, 2).map((insight, index) => (
                    <motion.div
                      key={insight.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className={cn(
                          "border-l-4",
                          insight.type === "warning"
                            ? "border-red-500 bg-red-50"
                            : insight.type === "saving"
                              ? "border-green-500 bg-green-50"
                              : insight.type === "optimization"
                                ? "border-blue-500 bg-blue-50"
                                : "border-purple-500 bg-purple-50",
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div
                              className={cn(
                                "p-2 rounded-lg",
                                insight.type === "warning"
                                  ? "bg-red-100 text-red-600"
                                  : insight.type === "saving"
                                    ? "bg-green-100 text-green-600"
                                    : insight.type === "optimization"
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-purple-100 text-purple-600",
                              )}
                            >
                              {insight.type === "warning" && (
                                <AlertCircle className="h-5 w-5" />
                              )}
                              {insight.type === "saving" && (
                                <DollarSign className="h-5 w-5" />
                              )}
                              {insight.type === "optimization" && (
                                <Brain className="h-5 w-5" />
                              )}
                              {insight.type === "achievement" && (
                                <CheckCircle className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {insight.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {insight.description}
                              </p>
                              {insight.action && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-3 text-xs"
                                  onClick={insight.action.onClick}
                                >
                                  {insight.action.label}
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Bills List View */}
            {activeBills.length > 0 ? (
              <div className="space-y-6">
                {/* Organized by priority with color-blind safe indicators */}
                {overdueBills.length > 0 && (
                  <motion.div
                    className="space-y-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <h2 className="text-lg font-semibold text-red-700 font-display">
                        Overdue ({overdueBills.length})
                      </h2>
                      <Badge variant="destructive" className="animate-pulse">
                        Action Required
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {overdueBills.map((bill, index) => (
                        <motion.div
                          key={bill.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <BillTile
                            bill={bill}
                            onPayNow={handlePayNow}
                            onViewDetails={handleViewDetails}
                            onDelete={handleDeleteBill}
                            className="border-red-200 shadow-md"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {dueSoonBills.length > 0 && (
                  <motion.div
                    className="space-y-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <h2 className="text-lg font-semibold text-gray-900 font-display">
                        Due Soon ({dueSoonBills.length})
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {dueSoonBills.map((bill, index) => (
                        <motion.div
                          key={bill.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <BillTile
                            bill={bill}
                            onPayNow={handlePayNow}
                            onViewDetails={handleViewDetails}
                            onDelete={handleDeleteBill}
                            className="border-amber-200"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {upcomingBills.length > 0 && (
                  <motion.div
                    className="space-y-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <h2 className="text-lg font-semibold text-gray-900 font-display">
                        Upcoming ({upcomingBills.length})
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {upcomingBills.map((bill, index) => (
                        <motion.div
                          key={bill.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <BillTile
                            bill={bill}
                            onPayNow={handlePayNow}
                            onViewDetails={handleViewDetails}
                            onDelete={handleDeleteBill}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Enhanced Empty State with Personality */
              <motion.div
                className="text-center py-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-6"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-12 h-12 text-teal-600" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
                  No bills here—enjoy the calm before the storm 🌊
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  Looks like your {currentHousehold.name.toLowerCase()} is all
                  caught up! Ready to add some bills to track?
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleAddBill}
                    className="bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Bill
                  </Button>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Camera className="h-4 w-4" />
                      <span>Scan bills</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4" />
                      <span>Auto-pay</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Brain className="h-4 w-4" />
                      <span>Smart insights</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            {/* Calendar View */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2" />
                    {currentTime.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-500 py-2"
                        >
                          {day}
                        </div>
                      ),
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarData.map((day, index) => (
                      <motion.div
                        key={index}
                        className={cn(
                          "min-h-[60px] p-2 border rounded-lg cursor-pointer transition-all duration-200",
                          day.bills.length > 0
                            ? day.totalAmount > 100
                              ? "border-red-300 bg-red-50 hover:bg-red-100"
                              : "border-amber-300 bg-amber-50 hover:bg-amber-100"
                            : "border-gray-200 hover:bg-gray-50",
                          day.date.toDateString() === new Date().toDateString()
                            ? "ring-2 ring-teal-500"
                            : "",
                        )}
                        whileHover={{ scale: 1.02 }}
                        onClick={() =>
                          day.bills.length > 0 &&
                          console.log("Show day bills", day.bills)
                        }
                      >
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {day.date.getDate()}
                        </div>
                        {day.bills.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-gray-700">
                              {day.bills.length} bill
                              {day.bills.length !== 1 ? "s" : ""}
                            </div>
                            <div className="text-xs text-gray-600">
                              ${day.totalAmount.toFixed(0)}
                            </div>
                            <div className="flex space-x-1">
                              {day.bills.slice(0, 2).map((bill, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    bill.status === "overdue"
                                      ? "bg-red-500"
                                      : bill.status === "due-soon"
                                        ? "bg-amber-500"
                                        : "bg-green-500",
                                  )}
                                />
                              ))}
                              {day.bills.length > 2 && (
                                <div className="text-xs text-gray-400">
                                  +{day.bills.length - 2}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Security & Privacy Link */}
        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => navigate("/security-privacy")}
          >
            <Shield className="h-4 w-4 mr-2" />
            Security & Privacy
          </Button>
        </motion.div>
      </div>

      {/* Enhanced Add Bill Bottom Sheet */}
      <Sheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Bill
            </SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="outline"
                className="w-full h-16 flex items-center justify-start space-x-4 text-left hover:bg-teal-50 hover:border-teal-300 transition-all duration-200"
                onClick={() => {
                  setIsBottomSheetOpen(false);
                }}
              >
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Camera className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium">Scan Bill</p>
                  <p className="text-sm text-gray-500">
                    Take a photo to auto-fill details
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="ml-auto bg-green-100 text-green-700"
                >
                  Recommended
                </Badge>
              </Button>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full h-16 flex items-center justify-start space-x-4 text-left hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                onClick={() => {
                  setIsBottomSheetOpen(false);
                }}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Edit className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Manual Entry</p>
                  <p className="text-sm text-gray-500">
                    Enter bill details manually
                  </p>
                </div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                variant="outline"
                className="w-full h-16 flex items-center justify-start space-x-4 text-left hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                onClick={() => {
                  setIsBottomSheetOpen(false);
                }}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Browse Popular Bills</p>
                  <p className="text-sm text-gray-500">
                    Choose from common service providers
                  </p>
                </div>
              </Button>
            </motion.div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Enhanced Floating Action Button */}
      <FloatingActionButton onClick={handleAddBill} aria-label="Add new bill" />

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default Dashboard;
