import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "saving";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number; // Auto-dismiss after duration (ms)
  persistent?: boolean; // Don't auto-dismiss
}

interface SmartNotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center";
}

export const SmartNotifications: React.FC<SmartNotificationsProps> = ({
  notifications,
  onDismiss,
  position = "top-right",
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>(
    [],
  );

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!visibleNotifications.includes(notification.id)) {
        setVisibleNotifications((prev) => [...prev, notification.id]);

        // Auto-dismiss if duration is set and not persistent
        if (notification.duration && !notification.persistent) {
          setTimeout(() => {
            onDismiss(notification.id);
            setVisibleNotifications((prev) =>
              prev.filter((id) => id !== notification.id),
            );
          }, notification.duration);
        }
      }
    });
  }, [notifications, visibleNotifications, onDismiss]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      case "saving":
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getColors = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "saving":
        return "bg-emerald-50 border-emerald-200 text-emerald-800";
    }
  };

  const getIconColors = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      case "saving":
        return "text-emerald-500";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      default:
        return "top-4 right-4";
    }
  };

  const handleDismiss = (id: string) => {
    setVisibleNotifications((prev) => prev.filter((notifId) => notifId !== id));
    setTimeout(() => onDismiss(id), 300); // Delay to allow exit animation
  };

  return (
    <div className={cn("fixed z-50 pointer-events-none", getPositionClasses())}>
      <div className="space-y-3 w-80">
        <AnimatePresence>
          {notifications
            .filter((notif) => visibleNotifications.includes(notif.id))
            .map((notification) => (
              <motion.div
                key={notification.id}
                initial={{
                  opacity: 0,
                  y: position.includes("bottom") ? 50 : -50,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: position.includes("bottom") ? 50 : -50,
                  scale: 0.9,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "pointer-events-auto rounded-lg border p-4 shadow-lg backdrop-blur-sm",
                  getColors(notification.type),
                )}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={cn(
                      "flex-shrink-0",
                      getIconColors(notification.type),
                    )}
                  >
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">
                      {notification.title}
                    </h4>
                    <p className="text-sm mt-1 opacity-90">
                      {notification.message}
                    </p>

                    {notification.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 text-xs border-current hover:bg-current/10"
                        onClick={notification.action.onClick}
                      >
                        {notification.action.label}
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(notification.id)}
                    className="p-1 h-auto hover:bg-current/10 flex-shrink-0"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Hook for managing notifications
export const useSmartNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const removeAllNotifications = () => {
    setNotifications([]);
  };

  // Convenience methods
  const notifySuccess = (
    title: string,
    message: string,
    action?: Notification["action"],
  ) => {
    return addNotification({ type: "success", title, message, action });
  };

  const notifyWarning = (
    title: string,
    message: string,
    action?: Notification["action"],
  ) => {
    return addNotification({
      type: "warning",
      title,
      message,
      action,
      persistent: true,
    });
  };

  const notifyInfo = (
    title: string,
    message: string,
    action?: Notification["action"],
  ) => {
    return addNotification({ type: "info", title, message, action });
  };

  const notifySaving = (
    title: string,
    message: string,
    action?: Notification["action"],
  ) => {
    return addNotification({ type: "saving", title, message, action });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    removeAllNotifications,
    notifySuccess,
    notifyWarning,
    notifyInfo,
    notifySaving,
  };
};
