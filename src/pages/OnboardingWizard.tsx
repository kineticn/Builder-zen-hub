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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingState {
  step: number;
  email: string;
  firstName: string;
  monthlyIncome: string;
  billFrequency: "weekly" | "monthly" | "varies";
  ocrText: string;
  isComplete: boolean;
  hasSeenTips: boolean;
}

interface Tip {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const tips: Tip[] = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "AI-Powered Insights",
    description:
      "Our smart algorithm learns your spending patterns and suggests optimizations",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Never Miss a Payment",
    description:
      "Automatic bill detection and smart reminders keep you on track",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Bank-Level Security",
    description:
      "256-bit encryption and multi-factor authentication protect your data",
    color: "bg-green-100 text-green-600",
  },
];

const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<OnboardingState>({
    step: 1,
    email: "",
    firstName: "",
    monthlyIncome: "",
    billFrequency: "monthly",
    ocrText: "",
    isComplete: false,
    hasSeenTips: false,
  });
  const [currentTip, setCurrentTip] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const updateState = (updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (state.step < 5) {
      updateState({ step: state.step + 1 });
    }
  };

  const goToDashboard = () => {
    localStorage.setItem("billbuddy_onboarding_complete", "true");
    localStorage.setItem("billbuddy_user_name", state.firstName);
    navigate("/dashboard");
  };

  // Auto-cycle tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <WelcomeStep onNext={nextStep} currentTip={currentTip} />;
      case 2:
        return (
          <PersonalizationStep
            onNext={nextStep}
            state={state}
            updateState={updateState}
          />
        );
      case 3:
        return (
          <AccountStep
            onNext={nextStep}
            email={state.email}
            setEmail={(email) => updateState({ email })}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        );
      case 4:
        return (
          <BillScanStep
            onNext={nextStep}
            ocrText={state.ocrText}
            setOcrText={(ocrText) => updateState({ ocrText })}
          />
        );
      case 5:
        return (
          <BankLinkStep
            onComplete={goToDashboard}
            firstName={state.firstName}
          />
        );
      default:
        return <WelcomeStep onNext={nextStep} currentTip={currentTip} />;
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
        <ProgressBar current={state.step} total={5} showSteps />
        <div className="flex justify-center mt-2">
          <div className="flex space-x-2">
            {Array.from({ length: 5 }, (_, i) => (
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

// Step 1: Enhanced Welcome with rotating tips
const WelcomeStep: React.FC<{ onNext: () => void; currentTip: number }> = ({
  onNext,
  currentTip,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-sm mx-auto space-y-8">
        {/* Animated Logo */}
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-teal-400 to-navy-600 rounded-2xl flex items-center justify-center mx-auto relative"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="text-2xl font-bold text-white">BB</span>
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-3 w-3 text-yellow-700" />
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
            The smart way to manage and automate your bills. Join 50,000+ users
            who never miss a payment.
          </motion.p>
        </div>

        {/* Rotating Tips */}
        <motion.div
          className="h-20 flex items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3 px-4 py-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200"
            >
              <div className={cn("p-2 rounded-lg", tips[currentTip].color)}>
                {tips[currentTip].icon}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {tips[currentTip].title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {tips[currentTip].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="flex items-center justify-center space-x-1 text-sm text-gray-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex -space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 bg-gradient-to-br from-teal-400 to-navy-600 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <span className="ml-2">Trusted by 50,000+ users</span>
          <div className="flex space-x-1 ml-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={onNext}
            size="lg"
            className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-semibold py-4 text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

// Step 2: Personalization
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

    if (!state.monthlyIncome) {
      newErrors.monthlyIncome = "This helps us provide better insights";
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
            Let's personalize your experience
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
                onChange={(e) => {
                  updateState({ monthlyIncome: e.target.value });
                  if (errors.monthlyIncome)
                    setErrors((prev) => ({ ...prev, monthlyIncome: "" }));
                }}
                className={cn(
                  "w-full pl-10 transition-all duration-200",
                  errors.monthlyIncome
                    ? "border-red-300 focus:border-red-500"
                    : "focus:border-teal-500",
                )}
              />
            </div>
            {errors.monthlyIncome && (
              <p className="text-sm text-red-600">{errors.monthlyIncome}</p>
            )}
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

// Step 3: Enhanced Account Creation
const AccountStep: React.FC<{
  onNext: () => void;
  email: string;
  setEmail: (email: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}> = ({ onNext, email, setEmail, showPassword, setShowPassword }) => {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const validateAndNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-yellow-500";
    if (strength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-sm mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <motion.div
          className="text-center space-y-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Create Your Account
          </h2>
          <p className="text-gray-600">
            Secure your financial future with BillBuddy
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Email Input */}
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={cn(
                "w-full transition-all duration-200",
                errors.email
                  ? "border-red-300 focus:border-red-500"
                  : "focus:border-teal-500",
              )}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={cn(
                  "w-full pr-10 transition-all duration-200",
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : "focus:border-teal-500",
                )}
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Password strength
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      passwordStrength <= 25
                        ? "text-red-600"
                        : passwordStrength <= 50
                          ? "text-yellow-600"
                          : passwordStrength <= 75
                            ? "text-blue-600"
                            : "text-green-600",
                    )}
                  >
                    {getStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      getStrengthColor(passwordStrength),
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.button
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 rounded-lg py-3 px-4 hover:border-gray-300 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-5 h-5 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
              <span className="font-medium text-gray-700">
                Continue with Google
              </span>
            </motion.button>

            <motion.button
              className="w-full flex items-center justify-center space-x-3 bg-black text-white rounded-lg py-3 px-4 hover:bg-gray-800 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center text-black text-xs font-bold"></div>
              <span className="font-medium">Continue with Apple</span>
            </motion.button>
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
            Create Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-xs text-gray-500 text-center mt-3">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-teal-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-teal-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Step 4: Enhanced Bill Scan
const BillScanStep: React.FC<{
  onNext: () => void;
  ocrText: string;
  setOcrText: (text: string) => void;
}> = ({ onNext, ocrText, setOcrText }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedFields, setDetectedFields] = useState<any>(null);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate OCR scanning with smart field detection
    setTimeout(() => {
      const mockDetection = {
        billerName: "Pacific Gas & Electric",
        amount: "125.50",
        dueDate: "2024-03-15",
        accountNumber: "****1234",
        billType: "Utilities",
      };

      setDetectedFields(mockDetection);
      setOcrText(
        `Bill detected: ${mockDetection.billerName} - $${mockDetection.amount} - Due: ${mockDetection.dueDate}`,
      );
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-sm mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <motion.div
          className="text-center space-y-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Scan Your First Bill
          </h2>
          <p className="text-gray-600">
            Our AI will extract all the important details automatically
          </p>
        </motion.div>

        {/* Enhanced Camera Preview */}
        <motion.div
          className={cn(
            "aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed",
            "flex flex-col items-center justify-center relative overflow-hidden",
            isScanning ? "border-teal-400 bg-teal-50" : "border-gray-300",
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {isScanning ? (
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Scan className="h-12 w-12 text-teal-500 mx-auto" />
              </motion.div>
              <div className="space-y-2">
                <p className="text-sm text-teal-600 font-medium">
                  AI Scanning in Progress...
                </p>
                <div className="w-32 bg-teal-200 rounded-full h-2 mx-auto">
                  <motion.div
                    className="bg-teal-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="text-xs text-teal-500">
                  {scanProgress}% complete
                </p>
              </div>
            </div>
          ) : detectedFields ? (
            <div className="w-full h-full relative">
              {/* Simulated bill preview */}
              <div className="absolute inset-4 bg-white rounded-lg shadow-md p-4 border">
                <div className="space-y-2">
                  <div className="h-3 bg-navy-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                  <div className="mt-4 space-y-1">
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs font-bold text-navy-900">
                      Amount Due:
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      ${detectedFields.amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detection highlights */}
              <motion.div
                className="absolute top-6 right-6 bg-teal-500 text-white text-xs px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                ✓ Detected
              </motion.div>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <Camera className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm text-gray-500">
                  Position your bill in the frame
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  AI will automatically detect key information
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Smart Field Detection */}
        {detectedFields && (
          <motion.div
            className="space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold text-gray-900 text-sm">
              Detected Information:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(detectedFields).map(([key, value], index) => (
                <motion.div
                  key={key}
                  className="bg-white p-3 rounded-lg border border-gray-200"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="text-xs text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="font-medium text-gray-900 text-sm">{value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {!detectedFields && (
            <Button
              onClick={startScan}
              disabled={isScanning}
              variant="outline"
              className="w-full hover:bg-teal-50 hover:border-teal-300 transition-all duration-200"
            >
              <Camera className="mr-2 h-4 w-4" />
              {isScanning ? "Scanning..." : "Start AI Scan"}
            </Button>
          )}

          <Button
            onClick={onNext}
            disabled={!detectedFields}
            className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {!detectedFields && (
            <Button
              onClick={onNext}
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Step 5: Enhanced Bank Link
const BankLinkStep: React.FC<{ onComplete: () => void; firstName: string }> = ({
  onComplete,
  firstName,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);

  const connectBank = () => {
    setIsConnecting(true);
    setConnectionProgress(0);

    // Simulate connection progress
    const progressInterval = setInterval(() => {
      setConnectionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    // Simulate Plaid connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 3000);
  };

  if (isConnected) {
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

          <motion.div
            className="space-y-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              Welcome to BillBuddy, {firstName}! 🎉
            </h2>
            <p className="text-gray-600">
              Your account is set up and your bank is connected securely. You're
              ready to take control of your bills!
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-4 py-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={onComplete}
              size="lg"
              className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Enter Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-sm mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <motion.div
          className="text-center space-y-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Connect Your Bank
          </h2>
          <p className="text-gray-600">
            Securely link your account to enable smart features
          </p>
        </motion.div>

        {/* Enhanced Plaid-like interface */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center">
            <motion.div
              className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3"
              animate={isConnecting ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isConnecting ? Infinity : 0 }}
            >
              <span className="text-xl">🏦</span>
            </motion.div>
            <h3 className="font-semibold text-gray-900">Bank-Level Security</h3>
            <p className="text-sm text-gray-500 mt-1">
              256-bit encryption • Never store credentials
            </p>
          </div>

          {isConnecting && (
            <motion.div
              className="text-center py-4 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-teal-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Establishing secure connection...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-teal-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${connectionProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>
          )}

          {/* Trust indicators */}
          {!isConnecting && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                {
                  icon: <Shield className="h-3 w-3" />,
                  label: "SSL Encrypted",
                },
                { icon: <Users className="h-3 w-3" />, label: "50K+ Users" },
              ].map((indicator, index) => (
                <div
                  key={indicator.label}
                  className="flex items-center space-x-2 text-xs text-gray-500"
                >
                  <div className="text-green-500">{indicator.icon}</div>
                  <span>{indicator.label}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={connectBank}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
          >
            {isConnecting ? "Connecting..." : "Connect Bank Account"}
            {!isConnecting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>

          <Button
            onClick={onComplete}
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
