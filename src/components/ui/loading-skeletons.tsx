import React from "react";
import { cn } from "@/lib/utils";
import { tokens } from "@/design-tokens";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "shimmer" | "pulse";
  rounded?: keyof typeof tokens.borderRadius;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "default",
  rounded = "md",
}) => {
  const baseClasses = cn(
    // Base skeleton styles using design tokens
    "relative overflow-hidden",
    `rounded-${rounded}`,
    "bg-gray-200 dark:bg-gray-700",
    {
      "animate-pulse": variant === "pulse",
      "animate-shimmer": variant === "shimmer",
    },
    className,
  );

  return (
    <div className={baseClasses}>
      {variant === "shimmer" && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(90deg, transparent, ${tokens.colors.neutral.white}20, transparent)`,
          }}
        />
      )}
    </div>
  );
};

// Bill Tile Skeleton
export const BillTileSkeleton: React.FC = () => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 space-y-4",
        `rounded-${tokens.components.card.borderRadius.replace("borderRadius.", "")}`,
      )}
      style={{
        borderRadius: tokens.components.card.borderRadius,
      }}
    >
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <Skeleton className="h-10 w-10" rounded="full" variant="shimmer" />
          {/* Name and category */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" variant="shimmer" />
            <Skeleton className="h-3 w-16" variant="shimmer" />
          </div>
        </div>
        {/* Status indicator */}
        <Skeleton className="h-8 w-8" rounded="sm" variant="pulse" />
      </div>

      {/* Content section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {/* Amount */}
          <Skeleton className="h-5 w-20" variant="shimmer" />
          {/* Due date */}
          <Skeleton className="h-3 w-16" variant="shimmer" />
        </div>
        {/* Action button */}
        <Skeleton className="h-6 w-16" rounded="full" variant="pulse" />
      </div>
    </div>
  );
};

// Dashboard Header Skeleton
export const DashboardHeaderSkeleton: React.FC = () => {
  return (
    <div
      className="bg-gradient-to-r from-navy-900 to-navy-800 p-6 pt-12"
      style={{
        background: `linear-gradient(135deg, ${tokens.colors.primary.navy[900]}, ${tokens.colors.primary.navy[800]})`,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {/* Profile avatar */}
          <Skeleton
            className="h-12 w-12 bg-white/10"
            rounded="full"
            variant="pulse"
          />
          <div className="space-y-2">
            {/* Welcome message */}
            <Skeleton className="h-4 w-32 bg-white/10" variant="shimmer" />
            {/* User name */}
            <Skeleton className="h-6 w-24 bg-white/10" variant="shimmer" />
          </div>
        </div>
        {/* Notification icon */}
        <Skeleton
          className="h-10 w-10 bg-white/10"
          rounded="lg"
          variant="pulse"
        />
      </div>

      {/* Balance card */}
      <div
        className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl"
        style={{
          borderRadius: tokens.borderRadius["2xl"],
          background: tokens.colors.opacity.glass,
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="space-y-3">
          <Skeleton className="h-4 w-28 bg-white/20" variant="shimmer" />
          <Skeleton className="h-8 w-40 bg-white/20" variant="shimmer" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20 bg-white/15" variant="pulse" />
            <Skeleton className="h-3 w-16 bg-white/15" variant="pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Chart Skeleton
export const ChartSkeleton: React.FC<{ height?: number }> = ({
  height = 200,
}) => {
  return (
    <div className="w-full p-4" style={{ height }}>
      <div className="flex items-end justify-between h-full space-x-2">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton
            key={i}
            className="w-full bg-gray-200 dark:bg-gray-700"
            style={{
              height: `${Math.random() * 80 + 20}%`,
              animationDelay: `${i * 0.1}s`,
            }}
            variant="shimmer"
            rounded="sm"
          />
        ))}
      </div>
    </div>
  );
};

// List Item Skeleton (for bills list)
export const ListItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-8 w-8" rounded="full" variant="pulse" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" variant="shimmer" />
          <Skeleton className="h-3 w-24" variant="shimmer" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-4 w-16" variant="shimmer" />
        <Skeleton className="h-3 w-12" variant="pulse" />
      </div>
    </div>
  );
};

// Calendar Day Skeleton
export const CalendarDaySkeleton: React.FC = () => {
  return (
    <div
      className="p-2 border border-gray-200 dark:border-gray-700 h-24"
      style={{
        borderRadius: tokens.borderRadius.md,
      }}
    >
      <div className="space-y-2">
        <Skeleton className="h-3 w-8" variant="pulse" />
        <div className="space-y-1">
          <Skeleton className="h-2 w-full" variant="shimmer" />
          <Skeleton className="h-2 w-3/4" variant="shimmer" />
        </div>
      </div>
    </div>
  );
};

// Grid of skeletons
export const SkeletonGrid: React.FC<{
  count?: number;
  children?: React.ReactNode;
}> = ({ count = 6, children }) => {
  if (children) {
    return (
      <div
        className="grid gap-6"
        style={{
          gap: tokens.layout.grid.gap,
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className="grid gap-6"
      style={{
        gap: tokens.layout.grid.gap,
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <BillTileSkeleton key={i} />
      ))}
    </div>
  );
};

// Loading Page Skeleton
export const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <DashboardHeaderSkeleton />

      {/* Content */}
      <div
        className="p-6 space-y-8"
        style={{
          padding: tokens.spacing[6],
        }}
      >
        {/* Navigation/Filters */}
        <div className="flex space-x-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-24"
              rounded="lg"
              variant="pulse"
            />
          ))}
        </div>

        {/* Content Grid */}
        <SkeletonGrid count={6} />
      </div>
    </div>
  );
};

export default Skeleton;
