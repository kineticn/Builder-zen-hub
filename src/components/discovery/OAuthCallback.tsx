import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { emailService, outlookService } from "@/services/emailService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Processing authorization...");

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const state = searchParams.get("state");

        if (error) {
          throw new Error(
            searchParams.get("error_description") ||
              "Authorization was cancelled",
          );
        }

        if (!code) {
          throw new Error("No authorization code received");
        }

        setMessage("Exchanging authorization code...");

        // Determine provider from state or URL
        const provider = state?.includes("outlook") ? "outlook" : "gmail";
        let account;

        if (provider === "gmail") {
          account = await emailService.exchangeCodeForTokens(code);
          setMessage("Connected to Gmail successfully");
        } else {
          account = await outlookService.exchangeCodeForTokens(code);
          setMessage("Connected to Outlook successfully");
        }

        // Store account in localStorage (in production, store securely)
        const existingAccounts = JSON.parse(
          localStorage.getItem("emailAccounts") || "[]",
        );
        const updatedAccounts = [...existingAccounts, account];
        localStorage.setItem("emailAccounts", JSON.stringify(updatedAccounts));

        setStatus("success");

        toast({
          title: "Email Account Connected",
          description: `Successfully connected ${account.email}`,
        });

        // Redirect back to discovery page after a short delay
        setTimeout(() => {
          navigate("/bill-discovery?tab=email&connected=true");
        }, 2000);
      } catch (error) {
        console.error("OAuth callback error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Authorization failed";

        setStatus("error");
        setMessage(errorMessage);

        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    handleOAuth();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center space-y-6">
          {status === "loading" && (
            <>
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Connecting Your Account
                </h2>
                <p className="text-gray-600">{message}</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Account Connected!
                </h2>
                <p className="text-gray-600">{message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Redirecting you back to BillBuddy...
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Connection Failed
                </h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => navigate("/bill-discovery")}
                    className="w-full"
                  >
                    Back to Discovery
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
