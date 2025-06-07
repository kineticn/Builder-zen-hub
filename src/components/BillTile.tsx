import React, { useState } from "react";
import { MoreHorizontal, CreditCard, Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Bill {
  id: string;
  billerName: string;
  billerLogo?: string;
  amount: number;
  dueDate: string;
  status: "upcoming" | "due-soon" | "overdue" | "paid";
  category?: string;
}

interface BillTileProps {
  bill: Bill;
  onClick?: (bill: Bill) => void;
  onPayNow?: (billId: string) => void;
  onViewDetails?: (billId: string) => void;
  onDelete?: (billId: string) => void;
  className?: string;
}

const getStatusColor = (status: Bill["status"]) => {
  switch (status) {
    case "upcoming":
      return "bg-gray-100 text-gray-700";
    case "due-soon":
      return "bg-amber-100 text-amber-700";
    case "overdue":
      return "bg-red-100 text-red-700";
    case "paid":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusLabel = (status: Bill["status"]) => {
  switch (status) {
    case "upcoming":
      return "Upcoming";
    case "due-soon":
      return "Due Soon";
    case "overdue":
      return "Overdue";
    case "paid":
      return "Paid";
    default:
      return "Unknown";
  }
};

export const BillTile: React.FC<BillTileProps> = ({
  bill,
  onClick,
  onPayNow,
  onViewDetails,
  onDelete,
  className,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Default handlers
  const handlePayNow =
    onPayNow ||
    (() => {
      alert(
        `Pay Now for ${bill.billerName}\nAmount: ${formatAmount(bill.amount)}\n\nThis would redirect to the payment flow.`,
      );
    });

  const handleViewDetails = onViewDetails
    ? () => onViewDetails(bill.id)
    : onClick
      ? () => onClick(bill)
      : () => {
          alert(
            `Bill Details for ${bill.billerName}\nAmount: ${formatAmount(bill.amount)}\nDue: ${formatDate(bill.dueDate)}\nStatus: ${getStatusLabel(bill.status)}`,
          );
        };

  const handleDelete =
    onDelete ||
    (() => {
      if (confirm(`Are you sure you want to delete ${bill.billerName}?`)) {
        alert(`${bill.billerName} would be deleted from your bills.`);
      }
    });

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200",
        "p-4 space-y-3",
        "transition-all duration-200",
        "hover:shadow-md hover:border-gray-300",
        "swipe-container",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={bill.billerLogo}
              alt={`${bill.billerName} logo`}
            />
            <AvatarFallback className="bg-teal-100 text-teal-700 font-medium">
              {bill.billerName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {bill.billerName}
            </h3>
            {bill.category && (
              <p className="text-xs text-gray-500 truncate">{bill.category}</p>
            )}
          </div>
        </div>

        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handlePayNow(bill.id)}
              className="flex items-center space-x-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Pay Now</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleViewDetails}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(bill.id)}
              className="flex items-center space-x-2 text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            {formatAmount(bill.amount)}
          </p>
          <p className="text-sm text-gray-500">
            Due {formatDate(bill.dueDate)}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            getStatusColor(bill.status),
          )}
        >
          {getStatusLabel(bill.status)}
        </span>
      </div>
    </div>
  );
};
