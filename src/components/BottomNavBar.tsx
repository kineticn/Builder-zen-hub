import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Activity, Gift, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="h-5 w-5" />,
    path: "/dashboard",
  },
  {
    id: "activity",
    label: "Activity",
    icon: <Activity className="h-5 w-5" />,
    path: "/activity",
  },
  {
    id: "offers",
    label: "Offers",
    icon: <Gift className="h-5 w-5" />,
    path: "/offers",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    path: "/settings",
  },
];

export const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 glass">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center",
                "min-h-touch min-w-touch",
                "px-3 py-2 rounded-lg",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1",
                isActive
                  ? "text-teal-600 bg-teal-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
              )}
              aria-label={`Navigate to ${item.label}`}
            >
              <div
                className={cn(
                  "transition-transform duration-200",
                  isActive ? "scale-110" : "scale-100",
                )}
              >
                {item.icon}
              </div>
              <span className={cn("text-xs font-medium mt-1", "leading-none")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
