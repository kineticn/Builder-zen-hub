import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Zap, Camera, Edit, Bell } from "lucide-react";
import { BillTile } from "@/components/BillTile";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Bill {
  id: string;
  billerName: string;
  billerLogo?: string;
  amount: number;
  dueDate: string;
  status: "upcoming" | "due-soon" | "overdue" | "paid";
  category?: string;
}

const mockBills: Bill[] = [
  {
    id: "1",
    billerName: "Electric Company",
    amount: 125.5,
    dueDate: "2024-03-15",
    status: "due-soon",
    category: "Utilities",
  },
  {
    id: "2",
    billerName: "Internet Provider",
    amount: 79.99,
    dueDate: "2024-03-18",
    status: "upcoming",
    category: "Internet",
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
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const totalDue = bills
    .filter((bill) => bill.status !== "paid")
    .reduce((sum, bill) => sum + bill.amount, 0);

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

  const activeBills = bills.filter((bill) => bill.status !== "paid");
  const paidBills = bills.filter((bill) => bill.status === "paid");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display">
              Good morning! 👋
            </h1>
            <p className="text-navy-200 mt-1">Let's manage your bills</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-navy-200 text-sm font-medium">
                  Total Due This Month
                </p>
                <p className="text-3xl font-bold font-display mt-1">
                  ${totalDue.toFixed(2)}
                </p>
              </div>
              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white border-0"
                onClick={() => {
                  /* Enable autopay logic */
                }}
              >
                <Zap className="mr-2 h-4 w-4" />
                Enable Autopay
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bills Section */}
      <div className="p-6 space-y-6">
        {activeBills.length > 0 ? (
          <>
            {/* Active Bills */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 font-display">
                Upcoming Bills ({activeBills.length})
              </h2>
              <div className="space-y-3">
                {activeBills.map((bill) => (
                  <BillTile
                    key={bill.id}
                    bill={bill}
                    onPayNow={handlePayNow}
                    onViewDetails={handleViewDetails}
                    onDelete={handleDeleteBill}
                  />
                ))}
              </div>
            </div>

            {/* Recent Payments */}
            {paidBills.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 font-display">
                  Recent Payments
                </h2>
                <div className="space-y-3">
                  {paidBills.map((bill) => (
                    <BillTile
                      key={bill.id}
                      bill={bill}
                      onPayNow={handlePayNow}
                      onViewDetails={handleViewDetails}
                      onDelete={handleDeleteBill}
                      className="opacity-75"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
              No bills yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Start by adding your first bill to track payments and set up
              autopay.
            </p>
            <Button
              onClick={handleAddBill}
              className="bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Bill
            </Button>
          </div>
        )}
      </div>

      {/* Add Bill Bottom Sheet */}
      <Sheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Add New Bill</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start space-x-4 text-left"
              onClick={() => {
                setIsBottomSheetOpen(false);
                // Navigate to scan flow
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
            </Button>

            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-start space-x-4 text-left"
              onClick={() => {
                setIsBottomSheetOpen(false);
                // Navigate to manual entry
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
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddBill} aria-label="Add new bill" />

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default Dashboard;
