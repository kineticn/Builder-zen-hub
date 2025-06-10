import React, { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
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
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Plaid Link
  useEffect(() => {
    const initializePlaid = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const tokenResponse = await plaidService.createLinkToken(userId);
        setLinkToken(tokenResponse.link_token);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to initialize Plaid";
        setError(errorMessage);
        console.error("Plaid initialization error:", err);

        toast({
          title: "Connection Error",
          description:
            "Unable to initialize bank connection. Please check your configuration.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && !linkToken) {
      initializePlaid();
    }
  }, [userId, linkToken, toast]);

  // Handle successful link
  const onPlaidSuccess = useCallback(
    async (publicToken: string, metadata: any) => {
      try {
        setIsLoading(true);

        // Exchange public token for access token
        const tokenResponse =
          await plaidService.exchangePublicToken(publicToken);

        // Get account information
        const accounts = await plaidService.getAccounts(
          tokenResponse.access_token,
        );

        toast({
          title: "Bank Connected Successfully",
          description: `Connected ${accounts.length} account(s) from ${metadata.institution.name}`,
        });

        // Call success callback
        onSuccess(tokenResponse.access_token, accounts);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to connect bank account";
        setError(errorMessage);
        console.error("Plaid success handler error:", err);

        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        });

        onError?.(err);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError, toast],
  );

  // Handle Plaid errors
  const onPlaidError = useCallback(
    (error: any) => {
      console.error("Plaid Link error:", error);

      toast({
        title: "Connection Error",
        description: error.error_message || "Failed to connect to your bank",
        variant: "destructive",
      });

      onError?.(error);
    },
    [onError, toast],
  );

  // Handle when user exits Link flow
  const onPlaidExit = useCallback((error: any, metadata: any) => {
    if (error) {
      console.error("Plaid Link exit error:", error);
    }
    console.log("Plaid Link exit metadata:", metadata);
  }, []);

  // Configure Plaid Link hook
  const config = {
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onError: onPlaidError,
    onExit: onPlaidExit,
  };

  const { open, ready, error: linkError } = usePlaidLink(config);

  // Handle link errors
  useEffect(() => {
    if (linkError) {
      setError(linkError.message);
      toast({
        title: "Link Error",
        description: linkError.message,
        variant: "destructive",
      });
    }
  }, [linkError, toast]);

  // Retry initialization
  const handleRetry = () => {
    setLinkToken(null);
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
        onClick={() => open()}
        disabled={disabled || !ready || isLoading}
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

      {!ready && linkToken && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Preparing secure connection...</span>
        </div>
      )}
    </div>
  );
};
