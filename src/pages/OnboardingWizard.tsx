import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Scan,
  CheckCircle,
  Sparkles,
  Brain,
  Shield,
  Zap,
  Star,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  FileText,
  Lock,
  AlertTriangle,
  ExternalLink,
  Calendar,
  MapPin,
  Globe,
  Mail,
  Building,
  Home,
  UserCheck,
  CreditCard,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingState {
  step: number;
  quickStartMethod: "bank" | "gmail" | "manual" | "";
  email: string;
  firstName: string;
  monthlyIncome: string;
  billFrequency: "weekly" | "monthly" | "varies";
  householdType: "home" | "rental" | "parents" | "shared" | "";
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  ocrText: string;
  legalAgreements: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    electronicConsent: boolean;
    plaidTerms: boolean;
    dataSharing: boolean;
    communicationConsent: boolean;
  };
  agreementTimestamps: {
    [key: string]: string;
  };
  isComplete: boolean;
  hasSeenTips: boolean;
  discoveredBills: Array<{
    id: string;
    name: string;
    amount: number;
    confidence: number;
    source: "plaid" | "gmail" | "suggestion";
  }>;
}

interface Tip {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface LegalAgreement {
  id: keyof OnboardingState["legalAgreements"];
  title: string;
  description: string;
  required: boolean;
  documentUrl: string;
  version: string;
  category: "core" | "banking" | "privacy" | "communication";
}

const legalAgreements: LegalAgreement[] = [
  {
    id: "termsOfService",
    title: "Terms of Service",
    description:
      "Our core terms governing your use of BillBuddy services, including account management, bill automation, and payment processing.",
    required: true,
    documentUrl: "/legal/terms-of-service",
    version: "2.1",
    category: "core",
  },
  {
    id: "privacyPolicy",
    title: "Privacy Policy",
    description:
      "How we collect, use, store, and protect your personal and financial information in compliance with applicable privacy laws.",
    required: true,
    documentUrl: "/legal/privacy-policy",
    version: "1.8",
    category: "privacy",
  },
  {
    id: "electronicConsent",
    title: "Electronic Consent Agreement (E-SIGN)",
    description:
      "Consent to receive all communications, agreements, and disclosures electronically instead of paper documents.",
    required: true,
    documentUrl: "/legal/electronic-consent",
    version: "1.3",
    category: "core",
  },
  {
    id: "plaidTerms",
    title: "Bank Connection Terms (Plaid)",
    description:
      "Agreement for secure bank account connections through our third-party provider Plaid, including data access permissions.",
    required: true,
    documentUrl: "/legal/plaid-terms",
    version: "3.2",
    category: "banking",
  },
  {
    id: "dataSharing",
    title: "Data Sharing Agreement",
    description:
      "Optional consent for sharing anonymized financial insights to improve our services and provide personalized recommendations.",
    required: false,
    documentUrl: "/legal/data-sharing",
    version: "1.1",
    category: "privacy",
  },
  {
    id: "communicationConsent",
    title: "Marketing Communications",
    description:
      "Optional consent to receive promotional emails, product updates, and financial tips from BillBuddy.",
    required: false,
    documentUrl: "/legal/marketing-consent",
    version: "1.0",
    category: "communication",
  },
];

const tips: Tip[] = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "AI-Powered Discovery",
    description:
      "Connect your bank or email and we'll find 70%+ of your bills automatically",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "30-Second Setup",
    description: "Get value immediately - detailed setup can wait until later",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Bank-Level Security",
    description:
      "We use Plaid—bank-level security with read-only access to your data",
    color: "bg-green-100 text-green-600",
  },
];

