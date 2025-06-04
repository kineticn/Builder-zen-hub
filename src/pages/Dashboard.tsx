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
} from "lucide-react";
import { BillTile } from "@/components/BillTile";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { BottomNavBar } from "@/components/BottomNavBar";
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
}

interface SpendingPattern {
  category: string;
  amount: number;
  trend: "up" | "down" | "stable";
  percentage: number;
  color: string;
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
  },
  {
    id: "2",
    billerName: "Internet Provider",
    amount: 79.99,
    dueDate: "2024-03-18",
    status: "upcoming",
    category: "Internet",
    isRecurring: true,
  },
  {
    id: "3",
    billerName: "Credit Card",
    amount: 450.0,
    dueDate: "2024-03-12",
    status: "overdue",
    category: "Credit Card",
  },
  {
    id: "4",
    billerName: "Phone Bill",
    amount: 65.0,
    dueDate: "2024-03-20",
    status: "paid",
    category: "Mobile",
    isRecurring: true,
  },
  {
    id: "5",
    billerName: "Streaming Service",
    amount: 15.99,
    dueDate: "2024-03-25",
    status: "upcoming",
    category: "Entertainment",
    isRecurring: true,
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
  const [userName] = useState(
    localStorage.getItem("billbuddy_user_name") || "there",
  );

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const totalDue = bills
    .filter((bill) => bill.status !== "paid")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const overdueBills = bills.filter((bill) => bill.status === "overdue");
  const dueSoonBills = bills.filter((bill) => bill.status === "due-soon");
  const upcomingBills = bills.filter((bill) => bill.status === "upcoming");
  const paidBills = bills.filter((bill) => bill.status === "paid");

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
        description: `Enable auto-pay for ${bills.filter((b) => b.isRecurring && b.status !== "paid").length} recurring bills to never miss a payment.`,
        action: {
          label: "Set Up",
          onClick: () => console.log("Setup autopay"),
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

  const handleQuickPay = () => {
    if (dueSoonBills.length > 0) {
      handlePayNow(dueSoonBills[0].id);
    }
  };

  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5" />;
      case "saving":
        return <DollarSign className="h-5 w-5" />;
      case "optimization":
        return <Brain className="h-5 w-5" />;
      case "achievement":
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: Insight["type"]) => {
    switch (type) {
      case "warning":
        return "bg-red-100 text-red-600 border-red-200";
      case "saving":
        return "bg-green-100 text-green-600 border-green-200";
      case "optimization":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "achievement":
        return "bg-purple-100 text-purple-600 border-purple-200";
    }
  };

  const activeBills = bills.filter((bill) => bill.status !== "paid");
  const insights = getInsights();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Enhanced Header with Smart Insights */}
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

          {/* Enhanced Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Total Due Card */}
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
                        Total Due This Month
                      </p>
                      <div className="flex items-baseline space-x-2 mt-2">
                        <p className="text-3xl font-bold font-display">
                          ${totalDue.toFixed(2)}
                        </p>
                        {totalDue > 0 && (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 text-xs"
                          >
                            {activeBills.length} bills
                          </Badge>
                        )}
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

            {/* Quick Actions Card */}
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
                        Quick Actions
                      </p>
                      <div className="flex space-x-2 mt-3">
                        {dueSoonBills.length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/30 text-white hover:bg-white/10"
                            onClick={handleQuickPay}
                          >
                            <CreditCard className="mr-1 h-3 w-3" />
                            Pay ${dueSoonBills[0].amount}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10"
                          onClick={handleAddBill}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Add Bill
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {dueSoonBills.length}
                      </div>
                      <p className="text-xs text-navy-200">due soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Smart Insights Section */}
        {insights.length > 0 && showInsights && (
          <motion.div
            className="space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
                    className={cn("border-l-4", getInsightColor(insight.type))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            getInsightColor(insight.type),
                          )}
                        >
                          {getInsightIcon(insight.type)}
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

        {/* Spending Overview */}
        <motion.div
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 font-display flex items-center">
            <Target className="h-5 w-5 mr-2 text-teal-600" />
            This Month's Overview
          </h2>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockSpendingPatterns.map((pattern, index) => (
                  <motion.div
                    key={pattern.category}
                    className="text-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="relative mb-3">
                      <div className="w-16 h-16 mx-auto relative">
                        <svg
                          className="w-16 h-16 transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="text-gray-200"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={pattern.color.replace("bg-", "text-")}
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${pattern.percentage}, 100`}
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-600">
                            {pattern.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {pattern.category}
                    </h3>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <span className="text-sm font-bold text-gray-700">
                        ${pattern.amount.toFixed(0)}
                      </span>
                      {pattern.trend === "up" && (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      )}
                      {pattern.trend === "down" && (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bills Section with Enhanced Organization */}
        {activeBills.length > 0 ? (
          <div className="space-y-6">
            {/* Overdue Bills - Priority */}
            {overdueBills.length > 0 && (
              <motion.div
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
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

            {/* Due Soon Bills */}
            {dueSoonBills.length > 0 && (
              <motion.div
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
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
                        className="border-yellow-200"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Upcoming Bills */}
            {upcomingBills.length > 0 && (
              <motion.div
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
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

            {/* Recent Payments */}
            {paidBills.length > 0 && (
              <motion.div
                className="space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h2 className="text-lg font-semibold text-gray-900 font-display">
                    Recently Paid
                  </h2>
                </div>
                <div className="space-y-3">
                  {paidBills.slice(0, 3).map((bill, index) => (
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
                        className="opacity-75 border-green-200"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          /* Enhanced Empty State */
          <motion.div
            className="text-center py-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
              You're all caught up! 🎉
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              No bills to pay right now. Start by adding your bills to track
              payments and set up autopay.
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
