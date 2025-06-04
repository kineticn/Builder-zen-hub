import React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  "aria-label"?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  className,
  icon = <Plus className="h-6 w-6" />,
  "aria-label": ariaLabel = "Add new item",
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "fixed bottom-20 right-6 z-50",
        "h-14 w-14 rounded-full",
        "bg-gradient-to-r from-teal-400 to-teal-500",
        "text-white shadow-lg",
        "flex items-center justify-center",
        "transition-all duration-200",
        "hover:shadow-xl hover:scale-105",
        "active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
        "animate-pulse-glow",
        className,
      )}
    >
      {icon}
    </button>
  );
};
