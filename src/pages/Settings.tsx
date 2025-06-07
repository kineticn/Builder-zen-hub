import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Download,
  Trash2,
  Crown,
  ChevronRight,
  Star,
  LogOut,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SettingItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: "toggle" | "navigation" | "action";
  value?: boolean;
  action?: () => void;
  navigateTo?: string;
  description?: string;
  danger?: boolean;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    billReminders: true,
    paymentConfirmations: true,
    specialOffers: false,
    systemUpdates: true,
  });

  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    plan: "Premium",
    avatar: "",
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleUpgrade = () => {
    // Navigate to upgrade flow
    console.log("Navigate to upgrade");
  };

  const handleExportData = () => {
    // Generate user data export
    const userData = {
      profile: {
        name: userInfo.name,
        email: userInfo.email,
        plan: userInfo.plan,
        exportDate: new Date().toISOString(),
      },
      settings: {
        notifications: notifications,
      },
      note: "This is a sample data export. In a real app, this would include all user bills, payments, and transaction history.",
    };

    const dataContent = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataContent], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `billbuddy-data-export-${new Date().toISOString().split("T")[0]}.json`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log("Deleting account...");
  };

  const handleLogout = () => {
    // Handle logout
    navigate("/onboarding");
  };

  const notificationSettings: SettingItem[] = [
    {
      id: "bill-reminders",
      label: "Bill Reminders",
      icon: <Bell className="h-5 w-5" />,
      type: "toggle",
      value: notifications.billReminders,
      action: () => handleToggleNotification("billReminders"),
      description: "Get notified before bills are due",
    },
    {
      id: "payment-confirmations",
      label: "Payment Confirmations",
      icon: <Shield className="h-5 w-5" />,
      type: "toggle",
      value: notifications.paymentConfirmations,
      action: () => handleToggleNotification("paymentConfirmations"),
      description: "Receive confirmation after payments",
    },
    {
      id: "special-offers",
      label: "Special Offers",
      icon: <Star className="h-5 w-5" />,
      type: "toggle",
      value: notifications.specialOffers,
      action: () => handleToggleNotification("specialOffers"),
      description: "Get notified about deals and promotions",
    },
    {
      id: "system-updates",
      label: "System Updates",
      icon: <Download className="h-5 w-5" />,
      type: "toggle",
      value: notifications.systemUpdates,
      action: () => handleToggleNotification("systemUpdates"),
      description: "Important app updates and maintenance",
    },
  ];

  const accountSettings: SettingItem[] = [
    {
      id: "edit-profile",
      label: "Edit Profile",
      icon: <User className="h-5 w-5" />,
      type: "navigation",
      navigateTo: "/profile/edit",
    },
    {
      id: "export-data",
      label: "Export Data",
      icon: <Download className="h-5 w-5" />,
      type: "action",
      action: handleExportData,
      description: "Download your bill and payment history",
    },
    {
      id: "logout",
      label: "Sign Out",
      icon: <LogOut className="h-5 w-5" />,
      type: "action",
      action: handleLogout,
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    const baseClassName = cn(
      "flex items-center justify-between p-4",
      "hover:bg-gray-50 transition-colors",
      item.danger && "hover:bg-red-50",
    );

    const content = (
      <div className={baseClassName}>
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              item.danger
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600",
            )}
          >
            {item.icon}
          </div>
          <div>
            <p
              className={cn(
                "font-medium",
                item.danger ? "text-red-600" : "text-gray-900",
              )}
            >
              {item.label}
            </p>
            {item.description && (
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          {item.type === "toggle" && (
            <Switch
              checked={item.value}
              onCheckedChange={() => item.action?.()}
              aria-label={`Toggle ${item.label}`}
            />
          )}
          {item.type === "navigation" && (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
    );

    if (item.type === "navigation") {
      return (
        <button
          key={item.id}
          onClick={() => navigate(item.navigateTo!)}
          className="w-full text-left focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset rounded-lg"
        >
          {content}
        </button>
      );
    }

    if (item.type === "action") {
      return (
        <button
          key={item.id}
          onClick={item.action}
          className="w-full text-left focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset rounded-lg"
        >
          {content}
        </button>
      );
    }

    return <div key={item.id}>{content}</div>;
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
            Settings
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                <AvatarFallback className="bg-teal-100 text-teal-700 text-xl font-medium">
                  {userInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-gray-900 font-display">
                    {userInfo.name}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
                  >
                    <Crown className="h-3 w-3 mr-1" />
                    {userInfo.plan}
                  </Badge>
                </div>
                <p className="text-gray-600 mt-1">{userInfo.email}</p>

                {userInfo.plan === "Free" && (
                  <Button
                    onClick={handleUpgrade}
                    size="sm"
                    className="mt-3 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 font-display">
                Notifications
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage how you receive updates
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {notificationSettings.map(renderSettingItem)}
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 font-display">
                Account
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage your account and data
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {accountSettings.map(renderSettingItem)}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-red-100">
              <h3 className="font-semibold text-red-600 font-display">
                Danger Zone
              </h3>
              <p className="text-sm text-red-500 mt-1">
                Actions that cannot be undone
              </p>
            </div>
            <div className="p-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg text-red-600">
                        <Trash2 className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-red-600">
                          Delete Account
                        </p>
                        <p className="text-sm text-red-500 mt-1">
                          Permanently delete your account and all data
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-red-400" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center space-y-2 pt-6">
          <p className="text-sm text-gray-500">BillBuddy v1.0.0</p>
          <p className="text-xs text-gray-400">
            © 2024 BillBuddy Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default Settings;
