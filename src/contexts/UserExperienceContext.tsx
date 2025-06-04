import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSmartNotifications } from "@/components/SmartNotifications";
import { SmartInsightsEngine } from "@/lib/smart-insights";

interface UserPreferences {
  theme: "light" | "dark" | "system";
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: "small" | "medium" | "large";
  notifications: {
    billReminders: boolean;
    paymentConfirmations: boolean;
    insights: boolean;
    promotions: boolean;
  };
  dashboard: {
    showInsights: boolean;
    showSpendingOverview: boolean;
    defaultView: "all" | "due" | "upcoming";
    compactMode: boolean;
  };
  privacy: {
    analytics: boolean;
    personalization: boolean;
    dataSharing: boolean;
  };
}

interface UserBehavior {
  lastActiveDate: Date;
  sessionCount: number;
  featuresUsed: string[];
  timeSpentInApp: number; // minutes
  paymentMethod: "manual" | "autopay" | "mixed";
  engagementLevel: "low" | "medium" | "high";
  preferredInteractionTime: "morning" | "afternoon" | "evening";
}

interface UserProfile {
  id: string;
  firstName: string;
  email: string;
  joinDate: Date;
  monthlyIncome?: number;
  billFrequency: "weekly" | "monthly" | "varies";
  financialGoals: Array<{
    type:
      | "save_money"
      | "automate_bills"
      | "reduce_late_fees"
      | "budget_better";
    target?: number;
    deadline?: Date;
    progress?: number;
  }>;
  preferences: UserPreferences;
  behavior: UserBehavior;
}

interface UserExperienceContextType {
  userProfile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  getPersonalizedContent: () => any[];
  isOnboardingComplete: boolean;
  shouldShowFeature: (featureName: string) => boolean;
  getAdaptiveUI: () => {
    animationDuration: number;
    showAnimations: boolean;
    colorScheme: string;
  };
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  reducedMotion: false,
  highContrast: false,
  fontSize: "medium",
  notifications: {
    billReminders: true,
    paymentConfirmations: true,
    insights: true,
    promotions: false,
  },
  dashboard: {
    showInsights: true,
    showSpendingOverview: true,
    defaultView: "due",
    compactMode: false,
  },
  privacy: {
    analytics: true,
    personalization: true,
    dataSharing: false,
  },
};

const UserExperienceContext = createContext<UserExperienceContextType | null>(
  null,
);

export const useUserExperience = () => {
  const context = useContext(UserExperienceContext);
  if (!context) {
    throw new Error(
      "useUserExperience must be used within a UserExperienceProvider",
    );
  }
  return context;
};

interface UserExperienceProviderProps {
  children: ReactNode;
}