const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<OnboardingState>({
    step: 1,
    quickStartMethod: "",
    email: "",
    firstName: "",
    monthlyIncome: "",
    billFrequency: "monthly",
    householdType: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    ocrText: "",
    legalAgreements: {
      termsOfService: false,
      privacyPolicy: false,
      electronicConsent: false,
      plaidTerms: false,
      dataSharing: false,
      communicationConsent: false,
    },
    agreementTimestamps: {},
    isComplete: false,
    hasSeenTips: false,
    discoveredBills: [],
  });
  const [currentTip, setCurrentTip] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateState = (updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (state.step < 7) {
      updateState({ step: state.step + 1 });
    }
  };

  const goToDashboard = () => {
    // Record final completion timestamp
    const completionData = {
      userId: Math.random().toString(36).substr(2, 9),
      completedAt: new Date().toISOString(),
      agreements: state.legalAgreements,
      agreementTimestamps: state.agreementTimestamps,
      ipAddress: "127.0.0.1",
      userAgent: navigator.userAgent,
      quickStartMethod: state.quickStartMethod,
      householdType: state.householdType,
      discoveredBills: state.discoveredBills,
    };

    localStorage.setItem(
      "billbuddy_legal_compliance",
      JSON.stringify(completionData),
    );
    localStorage.setItem("billbuddy_onboarding_complete", "true");
    localStorage.setItem("billbuddy_user_name", state.firstName);
    localStorage.setItem("billbuddy_household_type", state.householdType);

    navigate("/dashboard");
  };

  const handleAgreementChange = (
    agreementId: keyof OnboardingState["legalAgreements"],
    checked: boolean,
  ) => {
    const newAgreements = {
      ...state.legalAgreements,
      [agreementId]: checked,
    };

    const newTimestamps = checked
      ? {
          ...state.agreementTimestamps,
          [agreementId]: new Date().toISOString(),
        }
      : state.agreementTimestamps;

    updateState({
      legalAgreements: newAgreements,
      agreementTimestamps: newTimestamps,
    });
  };

  // Auto-cycle tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-populate address from GPS/device
  useEffect(() => {
    if (state.quickStartMethod && !state.address.zip) {
      // Simulate location detection
      setTimeout(() => {
        updateState({
          address: {
            street: "",
            city: "San Francisco",
            state: "CA",
            zip: "94105",
          },
        });
      }, 1000);
    }
  }, [state.quickStartMethod]);

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <QuickStartStep
            onNext={nextStep}
            state={state}
            updateState={updateState}
            currentTip={currentTip}
          />
        );
      case 2:
        return (
          <BillDiscoveryStep
            onNext={nextStep}
            state={state}
            updateState={updateState}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <HouseholdSetupStep
            onNext={nextStep}
            state={state}
            updateState={updateState}
          />
        );
      case 4:
        return (
          <PersonalizationStep
            onNext={nextStep}
            state={state}
            updateState={updateState}
          />
        );
      case 5:
        return (
          <LegalAgreementsStep
            onNext={nextStep}
            state={state}
            onAgreementChange={handleAgreementChange}
          />
        );
      case 6:
        return (
          <AccountStep
            onNext={nextStep}
            email={state.email}
            setEmail={(email) => updateState({ email })}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        );
      case 7:
        return (
          <CompletionStep
            onComplete={goToDashboard}
            firstName={state.firstName}
            discoveredBills={state.discoveredBills}
          />
        );
      default:
        return (
          <QuickStartStep
            onNext={nextStep}
            state={state}
            updateState={updateState}
            currentTip={currentTip}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-teal-50 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-navy-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-teal-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Progress Bar */}
      <motion.div
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProgressBar current={state.step} total={7} showSteps />
        <div className="flex justify-center mt-2">
          <div className="flex space-x-2">
            {Array.from({ length: 7 }, (_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i < state.step ? "bg-teal-500" : "bg-gray-200",
                )}
                animate={{
                  scale: i === state.step - 1 ? 1.2 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Step 1: Quick Start - Progressive Data Capture
const QuickStartStep: React.FC<{
  onNext: () => void;
  currentTip: number;
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
}> = ({ onNext, currentTip, state, updateState }) => {
  const handleQuickStart = (method: "bank" | "gmail" | "manual") => {
    updateState({ quickStartMethod: method });
    setTimeout(onNext, 500); // Brief delay for visual feedback
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto space-y-8">
        {/* Animated Logo */}
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-teal-400 to-navy-600 rounded-2xl flex items-center justify-center mx-auto relative"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-xl font-bold text-white">BB</span>
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-2.5 w-2.5 text-yellow-700" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="space-y-4">
          <motion.h1
            className="text-3xl font-bold text-navy-900 font-display"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to BillBuddy
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Get value in under 30 seconds. Choose your fastest setup method:
          </motion.p>
        </div>

        {/* Quick Start Options */}
        <motion.div
          className="space-y-3 w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={() => handleQuickStart("bank")}
            className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">
                  Connect Bank Account
                </p>
                <p className="text-sm text-gray-500">
                  Auto-discover 70%+ of your bills
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">Recommended</Badge>
          </motion.button>

          <motion.button
            onClick={() => handleQuickStart("gmail")}
            className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Connect Email</p>
                <p className="text-sm text-gray-500">
                  Find e-bills from Gmail/Outlook
                </p>
              </div>
            </div>
            <Badge variant="secondary">Fast</Badge>
          </motion.button>

          <motion.button
            onClick={() => handleQuickStart("manual")}
            className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Manual Setup</p>
                <p className="text-sm text-gray-500">
                  Start fresh, add bills later
                </p>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Rotating Tips */}
        <motion.div
          className="h-16 flex items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200"
            >
              <div className={cn("p-1.5 rounded-lg", tips[currentTip].color)}>
                {tips[currentTip].icon}
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 text-xs">
                  {tips[currentTip].title}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {tips[currentTip].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="flex items-center justify-center space-x-4 text-xs text-gray-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Bank-level security</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>50,000+ users</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>4.9/5 rating</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Step 2: Bill Discovery with Smart Suggestions
const BillDiscoveryStep: React.FC<{
  onNext: () => void;
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}> = ({ onNext, state, updateState, setIsLoading, isLoading }) => {
  const [discoveredBills, setDiscoveredBills] = useState<
    OnboardingState["discoveredBills"]
  >([]);
  const [hasStartedDiscovery, setHasStartedDiscovery] = useState(false);

  const mockDiscovery = () => {
    setIsLoading(true);
    setHasStartedDiscovery(true);

    // Simulate progressive discovery
    const bills = [
      {
        id: "1",
        name: "PG&E Electric",
        amount: 125.5,
        confidence: 95,
        source: "plaid" as const,
      },
      {
        id: "2",
        name: "Comcast Internet",
        amount: 79.99,
        confidence: 92,
        source: "plaid" as const,
      },
      {
        id: "3",
        name: "Netflix",
        amount: 15.99,
        confidence: 88,
        source: "gmail" as const,
      },
      {
        id: "4",
        name: "Spotify Premium",
        amount: 9.99,
        confidence: 85,
        source: "gmail" as const,
      },
      {
        id: "5",
        name: "State Farm Insurance",
        amount: 89.0,
        confidence: 78,
        source: "suggestion" as const,
      },
    ];

    bills.forEach((bill, index) => {
      setTimeout(
        () => {
          setDiscoveredBills((prev) => [...prev, bill]);
        },
        (index + 1) * 800,
      );
    });

    setTimeout(
      () => {
        setIsLoading(false);
        updateState({ discoveredBills: bills });
      },
      bills.length * 800 + 1000,
    );
  };

  const startDiscovery = () => {
    if (state.quickStartMethod === "bank") {
      mockDiscovery();
    } else if (state.quickStartMethod === "gmail") {
      // Gmail OAuth simulation
      setTimeout(() => {
        mockDiscovery();
      }, 1500);
    } else {
      onNext();
    }
  };

  const confirmBill = (billId: string) => {
    setDiscoveredBills((prev) =>
      prev.map((bill) =>
        bill.id === billId ? { ...bill, confidence: 100 } : bill,
      ),
    );
  };

  const removeBill = (billId: string) => {
    setDiscoveredBills((prev) => prev.filter((bill) => bill.id !== billId));
  };

  if (!hasStartedDiscovery) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-sm mx-auto space-y-6">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="h-8 w-8 text-teal-600" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              Discover Your Bills
            </h2>
            <p className="text-gray-600">
              {state.quickStartMethod === "bank" &&
                "We'll analyze your transactions to find recurring bills"}
              {state.quickStartMethod === "gmail" &&
                "We'll scan your email for e-bills and subscriptions"}
              {state.quickStartMethod === "manual" &&
                "Skip discovery and add bills manually"}
            </p>
          </div>

          {state.quickStartMethod !== "manual" && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-left">
              <div className="flex items-start space-x-2">
                <Lightbulb className="h-4 w-4 text-teal-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-teal-800">
                    What we'll access:
                  </p>
                  <ul className="text-teal-700 mt-1 space-y-1">
                    {state.quickStartMethod === "bank" && (
                      <>
                        <li>• Transaction history (read-only)</li>
                        <li>• Account balances</li>
                        <li>• Recurring payment patterns</li>
                      </>
                    )}
                    {state.quickStartMethod === "gmail" && (
                      <>
                        <li>• E-bills and receipts</li>
                        <li>• Subscription confirmations</li>
                        <li>• Payment notifications</li>
                      </>
                    )}
                  </ul>
                  <p className="text-xs text-teal-600 mt-2">
                    We use Plaid—bank-level security, read-only access
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={startDiscovery}
            className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
          >
            {state.quickStartMethod === "bank" && "Connect Bank Account"}
            {state.quickStartMethod === "gmail" && "Connect Email"}
            {state.quickStartMethod === "manual" && "Skip Discovery"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-md mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Smart Bill Discovery
          </h2>
          <p className="text-gray-600">
            {isLoading
              ? "Analyzing your data to find bills..."
              : `Found ${discoveredBills.length} potential bills`}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-gray-200 h-16 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {discoveredBills.map((bill, index) => (
              <motion.div
                key={bill.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {bill.name}
                      </h3>
                      <Badge
                        variant={
                          bill.source === "plaid"
                            ? "default"
                            : bill.source === "gmail"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {bill.source === "plaid"
                          ? "Bank"
                          : bill.source === "gmail"
                            ? "Email"
                            : "Suggested"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-lg font-bold text-gray-900">
                        ${bill.amount.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {bill.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeBill(bill.id)}
                    >
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => confirmBill(bill.id)}
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && (
          <Button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
          >
            Continue with {discoveredBills.length} Bills
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

// Step 3: Household Setup
const HouseholdSetupStep: React.FC<{
  onNext: () => void;
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
}> = ({ onNext, state, updateState }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const householdTypes = [
    {
      value: "home",
      label: "Primary Home",
      icon: <Home className="h-5 w-5" />,
      description: "Your main residence",
    },
    {
      value: "rental",
      label: "Rental Property",
      icon: <Building className="h-5 w-5" />,
      description: "Apartment or rental home",
    },
    {
      value: "shared",
      label: "Shared Living",
      icon: <Users className="h-5 w-5" />,
      description: "Roommates or shared expenses",
    },
    {
      value: "parents",
      label: "Parents' House",
      icon: <UserCheck className="h-5 w-5" />,
      description: "Living with family",
    },
  ];

  const validateAndNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!state.householdType) {
      newErrors.household = "Please select your household type";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-md mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Household Context
          </h2>
          <p className="text-gray-600">
            Help us organize your bills by household type
          </p>
        </div>

        <div className="space-y-3">
          {householdTypes.map((type) => (
            <motion.label
              key={type.value}
              className={cn(
                "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                state.householdType === type.value
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300 bg-white",
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                value={type.value}
                checked={state.householdType === type.value}
                onChange={(e) => {
                  updateState({ householdType: e.target.value as any });
                  if (errors.household)
                    setErrors((prev) => ({ ...prev, household: "" }));
                }}
                className="sr-only"
              />
              <div
                className={cn(
                  "p-2 rounded-lg",
                  state.householdType === type.value
                    ? "bg-teal-100 text-teal-600"
                    : "bg-gray-100 text-gray-600",
                )}
              >
                {type.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{type.label}</h3>
                <p className="text-sm text-gray-500">{type.description}</p>
              </div>
            </motion.label>
          ))}
        </div>

        {/* Address Auto-populate */}
        {state.address.zip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Location detected
              </span>
            </div>
            <p className="text-sm text-green-700">
              {state.address.city}, {state.address.state} {state.address.zip}
            </p>
          </motion.div>
        )}

        {errors.household && (
          <p className="text-sm text-red-600">{errors.household}</p>
        )}

        <Button
          onClick={validateAndNext}
          className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 4: Personalization (Enhanced)
const PersonalizationStep: React.FC<{
  onNext: () => void;
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
}> = ({ onNext, state, updateState }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!state.firstName.trim()) {
      newErrors.firstName = "Please enter your first name";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-sm mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
        <motion.div
          className="text-center space-y-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Personalize Your Experience
          </h2>
          <p className="text-gray-600">
            Help us tailor BillBuddy to your needs
          </p>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* First Name */}
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              What should we call you? *
            </label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={state.firstName}
              onChange={(e) => {
                updateState({ firstName: e.target.value });
                if (errors.firstName)
                  setErrors((prev) => ({ ...prev, firstName: "" }));
              }}
              className={cn(
                "w-full transition-all duration-200",
                errors.firstName
                  ? "border-red-300 focus:border-red-500"
                  : "focus:border-teal-500",
              )}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Monthly Income */}
          <div className="space-y-2">
            <label
              htmlFor="income"
              className="text-sm font-medium text-gray-700"
            >
              Monthly income (optional but recommended)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="income"
                type="number"
                placeholder="5,000"
                value={state.monthlyIncome}
                onChange={(e) => updateState({ monthlyIncome: e.target.value })}
                className="w-full pl-10 transition-all duration-200 focus:border-teal-500"
              />
            </div>
            <p className="text-xs text-gray-500">
              💡 This helps us provide personalized budgeting insights
            </p>
          </div>

          {/* Bill Frequency */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              How often do you typically pay bills?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  value: "weekly",
                  label: "Weekly",
                  icon: <Clock className="h-4 w-4" />,
                },
                {
                  value: "monthly",
                  label: "Monthly",
                  icon: <TrendingUp className="h-4 w-4" />,
                },
                {
                  value: "varies",
                  label: "It varies",
                  icon: <Users className="h-4 w-4" />,
                },
              ].map((option) => (
                <motion.label
                  key={option.value}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                    state.billFrequency === option.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={state.billFrequency === option.value}
                    onChange={(e) =>
                      updateState({ billFrequency: e.target.value as any })
                    }
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      state.billFrequency === option.value
                        ? "bg-teal-100 text-teal-600"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {option.icon}
                  </div>
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                </motion.label>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={validateAndNext}
            className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

// Step 5: Legal Agreements (kept same as before but condensed for space)
const LegalAgreementsStep: React.FC<{
  onNext: () => void;
  state: OnboardingState;
  onAgreementChange: (
    agreementId: keyof OnboardingState["legalAgreements"],
    checked: boolean,
  ) => void;
}> = ({ onNext, state, onAgreementChange }) => {
  const [errors, setErrors] = useState<string[]>([]);

  const requiredAgreements = legalAgreements.filter(
    (agreement) => agreement.required,
  );
  const allRequiredAgreed = requiredAgreements.every(
    (agreement) => state.legalAgreements[agreement.id],
  );

  const validateAndNext = () => {
    if (!allRequiredAgreed) {
      setErrors(["You must agree to all required terms to continue."]);
      return;
    }
    setErrors([]);
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        <motion.div
          className="text-center space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-teal-600" />
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              Legal Agreements
            </h2>
          </div>
          <p className="text-gray-600">
            Please review and accept our terms to continue
          </p>
        </motion.div>

        <motion.div
          className="flex-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-4">
              {requiredAgreements.map((agreement) => (
                <motion.div
                  key={agreement.id}
                  className={cn(
                    "border rounded-lg p-4 transition-all duration-200",
                    state.legalAgreements[agreement.id]
                      ? "border-teal-300 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={agreement.id}
                      checked={state.legalAgreements[agreement.id]}
                      onCheckedChange={(checked) =>
                        onAgreementChange(agreement.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {agreement.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {agreement.description}
                      </p>
                      <button
                        type="button"
                        className="text-sm text-teal-600 hover:text-teal-700 flex items-center space-x-1 mt-2"
                        onClick={() =>
                          window.open(agreement.documentUrl, "_blank")
                        }
                      >
                        <span>Read full document</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>

        {errors.length > 0 && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700">{errors[0]}</p>
            </div>
          </motion.div>
        )}

        <Button
          onClick={validateAndNext}
          disabled={!allRequiredAgreed}
          className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 disabled:opacity-50"
        >
          {allRequiredAgreed
            ? "Continue to Account Setup"
            : "Accept Required Terms to Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 6: Account Creation (condensed)
const AccountStep: React.FC<{
  onNext: () => void;
  email: string;
  setEmail: (email: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}> = ({ onNext, email, setEmail, showPassword, setShowPassword }) => {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAndNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email || !email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-sm mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Create Your Account
          </h2>
          <p className="text-gray-600">
            Secure your financial future with BillBuddy
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address *
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full focus:border-teal-500"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password *
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 focus:border-teal-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>

        <Button
          onClick={validateAndNext}
          className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
        >
          Create Account
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 7: Completion with Discovery Summary
const CompletionStep: React.FC<{
  onComplete: () => void;
  firstName: string;
  discoveredBills: OnboardingState["discoveredBills"];
}> = ({ onComplete, firstName, discoveredBills }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-sm mx-auto space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <CheckCircle className="h-16 w-16 text-success mx-auto animate-pulse-glow" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Welcome to BillBuddy, {firstName}! 🎉
          </h2>
          <p className="text-gray-600">
            You're all set! We've discovered {discoveredBills.length} bills and
            your account is secure.
          </p>
        </div>

        {discoveredBills.length > 0 && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 className="font-semibold text-teal-800 mb-2">
              Bills Ready to Manage:
            </h3>
            <div className="space-y-1 text-sm text-teal-700">
              {discoveredBills.slice(0, 3).map((bill) => (
                <div key={bill.id} className="flex justify-between">
                  <span>{bill.name}</span>
                  <span>${bill.amount.toFixed(2)}</span>
                </div>
              ))}
              {discoveredBills.length > 3 && (
                <p className="text-xs text-teal-600">
                  +{discoveredBills.length - 3} more bills
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 py-4">
          {[
            {
              icon: <Zap className="h-4 w-4" />,
              label: "Auto-pay",
              color: "bg-yellow-100 text-yellow-600",
            },
            {
              icon: <Shield className="h-4 w-4" />,
              label: "Secure",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: <Brain className="h-4 w-4" />,
              label: "Smart",
              color: "bg-purple-100 text-purple-600",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2",
                  feature.color,
                )}
              >
                {feature.icon}
              </div>
              <p className="text-xs font-medium text-gray-600">
                {feature.label}
              </p>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={onComplete}
          size="lg"
          className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 shadow-lg hover:shadow-xl"
        >
          Enter Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingWizard;
