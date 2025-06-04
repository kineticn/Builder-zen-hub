import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showSteps?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  className,
  showSteps = false,
}) => {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        {showSteps && (
          <span className="text-sm font-medium text-muted-foreground">
            Step {current} of {total}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-400 to-teal-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