export const UserExperienceProvider: React.FC<UserExperienceProviderProps> = ({
  children,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { notifyInfo, notifySuccess } = useSmartNotifications();

  // Load user profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("billbuddy_user_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile({
          ...parsed,
          joinDate: new Date(parsed.joinDate),
          behavior: {
            ...parsed.behavior,
            lastActiveDate: new Date(parsed.behavior.lastActiveDate),
          },
        });
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    } else {
      // Create default profile if none exists
      const defaultProfile: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        firstName: localStorage.getItem("billbuddy_user_name") || "User",
        email: "",
        joinDate: new Date(),
        billFrequency: "monthly",
        financialGoals: [],
        preferences: defaultPreferences,
        behavior: {
          lastActiveDate: new Date(),
          sessionCount: 1,
          featuresUsed: [],
          timeSpentInApp: 0,
          paymentMethod: "manual",
          engagementLevel: "medium",
          preferredInteractionTime: "evening",
        },
      };
      setUserProfile(defaultProfile);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(
        "billbuddy_user_profile",
        JSON.stringify(userProfile),
      );
    }
  }, [userProfile]);

  // Track user activity
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      if (userProfile) {
        const sessionTime = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
        updateProfile({
          behavior: {
            ...userProfile.behavior,
            lastActiveDate: new Date(),
            timeSpentInApp: userProfile.behavior.timeSpentInApp + sessionTime,
          },
        });
      }
    };
  }, [userProfile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!userProfile) return;

    setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    if (!userProfile) return;

    setUserProfile((prev) =>
      prev
        ? {
            ...prev,
            preferences: { ...prev.preferences, ...updates },
          }
        : null,
    );

    // Notify user of preference changes
    notifySuccess(
      "Preferences Updated",
      "Your settings have been saved successfully.",
    );
  };

  const trackEvent = (event: string, properties?: Record<string, any>) => {
    if (!userProfile || !userProfile.preferences.privacy.analytics) return;

    // Update behavior tracking
    const updatedBehavior = {
      ...userProfile.behavior,
      featuresUsed: [...new Set([...userProfile.behavior.featuresUsed, event])],
      sessionCount:
        userProfile.behavior.sessionCount + (event === "session_start" ? 1 : 0),
    };

    updateProfile({ behavior: updatedBehavior });

    // In a real app, you'd send this to your analytics service
    console.log("Event tracked:", event, properties);
  };

  const getPersonalizedContent = () => {
    if (!userProfile) return [];

    const content = [];

    // Personalized tips based on user behavior
    if (userProfile.behavior.engagementLevel === "low") {
      content.push({
        type: "tip",
        title: "Quick Tip",
        content: "Set up autopay for your recurring bills to save time!",
        priority: "high",
      });
    }

    // Goal-based content
    userProfile.financialGoals.forEach((goal) => {
      if (goal.type === "save_money") {
        content.push({
          type: "insight",
          title: "Savings Opportunity",
          content: "We found 3 ways to reduce your monthly bills by $45.",
          priority: "medium",
        });
      }
    });

    // Time-based content
    const hour = new Date().getHours();
    if (
      hour >= 9 &&
      hour <= 11 &&
      userProfile.behavior.preferredInteractionTime === "morning"
    ) {
      content.push({
        type: "greeting",
        title: "Good Morning!",
        content: "Ready to tackle your bills for the day?",
        priority: "low",
      });
    }

    return content.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const isOnboardingComplete = () => {
    return Boolean(localStorage.getItem("billbuddy_onboarding_complete"));
  };

  const shouldShowFeature = (featureName: string) => {
    if (!userProfile) return false;

    // Feature gating based on user behavior and preferences
    const featureGates = {
      advanced_insights: userProfile.behavior.sessionCount >= 5,
      bill_optimization:
        userProfile.behavior.featuresUsed.includes("bill_detail_view"),
      spending_trends: userProfile.behavior.timeSpentInApp >= 30,
      autopay_suggestions: userProfile.behavior.paymentMethod === "manual",
      goal_tracking: userProfile.financialGoals.length > 0,
    };

    return featureGates[featureName] || false;
  };

  const getAdaptiveUI = () => {
    if (!userProfile) {
      return {
        animationDuration: 200,
        showAnimations: true,
        colorScheme: "light",
      };
    }

    const { preferences, behavior } = userProfile;

    return {
      animationDuration: preferences.reducedMotion ? 0 : 200,
      showAnimations:
        !preferences.reducedMotion && behavior.engagementLevel !== "low",
      colorScheme:
        preferences.theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : preferences.theme,
    };
  };

  const value: UserExperienceContextType = {
    userProfile,
    updateProfile,
    updatePreferences,
    trackEvent,
    getPersonalizedContent,
    isOnboardingComplete: isOnboardingComplete(),
    shouldShowFeature,
    getAdaptiveUI,
  };

  return (
    <UserExperienceContext.Provider value={value}>
      {children}
    </UserExperienceContext.Provider>
  );
};

// Custom hooks for specific UX features
export const usePersonalization = () => {
  const { userProfile, getPersonalizedContent, trackEvent } =
    useUserExperience();

  const getPersonalizedGreeting = () => {
    if (!userProfile) return "Welcome!";

    const hour = new Date().getHours();
    const timeOfDay =
      hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

    return `Good ${timeOfDay}, ${userProfile.firstName}!`;
  };

  const getPersonalizedTips = () => {
    return getPersonalizedContent().filter((item) => item.type === "tip");
  };

  const trackPersonalizedAction = (action: string) => {
    trackEvent("personalized_action", { action });
  };

  return {
    getPersonalizedGreeting,
    getPersonalizedTips,
    trackPersonalizedAction,
  };
};

export const useAccessibility = () => {
  const { userProfile, updatePreferences } = useUserExperience();

  const preferences = userProfile?.preferences || defaultPreferences;

  const toggleReducedMotion = () => {
    updatePreferences({ reducedMotion: !preferences.reducedMotion });
  };

  const toggleHighContrast = () => {
    updatePreferences({ highContrast: !preferences.highContrast });
  };

  const setFontSize = (size: "small" | "medium" | "large") => {
    updatePreferences({ fontSize: size });
  };

  return {
    preferences,
    toggleReducedMotion,
    toggleHighContrast,
    setFontSize,
  };
};

export const useEngagement = () => {
  const { userProfile, trackEvent } = useUserExperience();

  const trackInteraction = (component: string, action: string) => {
    trackEvent("user_interaction", { component, action });
  };

  const trackFeatureUsage = (feature: string) => {
    trackEvent("feature_usage", { feature });
  };

  const getEngagementLevel = () => {
    return userProfile?.behavior.engagementLevel || "medium";
  };

  return {
    trackInteraction,
    trackFeatureUsage,
    getEngagementLevel,
  };
};
