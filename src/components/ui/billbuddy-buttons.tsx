import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

interface SecondaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

interface LinkButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  loading = false,
  size = "md",
  className,
  disabled,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "bg-gradient-to-r from-teal-400 to-teal-500",
        "hover:from-teal-500 hover:to-teal-600",
        "text-white font-semibold",
        "transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
        {
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4 text-base": size === "md",
          "h-12 px-6 text-lg": size === "lg",
        },
        className,
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  loading = false,
  size = "md",
  className,
  disabled,
  ...props
}) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "border-2 border-teal-400 text-teal-600",
        "hover:bg-teal-50 hover:border-teal-500",
        "font-semibold transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
        {
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4 text-base": size === "md",
          "h-12 px-6 text-lg": size === "lg",
        },
        className,
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  loading = false,
  size = "md",
  className,
  disabled,
  ...props
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "text-teal-600 hover:text-teal-700",
        "hover:bg-teal-50 font-medium",
        "transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
        {
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4 text-base": size === "md",
          "h-12 px-6 text-lg": size === "lg",
        },
        className,
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};
