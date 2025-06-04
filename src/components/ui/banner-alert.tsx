import React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BannerAlertProps {
  type: "info" | "success" | "error" | "warning";
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const alertConfig = {
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-800",
    iconClassName: "text-blue-500",
  },
  success: {
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 text-green-800",
    iconClassName: "text-green-500",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-800",
    iconClassName: "text-red-500",
  },
  warning: {
    icon: AlertCircle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-800",
    iconClassName: "text-yellow-500",
  },
};

export const BannerAlert: React.FC<BannerAlertProps> = ({
  type,
  title,
  message,
  dismissible = false,
  onDismiss,
  action,
  className,
}) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <Alert className={cn("border", config.className, className)}>
      <div className="flex items-start space-x-3">
        <Icon
          className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.iconClassName)}
        />

        <div className="flex-1 min-w-0">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <AlertDescription className="text-sm">{message}</AlertDescription>

          {action && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className={cn(
                  "border-current text-current hover:bg-current/10",
                  type === "info" && "border-blue-600 text-blue-600",
                  type === "success" && "border-green-600 text-green-600",
                  type === "error" && "border-red-600 text-red-600",
                  type === "warning" && "border-yellow-600 text-yellow-600",
                )}
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>

        {dismissible && onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="p-1 h-auto hover:bg-current/10"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
};
