import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Camera, Scan, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

interface OnboardingState {
  step: number;
  email: string;
  ocrText: string;
  isComplete: boolean;
}

const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<OnboardingState>({
    step: 1,
    email: "",
    ocrText: "",
    isComplete: false,
  });

  const updateState = (updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (state.step < 4) {
      updateState({ step: state.step + 1 });
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
      case 2:
        return (
          <AccountStep
            onNext={nextStep}
            email={state.email}
            setEmail={(email) => updateState({ email })}
          />
        );
      case 3:
        return (
          <BillScanStep
            onNext={nextStep}
            ocrText={state.ocrText}
            setOcrText={(ocrText) => updateState({ ocrText })}
          />
        );
      case 4:
        return <BankLinkStep onComplete={goToDashboard} />;
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-teal-50 flex flex-col">
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <ProgressBar current={state.step} total={4} showSteps />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">{renderStep()}</div>
    </div>
  );
};

// Step 1: Welcome
const WelcomeStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-sm mx-auto space-y-8">
        {/* Logo */}
        <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-navy-600 rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-2xl font-bold text-white">BB</span>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-navy-900 font-display">
            Welcome to BillBuddy
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The smart way to manage and automate your bills. Never miss a
            payment again.
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={onNext}
          size="lg"
          className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-semibold py-4 text-lg"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

// Step 2: Account Creation
const AccountStep: React.FC<{
  onNext: () => void;
  email: string;
  setEmail: (email: string) => void;
}> = ({ onNext, email, setEmail }) => {
  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-sm mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Create Your Account
          </h2>
          <p className="text-gray-600">Choose how you'd like to sign up</p>
        </div>

        <div className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 rounded-lg py-3 px-4 hover:border-gray-300 transition-colors">
              <div className="w-5 h-5 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
              <span className="font-medium text-gray-700">
                Continue with Google
              </span>
            </button>

            <button className="w-full flex items-center justify-center space-x-3 bg-black text-white rounded-lg py-3 px-4 hover:bg-gray-800 transition-colors">
              <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center text-black text-xs font-bold"></div>
              <span className="font-medium">Continue with Apple</span>
            </button>
          </div>
        </div>

        <Button
          onClick={onNext}
          disabled={!email.includes("@")}
          className="w-full"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 3: Bill Scan
const BillScanStep: React.FC<{
  onNext: () => void;
  ocrText: string;
  setOcrText: (text: string) => void;
}> = ({ onNext, ocrText, setOcrText }) => {
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    // Simulate OCR scanning
    setTimeout(() => {
      setOcrText("Electric Bill - $125.50 - Due: March 15, 2024");
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-sm mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Scan Your First Bill
          </h2>
          <p className="text-gray-600">Take a photo of a bill to get started</p>
        </div>

        {/* Camera Preview Placeholder */}
        <div
          className={cn(
            "aspect-[4/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300",
            "flex flex-col items-center justify-center",
            "relative overflow-hidden",
            isScanning && "border-teal-400 bg-teal-50",
          )}
        >
          {isScanning ? (
            <div className="text-center space-y-3">
              <Scan className="h-12 w-12 text-teal-500 animate-pulse mx-auto" />
              <p className="text-sm text-teal-600 font-medium">Scanning...</p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <Camera className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-500">
                Camera preview will appear here
              </p>
            </div>
          )}
        </div>

        {/* OCR Text Preview */}
        {ocrText && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Detected Information (editable):
            </label>
            <textarea
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              rows={3}
            />
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={startScan}
            disabled={isScanning}
            variant="outline"
            className="w-full"
          >
            <Camera className="mr-2 h-4 w-4" />
            {isScanning ? "Scanning..." : "Scan Bill"}
          </Button>

          <Button onClick={onNext} disabled={!ocrText} className="w-full">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step 4: Bank Link
const BankLinkStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const connectBank = () => {
    setIsConnecting(true);
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
          <CheckCircle className="h-16 w-16 text-success mx-auto animate-pulse-glow" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              All Set!
            </h2>
            <p className="text-gray-600">
              Your bank account has been connected successfully. You're ready to
              start managing your bills.
            </p>
          </div>
          <Button
            onClick={onComplete}
            size="lg"
            className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="max-w-sm mx-auto w-full space-y-6 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-navy-900 font-display">
            Connect Your Bank
          </h2>
          <p className="text-gray-600">
            Securely link your bank account to enable autopay
          </p>
        </div>

        {/* Plaid-like interface placeholder */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-blue-600">🏦</span>
            </div>
            <h3 className="font-semibold text-gray-900">
              Secure Bank Connection
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Powered by bank-level security
            </p>
          </div>

          {isConnecting && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Connecting...</p>
            </div>
          )}
        </div>

        <Button
          onClick={connectBank}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? "Connecting..." : "Connect Bank Account"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingWizard;
