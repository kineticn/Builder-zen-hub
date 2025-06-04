import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MoreHorizontal,
  Zap,
} from "lucide-react";
import { LineChart } from "@/components/ui/line-chart";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "failed" | "pending";
  method: string;
}

interface ChartDataPoint {
  month: string;
  amount: number;
}

const mockBill = {
  id: "1",
  billerName: "Electric Company",
  billerLogo: "",
  amount: 125.5,
  dueDate: "2024-03-15",
  status: "due-soon" as const,
  category: "Utilities",
  accountNumber: "****1234",
  autopayEnabled: false,
  description: "Monthly electricity bill for residential service",
};

const mockPaymentHistory: PaymentHistoryItem[] = [
  {
    id: "1",
    date: "2024-02-15",
    amount: 118.5,
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "2",
    date: "2024-01-15",
    amount: 132.75,
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "3",
    date: "2023-12-15",
    amount: 145.2,
    status: "paid",
    method: "Credit Card",
  },
  {
    id: "4",
    date: "2023-11-15",
    amount: 128.9,
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "5",
    date: "2023-10-15",
    amount: 115.6,
    status: "paid",
    method: "Bank Transfer",
  },
];

const mockChartData: ChartDataPoint[] = [
  { month: "Oct", amount: 115.6 },
  { month: "Nov", amount: 128.9 },
  { month: "Dec", amount: 145.2 },
  { month: "Jan", amount: 132.75 },
  { month: "Feb", amount: 118.5 },
  { month: "Mar", amount: 125.5 },
];

const BillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [autopayEnabled, setAutopayEnabled] = useState(mockBill.autopayEnabled);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handlePayNow = () => {
    // Navigate to payment flow
    console.log("Paying bill:", id);
  };

  const handleToggleAutopay = (enabled: boolean) => {
    setAutopayEnabled(enabled);
    // API call to update autopay setting
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 font-display">
            Bill Details
          </h1>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Bill Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={mockBill.billerLogo}
                  alt={`${mockBill.billerName} logo`}
                />
                <AvatarFallback className="bg-teal-100 text-teal-700 font-medium">
                  {mockBill.billerName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 font-display">
                      {mockBill.billerName}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Account: {mockBill.accountNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {mockBill.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {mockBill.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatAmount(mockBill.amount)}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due {formatDate(mockBill.dueDate)}
                    </p>
                  </div>
                  <Button
                    onClick={handlePayNow}
                    className="bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Autopay Setting */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Autopay</h3>
                  <p className="text-sm text-gray-500">
                    Automatically pay this bill each month
                  </p>
                </div>
              </div>
              <Switch
                checked={autopayEnabled}
                onCheckedChange={handleToggleAutopay}
                aria-label="Toggle autopay"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">
              Payment History (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={mockChartData} />
          </CardContent>
        </Card>

        {/* Payment History Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {mockPaymentHistory.map((payment, index) => (
                <div
                  key={payment.id}
                  className="p-6 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        payment.status === "paid"
                          ? "bg-green-500"
                          : payment.status === "failed"
                            ? "bg-red-500"
                            : "bg-yellow-500",
                      )}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(payment.date)}
                      </p>
                      <p className="text-sm text-gray-500">{payment.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatAmount(payment.amount)}
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(payment.status),
                      )}
                    >
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default BillDetail;
