import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
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
  Building2,
  Loader2,
  Landmark,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/loading-skeletons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { tokens } from "@/design-tokens";

interface OnboardingState {
  step: number;
  quickStartMethod: "plaid" | "gmail" | "manual" | "";
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  monthlyIncome: string;
  billFrequency: "weekly" | "monthly" | "varies";
  householdType: "home" | "rental" | "parents" | "shared" | "";
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
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
  plaidToken: string;
  isLoading: boolean;
  currentLoadingStep: string;
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
    icon: <Landmark className="h-5 w-5" />,
    title: "Just Link Your Bank",
    description:
      "Connect your account and we'll find 95%+ of your bills automatically",
    color: "bg-emerald-100 text-emerald-600",
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

// Step transition skeleton component
const StepTransitionSkeleton: React.FC<{ step: number }> = ({ step }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex-1 flex flex-col p-6"
      initial={shouldReduceMotion ? {} : { opacity: 0 }}
      animate={shouldReduceMotion ? {} : { opacity: 1 }}
      transition={{
        duration: shouldReduceMotion
          ? 0
          : parseFloat(tokens.animation.duration.normal),
      }}
    >
      <div className="max-w-2xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-12 mx-auto rounded-full" variant="pulse" />
          <Skeleton className="h-8 w-64 mx-auto" variant="shimmer" />
          <Skeleton className="h-4 w-96 mx-auto" variant="shimmer" />
        </div>

        {/* Content skeleton based on step */}
        <div className="flex-1 space-y-4">
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" variant="shimmer" />
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" variant="pulse" />
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" variant="shimmer" />
                <Skeleton className="h-12 w-full" variant="shimmer" />
              </div>
              <Skeleton className="h-12 w-full" variant="shimmer" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" variant="pulse" />
                ))}
              </div>
            </>
          )}

          {(step === 4 || step === 5) && (
            <>
              <Skeleton className="h-32 w-full" variant="shimmer" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" variant="pulse" />
                <Skeleton className="h-12 w-full" variant="pulse" />
              </div>
            </>
          )}

          {step >= 6 && (
            <>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" variant="shimmer" />
                ))}
              </div>
              <Skeleton className="h-24 w-full" variant="pulse" />
            </>
          )}
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-12 w-full" variant="pulse" />
      </div>
    </motion.div>
  );
};

