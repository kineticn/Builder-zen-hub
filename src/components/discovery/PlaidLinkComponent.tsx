import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { plaidService } from "@/services/plaidService";
import { useToast } from "@/components/ui/use-toast";

interface PlaidLinkComponentProps {
  userId: string;
  onSuccess: (accessToken: string, accounts: any[]) => void;
  onError?: (error: any) => void;
  className?: string;
  disabled?: boolean;
}

export const PlaidLinkComponent: React.FC<PlaidLinkComponentProps> = ({
  userId,
  onSuccess,
  onError,
  className,
  disabled = false,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate Plaid Link flow
  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Create link token
      toast({
        title: "Initializing Connection",
        description: "Preparing secure bank connection...",
      });

      const tokenResponse = await plaidService.createLinkToken(userId);

      // Step 2: Simulate user bank selection and login
      toast({
        title: "Demo Mode",
        description: "Simulating bank connection flow...",
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 3: Exchange for access token
      const accessResponse =
        await plaidService.exchangePublicToken("demo-public-token");

      // Step 4: Get accounts
      const accounts = await plaidService.getAccounts(
        accessResponse.access_token,
      );

      toast({
        title: "Bank Connected Successfully",
        description: `Connected ${accounts.length} account(s) from your bank`,
      });

      // Call success callback
      onSuccess(accessResponse.access_token, accounts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect bank account";
      setError(errorMessage);
      console.error("Plaid connection error:", err);

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });

      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Retry connection
  const handleRetry = () => {
    setError(null);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-4 p-6 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Connection Error</span>
        </div>
        <p className="text-sm text-red-700 text-center">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          className="border-red-200 text-red-700 hover:bg-red-100"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleConnect}
        disabled={disabled || isLoading}
        className={`bg-teal-600 hover:bg-teal-700 flex items-center space-x-2 ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            <span>Connect with Plaid</span>
          </>
        )}
      </Button>

      {/* Security indicators */}
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Shield className="h-3 w-3 text-green-600" />
          <span>Bank-level security</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle className="h-3 w-3 text-green-600" />
          <span>Read-only access</span>
        </div>
        <div className="flex items-center space-x-1">
          <Shield className="h-3 w-3 text-green-600" />
          <span>256-bit encryption</span>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Demo: Simulating secure bank connection...</span>
        </div>
      )}

      {/* Demo notice */}
      <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Demo Mode:</strong> This simulates a real Plaid connection.
          Connect real banks by adding your Plaid credentials to .env.local
        </p>
      </div>
    </div>
  );
};
