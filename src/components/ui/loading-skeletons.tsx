import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className,
      )}
    />
  );
};

// Bill Tile Skeleton
export const BillTileSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
};

// Dashboard Header Skeleton
export const DashboardHeaderSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-6 pt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40 bg-white/20" />
          <Skeleton className="h-4 w-32 bg-white/10" />
        </div>
        <Skeleton className="h-8 w-8 rounded bg-white/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <Skeleton className="h-4 w-32 bg-white/20 mb-2" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24 bg-white/30" />
            <Skeleton className="h-8 w-20 rounded bg-white/20" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <Skeleton className="h-4 w-24 bg-white/20 mb-3" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-16 rounded bg-white/20" />
            <Skeleton className="h-6 w-16 rounded bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Insight Card Skeleton
export const InsightCardSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-6 w-16 rounded mt-3" />
        </div>
      </div>
    </div>
  );
};

// Spending Overview Skeleton
export const SpendingOverviewSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto relative">
              <Skeleton className="w-16 h-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-16 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Chart Skeleton
export const ChartSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full h-64 bg-white rounded-lg border border-gray-200 p-4",
        className,
      )}
    >
      <div className="h-full relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-6" />
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-10 mr-4 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-px w-full" />
            ))}
          </div>

          {/* Chart bars/line */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between space-x-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              />
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-10 right-4 flex justify-between mt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </div>
  );
};

// Loading Screen
export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = "Loading your financial data...",
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-sm mx-auto px-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-navy-600 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-xl font-bold text-white">BB</span>
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-teal-200 rounded-2xl animate-pulse mx-auto"></div>
        </div>

        {/* Loading message */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">{message}</h2>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-teal-500 h-1.5 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>

        {/* Loading indicators */}
        <div className="flex justify-center space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Page Skeleton
export const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <DashboardHeaderSkeleton />

      <div className="p-6 space-y-6">
        {/* Insights */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            <InsightCardSkeleton />
            <InsightCardSkeleton />
          </div>
        </div>

        {/* Spending Overview */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <SpendingOverviewSkeleton />
        </div>

        {/* Bills */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            <BillTileSkeleton />
            <BillTileSkeleton />
            <BillTileSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};