const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [state, setState] = useState<OnboardingState>({
    step: 1,
    quickStartMethod: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    monthlyIncome: "",
    billFrequency: "monthly",
    householdType: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
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
    plaidToken: "",
    isLoading: false,
    currentLoadingStep: "",
  });

  const [rotatingTipIndex, setRotatingTipIndex] = useState(0);

  // Auto-rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextStep = () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      currentLoadingStep: `Loading step ${prev.step + 1}...`,
    }));

    // Simulate loading time for realistic UX
    setTimeout(
      () => {
        setState((prev) => ({
          ...prev,
          step: prev.step + 1,
          isLoading: false,
          currentLoadingStep: "",
        }));
      },
      shouldReduceMotion ? 100 : 800,
    );
  };

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      currentLoadingStep: "Going back...",
    }));

    setTimeout(
      () => {
        setState((prev) => ({
          ...prev,
          step: prev.step - 1,
          isLoading: false,
          currentLoadingStep: "",
        }));
      },
      shouldReduceMotion ? 50 : 400,
    );
  };

  const updateState = (updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleAgreementChange = (
    agreementId: keyof OnboardingState["legalAgreements"],
    checked: boolean,
  ) => {
    const timestamp = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      legalAgreements: {
        ...prev.legalAgreements,
        [agreementId]: checked,
      },
      agreementTimestamps: {
        ...prev.agreementTimestamps,
        [agreementId]: checked ? timestamp : "",
      },
    }));
  };

  const handleComplete = () => {
    setState((prev) => ({ ...prev, isComplete: true }));
    navigate("/dashboard");
  };

  const getCurrentStepComponent = () => {
    if (state.isLoading) {
      return <StepTransitionSkeleton step={state.step} />;
    }

    switch (state.step) {
      case 1:
        return (
          <WelcomeStep
            onNext={nextStep}
            state={state}
            onMethodSelect={(method) =>
              updateState({ quickStartMethod: method })
            }
          />
        );
      case 2:
        return (
          <LegalAgreementsStep
            onNext={nextStep}
            onPrev={prevStep}
            state={state}
            onAgreementChange={handleAgreementChange}
          />
        );
      case 3:
        return (
          <AccountCreationStep
            onNext={nextStep}
            onPrev={prevStep}
            state={state}
            updateState={updateState}
          />
        );
      case 4:
        return (
          <PlaidConnectionStep
            onNext={nextStep}
            onPrev={prevStep}
            state={state}
            updateState={updateState}
          />
        );
      case 5:
        return (
          <HouseholdSetupStep
            onNext={nextStep}
            onPrev={prevStep}
            state={state}
            updateState={updateState}
          />
        );
      case 6:
        return (
          <PersonalizationStep
            onNext={nextStep}
            onPrev={prevStep}
            state={state}
            updateState={updateState}
          />
        );
      case 7:
        return <CompletionStep onComplete={handleComplete} state={state} />;
      default:
        return (
          <WelcomeStep
            onNext={nextStep}
            state={state}
            onMethodSelect={(method) =>
              updateState({ quickStartMethod: method })
            }
          />
        );
    }
  };

  const motionDuration = shouldReduceMotion ? 0 : 0.2; // 200ms in seconds
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
      };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center"
                  style={{ backgroundColor: tokens.colors.primary.navy[900] }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-navy-900 font-display">
                  BillBuddy
                </h1>
              </div>
              {state.isLoading && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{state.currentLoadingStep}</span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">Step {state.step} of 7</div>
          </div>
          <ProgressBar
            value={(state.step / 7) * 100}
            className="h-2"
            showAnimation={!shouldReduceMotion}
          />
        </div>
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div key={state.step} className="flex-1" {...motionProps}>
          {getCurrentStepComponent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Step 1: Welcome & Method Selection (Enhanced with Plaid-first approach)
const WelcomeStep: React.FC<{
  onNext: () => void;
  state: OnboardingState;
  onMethodSelect: (method: "plaid" | "gmail" | "manual") => void;
}> = ({ onNext, state, onMethodSelect }) => {
  const shouldReduceMotion = useReducedMotion();
  const [rotatingTipIndex, setRotatingTipIndex] = useState(0);

  useEffect(() => {
    if (!shouldReduceMotion) {
      const interval = setInterval(() => {
        setRotatingTipIndex((prev) => (prev + 1) % tips.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [shouldReduceMotion]);

  const handleMethodSelect = (method: "plaid" | "gmail" | "manual") => {
    onMethodSelect(method);
    onNext();
  };

  const motionDuration = shouldReduceMotion ? 0 : 0.2;
  const motionProps = shouldReduceMotion ? {} : {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: motionDuration }
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-2xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
        <motion.div className="text-center space-y-6" {...motionProps}>
          <div className="flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${tokens.colors.primary.teal[400]}, ${tokens.colors.primary.teal[500]})`,
              }}
            >
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-navy-900 font-display">
              Welcome to BillBuddy
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              Your one-stop solution for managing all your bills automatically
            </p>
          </div>

          {/* Rotating tip */}
          <motion.div
            key={rotatingTipIndex}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            initial={shouldReduceMotion ? {} : { scale: 0.95, opacity: 0 }}
            animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  tips[rotatingTipIndex].color,
                )}
              >
                {tips[rotatingTipIndex].icon}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">
                  {tips[rotatingTipIndex].title}
                </h3>
                <p className="text-sm text-gray-600">
                  {tips[rotatingTipIndex].description}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
          animate={shouldReduceMotion ? {} : { y: 0, opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
        >
          <h2 className="text-center text-lg font-semibold text-gray-900 mb-6">
            How would you like to get started?
          </h2>

          {/* Plaid-first option */}
          <motion.button
            onClick={() => handleMethodSelect("plaid")}
            className="w-full p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl hover:border-emerald-300 transition-all duration-200 group"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <Landmark className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    Just Link My Bank
                  </h3>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    Fastest
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm">
                  Connect your bank account and we'll auto-detect 95%+ of your
                  bills in seconds
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-emerald-600">
                  <span>✓ 30-second setup</span>
                  <span>✓ Bank-level security</span>
                  <span>✓ Read-only access</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          {/* Gmail option */}
          <motion.button
            onClick={() => handleMethodSelect("gmail")}
            className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 group"
            whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">
                  Connect Gmail/Email
                </h3>
                <p className="text-gray-600 text-sm">
                  Find bills from your email inbox (70%+ discovery rate)
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          {/* Manual option */}
          <motion.button
            onClick={() => handleMethodSelect("manual")}
            className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 group"
            whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Set Up Manually</h3>
                <p className="text-gray-600 text-sm">
                  I'll add my bills myself step by step
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

// Step 2: Legal Agreements (Before any data capture)
const LegalAgreementsStep: React.FC<{
  onNext: () => void;
  onPrev: () => void;
  state: OnboardingState;
  onAgreementChange: (
    agreementId: keyof OnboardingState["legalAgreements"],
    checked: boolean,
  ) => void;
}> = ({ onNext, onPrev, state, onAgreementChange }) => {
  const shouldReduceMotion = useReducedMotion();
  const [errors, setErrors] = useState<string[]>([]);

  const requiredAgreements = legalAgreements.filter(
    (agreement) => agreement.required,
  );
  const optionalAgreements = legalAgreements.filter(
    (agreement) => !agreement.required,
  );

  const allRequiredAgreed = requiredAgreements.every(
    (agreement) => state.legalAgreements[agreement.id],
  );

  const validateAndNext = () => {
    const missingRequired = requiredAgreements
      .filter((agreement) => !state.legalAgreements[agreement.id])
      .map((agreement) => agreement.title);

    if (missingRequired.length > 0) {
      setErrors(["You must agree to all required terms to continue."]);
      return;
    }

    setErrors([]);
    onNext();
  };

  const getCategoryIcon = (category: LegalAgreement["category"]) => {
    switch (category) {
      case "core":
        return <FileText className="h-4 w-4" />;
      case "banking":
        return <Lock className="h-4 w-4" />;
      case "privacy":
        return <Shield className="h-4 w-4" />;
      case "communication":
        return <Users className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: LegalAgreement["category"]) => {
    switch (category) {
      case "core":
        return "bg-blue-100 text-blue-600";
      case "banking":
        return "bg-green-100 text-green-600";
      case "privacy":
        return "bg-purple-100 text-purple-600";
      case "communication":
        return "bg-orange-100 text-orange-600";
    }
  };

  const motionDuration = shouldReduceMotion
    ? 0
    : parseFloat(tokens.animation.duration.normal);
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: motionDuration },
      };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        <motion.div className="text-center space-y-4" {...motionProps}>
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-teal-600" />
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              Terms & Privacy
            </h2>
          </div>
          <p className="text-gray-600">
            Before we begin, please review and accept our terms. This ensures
            your data is protected.
          </p>
          <div
            className="border rounded-lg p-3"
            style={{
              backgroundColor: tokens.colors.primary.teal[50],
              borderColor: tokens.colors.primary.teal[200],
            }}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-teal-600" />
              <p className="text-sm text-teal-800 font-medium">
                ✓ No data collection until you agree to these terms
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex-1"
          initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
          animate={shouldReduceMotion ? {} : { y: 0, opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.1 }}
        >
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-6">
              {/* Required Agreements */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-gray-900">
                    Required Agreements
                  </h3>
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                </div>

                <div className="space-y-3">
                  {requiredAgreements.map((agreement) => (
                    <motion.div
                      key={agreement.id}
                      className={cn(
                        "border rounded-lg p-4 transition-all duration-200",
                        state.legalAgreements[agreement.id]
                          ? "border-teal-300 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
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
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center",
                                getCategoryColor(agreement.category),
                              )}
                            >
                              {getCategoryIcon(agreement.category)}
                            </div>
                            <label
                              htmlFor={agreement.id}
                              className="text-sm font-semibold text-gray-900 cursor-pointer"
                            >
                              {agreement.title}
                            </label>
                            <Badge variant="outline" className="text-xs">
                              v{agreement.version}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {agreement.description}
                          </p>
                          <a
                            href={agreement.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs text-teal-600 hover:text-teal-700 transition-colors"
                          >
                            <span>Read full document</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Optional Agreements */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">
                    Optional Agreements
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </div>

                <div className="space-y-3">
                  {optionalAgreements.map((agreement) => (
                    <motion.div
                      key={agreement.id}
                      className={cn(
                        "border rounded-lg p-4 transition-all duration-200",
                        state.legalAgreements[agreement.id]
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
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
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center",
                                getCategoryColor(agreement.category),
                              )}
                            >
                              {getCategoryIcon(agreement.category)}
                            </div>
                            <label
                              htmlFor={agreement.id}
                              className="text-sm font-semibold text-gray-900 cursor-pointer"
                            >
                              {agreement.title}
                            </label>
                            <Badge variant="outline" className="text-xs">
                              v{agreement.version}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {agreement.description}
                          </p>
                          <a
                            href={agreement.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <span>Read full document</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </motion.div>

        {/* Error display */}
        {errors.length > 0 && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-3"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div className="text-sm text-red-700">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrev}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <Button
            onClick={validateAndNext}
            disabled={!allRequiredAgreed}
            className={cn(
              "flex items-center space-x-2",
              allRequiredAgreed
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-gray-300 cursor-not-allowed",
            )}
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Account Creation
const AccountCreationStep: React.FC<{
  onNext: () => void;
  onPrev: () => void;
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
}> = ({ onNext, onPrev, state, updateState }) => {
  const shouldReduceMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateAndNext = () => {
    const newErrors: string[] = [];

    if (!state.email) newErrors.push("Email is required");
    if (!state.password || state.password.length < 8) {
      newErrors.push("Password must be at least 8 characters");
    }
    if (!state.firstName) newErrors.push("First name is required");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    onNext();
  };

  const handleOAuthSignup = (provider: "google" | "facebook") => {
    // OAuth would auto-fill user data and proceed
    updateState({
      email: provider === "google" ? "user@gmail.com" : "user@facebook.com",
      firstName: "John",
      lastName: "Doe",
    });
    onNext();
  };

  const motionDuration = shouldReduceMotion
    ? 0
    : parseFloat(tokens.animation.duration.normal);
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: motionDuration },
      };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-md mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <motion.div className="text-center space-y-4" {...motionProps}>
          <div className="flex items-center justify-center space-x-2">
            <UserCheck className="h-8 w-8 text-teal-600" />
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              Create Your Account
            </h2>
          </div>
          <p className="text-gray-600">
            Set up your secure BillBuddy account to get started
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
          animate={shouldReduceMotion ? {} : { y: 0, opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.1 }}
        >
          {/* OAuth Options - Prominent placement */}
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-500">
              Quick signup options
            </p>

            <Button
              onClick={() => handleOAuthSignup("google")}
              variant="outline"
              className="w-full h-12 bg-white border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-3"
            >
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className="font-medium">Continue with Google</span>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Fastest
              </Badge>
            </Button>

            <Button
              onClick={() => handleOAuthSignup("facebook")}
              variant="outline"
              className="w-full h-12 bg-white border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-3"
            >
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">f</span>
              </div>
              <span className="font-medium">Continue with Facebook</span>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-gray-500">
                Or create manually
              </span>
            </div>
          </div>

          {/* Manual signup form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <Input
                  type="text"
                  value={state.firstName}
                  onChange={(e) => updateState({ firstName: e.target.value })}
                  placeholder="John"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <Input
                  type="text"
                  value={state.lastName}
                  onChange={(e) => updateState({ lastName: e.target.value })}
                  placeholder="Doe"
                  className="h-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <Input
                type="email"
                value={state.email}
                onChange={(e) => updateState({ email: e.target.value })}
                placeholder="john@example.com"
                className="h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={state.password}
                  onChange={(e) => updateState({ password: e.target.value })}
                  placeholder="Create a secure password"
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                At least 8 characters with a mix of letters and numbers
              </p>
            </div>
          </div>

          {/* Security badges */}
          <div className="grid grid-cols-3 gap-4 py-4">
            {[
              {
                icon: <Shield className="h-4 w-4" />,
                label: "Encrypted",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: <Lock className="h-4 w-4" />,
                label: "Secure",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: <CheckCircle className="h-4 w-4" />,
                label: "Verified",
                color: "bg-purple-100 text-purple-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                className="text-center"
                initial={shouldReduceMotion ? {} : { scale: 0 }}
                animate={shouldReduceMotion ? {} : { scale: 1 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.3 + index * 0.1,
                }}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2",
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

          {/* Error display */}
          {errors.length > 0 && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-lg p-3"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div className="text-sm text-red-700">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={onPrev}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <Button
              onClick={validateAndNext}
              className="bg-teal-600 hover:bg-teal-700 flex items-center space-x-2"
            >
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Step 4: Plaid Connection (Enhanced for Plaid-first flow)
const PlaidConnectionStep: React.FC<{
  onNext: () => void;
  onPrev: () => void;
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
}> = ({ onNext, onPrev, state, updateState }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "success" | "error"
  >("idle");

  const handlePlaidConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus("connecting");

    // Simulate Plaid connection process
    setTimeout(() => {
      // Simulate successful connection with discovered bills
      const mockBills = [
        {
          id: "1",
          name: "Pacific Gas & Electric",
          amount: 145.67,
          confidence: 0.98,
          source: "plaid" as const,
        },
        {
          id: "2",
          name: "Comcast Internet",
          amount: 89.99,
          confidence: 0.95,
          source: "plaid" as const,
        },
        {
          id: "3",
          name: "State Farm Insurance",
          amount: 234.5,
          confidence: 0.92,
          source: "plaid" as const,
        },
        {
          id: "4",
          name: "T-Mobile",
          amount: 75.0,
          confidence: 0.89,
          source: "plaid" as const,
        },
      ];

      updateState({
        discoveredBills: mockBills,
        plaidToken: "plaid_token_123",
      });
      setConnectionStatus("success");
      setIsConnecting(false);

      setTimeout(() => {
        onNext();
      }, 2000);
    }, 3000);
  };

  const skipPlaidConnection = () => {
    updateState({ quickStartMethod: "manual" });
    onNext();
  };

  const motionDuration = shouldReduceMotion
    ? 0
    : parseFloat(tokens.animation.duration.normal);
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: motionDuration },
      };

  // Show discovery results if we have bills
  if (connectionStatus === "success" && state.discoveredBills.length > 0) {
    return (
      <div className="flex-1 flex flex-col p-6">
        <div className="max-w-2xl mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
          <motion.div className="text-center space-y-4" {...motionProps}>
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              Great! We Found {state.discoveredBills.length} Bills
            </h2>
            <p className="text-gray-600">
              Your bank connection was successful. Here's what we discovered
              automatically:
            </p>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
            animate={shouldReduceMotion ? {} : { y: 0, opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
          >
            {state.discoveredBills.map((bill, index) => (
              <motion.div
                key={bill.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
                animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.3 + index * 0.1,
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{bill.name}</h3>
                    <p className="text-sm text-gray-600">
                      ${bill.amount}/month
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={cn(
                      "text-xs",
                      bill.confidence > 0.95
                        ? "bg-emerald-100 text-emerald-700"
                        : bill.confidence > 0.9
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700",
                    )}
                  >
                    {Math.round(bill.confidence * 100)}% match
                  </Badge>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center text-sm text-gray-600 bg-emerald-50 border border-emerald-200 rounded-lg p-3"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.5 }}
          >
            ✓ We'll continue scanning for more bills as transactions come in
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <motion.div className="text-center space-y-4" {...motionProps}>
          <div className="flex items-center justify-center space-x-2">
            <Landmark className="h-8 w-8 text-teal-600" />
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              {state.quickStartMethod === "plaid"
                ? "Connect Your Bank"
                : "Connect Bank Account"}
            </h2>
          </div>
          <p className="text-gray-600">
            {state.quickStartMethod === "plaid"
              ? "Let's connect your bank account to automatically discover your bills"
              : "Connect your bank account for the best bill discovery experience"}
          </p>
        </motion.div>

        {connectionStatus === "idle" && (
          <motion.div
            className="space-y-6"
            initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
            animate={shouldReduceMotion ? {} : { y: 0, opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.1 }}
          >
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Bank-Level Security
                  </h3>
                  <p className="text-sm text-gray-600">
                    Powered by Plaid - trusted by millions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  {
                    icon: <Lock className="h-5 w-5" />,
                    label: "256-bit SSL",
                    description: "Encryption",
                  },
                  {
                    icon: <Eye className="h-5 w-5" />,
                    label: "Read-only",
                    description: "Access",
                  },
                  {
                    icon: <Shield className="h-5 w-5" />,
                    label: "Never stored",
                    description: "Credentials",
                  },
                ].map((feature, index) => (
                  <div key={feature.label} className="space-y-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full mx-auto flex items-center justify-center text-green-600">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        {feature.label}
                      </p>
                      <p className="text-xs text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handlePlaidConnection}
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center space-x-2"
              >
                <Link className="h-5 w-5" />
                <span>Connect Bank Account</span>
              </Button>

              <Button
                onClick={skipPlaidConnection}
                variant="outline"
                className="w-full"
              >
                Skip for now - I'll add bills manually
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Your credentials are never stored and we can only read transaction
              data, not move money
            </div>
          </motion.div>
        )}

        {connectionStatus === "connecting" && (
          <motion.div
            className="text-center space-y-6"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Connecting to your bank...
              </h3>
              <p className="text-gray-600">
                This may take a few moments while we securely connect and scan
                for bills
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✓ Establishing secure connection</p>
              <p>✓ Authenticating account access</p>
              <p className="text-emerald-600">
                ⟳ Scanning transactions for bills...
              </p>
            </div>
          </motion.div>
        )}

        {/* Navigation buttons for non-connecting states */}
        {connectionStatus === "idle" && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onPrev}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 5: Household Setup
const HouseholdSetupStep: React.FC<{
  onNext: () => void;
  onPrev: () => void;
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
}> = ({ onNext, onPrev, state, updateState }) => {
  const shouldReduceMotion = useReducedMotion();

  const householdTypes = [
    {
      id: "home" as const,
      icon: <Home className="h-6 w-6" />,
      title: "Own a Home",
      description: "I own my home and manage all household bills",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "rental" as const,
      icon: <Building2 className="h-6 w-6" />,
      title: "Rent/Apartment",
      description: "I rent and handle utilities & personal bills",
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "parents" as const,
      icon: <Users className="h-6 w-6" />,
      title: "Live with Family",
      description: "I contribute to household expenses",
      color: "bg-green-100 text-green-600",
    },
    {
      id: "shared" as const,
      icon: <UserCheck className="h-6 w-6" />,
      title: "Shared Living",
      description: "I split bills with roommates or partner",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const handleTypeSelect = (type: (typeof householdTypes)[0]["id"]) => {
    updateState({ householdType: type });
    // Simulate location detection
    setTimeout(() => {
      updateState({
        address: {
          street: "123 Main St",
          city: "San Francisco",
          state: "CA",
          zip: "94105",
        },
      });
    }, 1000);
  };

  const validateAndNext = () => {
    if (!state.householdType) return;
    onNext();
  };

  const motionDuration = shouldReduceMotion
    ? 0
    : parseFloat(tokens.animation.duration.normal);
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: motionDuration },
      };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-2xl mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <motion.div className="text-center space-y-4" {...motionProps}>
          <div className="flex items-center justify-center space-x-2">
            <Building className="h-8 w-8 text-teal-600" />
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              Tell Us About Your Living Situation
            </h2>
          </div>
          <p className="text-gray-600">
            This helps us understand what types of bills you might have and how
            to organize them
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
          animate={shouldReduceMotion ? {} : { y: 0, opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.1 }}
        >
          {householdTypes.map((type, index) => (
            <motion.button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={cn(
                "p-6 border-2 rounded-xl text-left transition-all duration-200",
                state.householdType === type.id
                  ? "border-teal-300 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300 bg-white",
              )}
              initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
              animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.2 + index * 0.1 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    type.color,
                  )}
                >
                  {type.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {type.title}
                  </h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
                {state.householdType === type.id && (
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Location detection */}
        {state.householdType && (
          <motion.div
            className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-teal-600" />
              <h3 className="font-semibold text-gray-900">Location</h3>
              {state.address.city && (
                <Badge className="bg-green-100 text-green-700">
                  Auto-detected
                </Badge>
              )}
            </div>

            {state.address.city ? (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="h-4 w-4" />
                <span>
                  {state.address.city}, {state.address.state}{" "}
                  {state.address.zip}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Detecting your location...</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrev}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <Button
            onClick={validateAndNext}
            disabled={!state.householdType}
            className={cn(
              "flex items-center space-x-2",
              state.householdType
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-gray-300 cursor-not-allowed",
            )}
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step 6: Personalization
const PersonalizationStep: React.FC<{
  onNext: () => void;
  onPrev: () => void;
  state: OnboardingState;
  updateState: (updates: Partial<OnboardingState>) => void;
}> = ({ onNext, onPrev, state, updateState }) => {
  const shouldReduceMotion = useReducedMotion();

  const validateAndNext = () => {
    onNext();
  };

  const motionDuration = shouldReduceMotion
    ? 0
    : parseFloat(tokens.animation.duration.normal);
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: motionDuration },
      };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-md mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <motion.div className="text-center space-y-4" {...motionProps}>
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 text-teal-600" />
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              Personalize Your Experience
            </h2>
          </div>
          <p className="text-gray-600">
            Help us provide better insights and recommendations tailored to you
          </p>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
          animate={shouldReduceMotion ? {} : { y: 0, opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.1 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income (Optional)
            </label>
            <Select
              value={state.monthlyIncome}
              onValueChange={(value) => updateState({ monthlyIncome: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-3k">Under $3,000</SelectItem>
                <SelectItem value="3k-5k">$3,000 - $5,000</SelectItem>
                <SelectItem value="5k-8k">$5,000 - $8,000</SelectItem>
                <SelectItem value="8k-12k">$8,000 - $12,000</SelectItem>
                <SelectItem value="over-12k">Over $12,000</SelectItem>
                <SelectItem value="prefer-not-to-say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Helps us provide better budgeting insights
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How often do you prefer to pay bills?
            </label>
            <div className="space-y-2">
              {[
                {
                  value: "weekly",
                  label: "Weekly",
                  description: "Get reminded every week",
                },
                {
                  value: "monthly",
                  label: "Monthly",
                  description: "Traditional monthly billing",
                },
                {
                  value: "varies",
                  label: "It varies",
                  description: "Different for each bill",
                },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() =>
                    updateState({ billFrequency: option.value as any })
                  }
                  className={cn(
                    "w-full p-4 border-2 rounded-lg text-left transition-all duration-200",
                    state.billFrequency === option.value
                      ? "border-teal-300 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300 bg-white",
                  )}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    {state.billFrequency === option.value && (
                      <CheckCircle className="h-5 w-5 text-teal-600" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Goals selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are your main goals? (Optional)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  icon: <DollarSign className="h-4 w-4" />,
                  label: "Save money on bills",
                },
                {
                  icon: <Zap className="h-4 w-4" />,
                  label: "Automate payments",
                },
                {
                  icon: <Clock className="h-4 w-4" />,
                  label: "Never miss due dates",
                },
                {
                  icon: <TrendingUp className="h-4 w-4" />,
                  label: "Track spending trends",
                },
              ].map((goal, index) => (
                <motion.div
                  key={goal.label}
                  className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg"
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : 0.3 + index * 0.1,
                  }}
                >
                  <Checkbox id={goal.label} />
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                      {goal.icon}
                    </div>
                    <label
                      htmlFor={goal.label}
                      className="text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      {goal.label}
                    </label>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPrev}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <Button
            onClick={validateAndNext}
            className="bg-teal-600 hover:bg-teal-700 flex items-center space-x-2"
          >
            <span>Almost Done</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step 7: Completion
const CompletionStep: React.FC<{
  onComplete: () => void;
  state: OnboardingState;
}> = ({ onComplete, state }) => {
  const shouldReduceMotion = useReducedMotion();

  const motionDuration = shouldReduceMotion
    ? 0
    : parseFloat(tokens.animation.duration.normal);
  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: motionDuration },
      };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-2xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
        <motion.div className="text-center space-y-6" {...motionProps}>
          <div className="flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${tokens.colors.semantic.success}, ${tokens.colors.primary.teal[500]})`,
              }}
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-navy-900 font-display">
              You're All Set!
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              Welcome to BillBuddy! Your personalized bill management dashboard
              is ready.
            </p>
          </div>

          {/* Summary of what was set up */}
          <motion.div
            className="bg-white border border-gray-200 rounded-xl p-6 text-left space-y-4"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
          >
            <h3 className="font-semibold text-gray-900 text-center mb-4">
              Here's what we've set up for you:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-gray-700">
                    Secure account created
                  </span>
                </div>

                {state.plaidToken && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-gray-700">
                      Bank account connected
                    </span>
                  </div>
                )}

                {state.discoveredBills.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-gray-700">
                      {state.discoveredBills.length} bills discovered
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {state.householdType && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-gray-700">
                      Household type configured
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-gray-700">
                    Preferences saved
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-gray-700">
                    Security enabled
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next steps */}
          {state.discoveredBills.length > 0 && (
            <motion.div
              className="bg-teal-50 border border-teal-200 rounded-lg p-4"
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={shouldReduceMotion ? {} : { opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.4 }}
            >
              <p className="text-sm text-teal-800">
                💡 <strong>Pro tip:</strong> We'll continue scanning your
                transactions to find more bills automatically. You can review
                and confirm them in your dashboard.
              </p>
            </motion.div>
          )}
        </motion.div>

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
              initial={shouldReduceMotion ? {} : { scale: 0 }}
              animate={shouldReduceMotion ? {} : { scale: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.4 + index * 0.1 }}
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