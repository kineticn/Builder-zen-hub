import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  Home,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { tokens } from "@/design-tokens";

interface HouseholdInfo {
  id: string;
  name: string;
  type: "home" | "rental" | "parents" | "shared";
  memberCount: number;
  isPrivate: boolean;
  description: string;
  owner: string;
}

/**
 * Join household page for joining existing households via invite code
 * Validates invite codes and shows household information before joining
 * Mobile-first responsive design with clear joining process
 */
const JoinHouseholdPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [householdInfo, setHouseholdInfo] = useState<HouseholdInfo | null>(
    null,
  );
  const [error, setError] = useState("");

  const handleValidateCode = async () => {
    if (!inviteCode.trim()) {
      setError("Please enter an invite code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to validate invite code
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation - in real app this would be an API call
      const validCodes = ["HOME-ABC123", "RENT-XYZ789", "FAM-DEF456"];

      if (!validCodes.includes(inviteCode.toUpperCase())) {
        setError("Invalid invite code. Please check and try again.");
        setHouseholdInfo(null);
        return;
      }

      // Mock household info - in real app this would come from API
      const mockHouseholdInfo: HouseholdInfo = {
        id: "home",
        name: inviteCode.startsWith("HOME")
          ? "Johnson Family Home"
          : inviteCode.startsWith("RENT")
            ? "Downtown Rental"
            : "Parents' House",
        type: inviteCode.startsWith("HOME")
          ? "home"
          : inviteCode.startsWith("RENT")
            ? "rental"
            : "parents",
        memberCount: Math.floor(Math.random() * 4) + 2,
        isPrivate: false,
        description:
          "A well-organized household that shares bills and expenses efficiently.",
        owner: "Sarah Johnson",
      };

      setHouseholdInfo(mockHouseholdInfo);
    } catch (error) {
      setError("Error validating invite code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinHousehold = async () => {
    if (!householdInfo) return;

    setIsLoading(true);

    try {
      // Simulate API call to join household
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Successfully joined household!",
        description: `You are now a member of ${householdInfo.name}.`,
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error joining household",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: HouseholdInfo["type"]) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5" />;
      case "rental":
        return <Home className="h-5 w-5" />;
      case "parents":
        return <Users className="h-5 w-5" />;
      case "shared":
        return <Users className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: HouseholdInfo["type"]) => {
    switch (type) {
      case "home":
        return "Primary Home";
      case "rental":
        return "Rental Property";
      case "parents":
        return "Family Home";
      case "shared":
        return "Shared Living";
      default:
        return "Household";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div
        className="bg-gradient-to-r text-white p-6 pt-12"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.primary.navy[900]}, ${tokens.colors.primary.navy[800]})`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/household/manage")}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Join Household</h1>
          <div className="w-10"></div>
        </div>
        <p className="text-navy-200 text-sm">
          Enter an invite code to join an existing household
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Invite Code Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Enter Invite Code</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value.toUpperCase());
                    setError("");
                    setHouseholdInfo(null);
                  }}
                  placeholder="HOME-ABC123"
                  className={cn(
                    "font-mono text-center tracking-wider",
                    error && "border-red-500",
                  )}
                  maxLength={11}
                />
                <Button
                  onClick={handleValidateCode}
                  disabled={isLoading || !inviteCode.trim()}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Validate"
                  )}
                </Button>
              </div>
              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Ask the household owner for their invite code</p>
              <p className="mt-1">Format: XXXX-XXXXXX (e.g., HOME-ABC123)</p>
            </div>
          </CardContent>
        </Card>

        {/* Household Information */}
        {householdInfo && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span>Household Found</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-teal-100 rounded-lg text-teal-600">
                  {getTypeIcon(householdInfo.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {householdInfo.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">
                      {getTypeLabel(householdInfo.type)}
                    </Badge>
                    {householdInfo.isPrivate && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {householdInfo.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    {householdInfo.memberCount}
                  </p>
                  <p className="text-xs text-gray-500">Current Members</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">
                    {householdInfo.owner}
                  </p>
                  <p className="text-xs text-gray-500">Household Owner</p>
                </div>
              </div>

              <Button
                onClick={handleJoinHousehold}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Joining...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Join {householdInfo.name}</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900">
                Where to find invite codes:
              </h4>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Ask the household owner to share their invite code</li>
                <li>Check any invitation emails or messages you received</li>
                <li>Look for QR codes shared by household members</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Troubleshooting:</h4>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Make sure the code is entered exactly as shared</li>
                <li>Check that the invitation hasn't expired</li>
                <li>Contact the household owner if the code doesn't work</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => navigate("/household/manage")}
                className="w-full"
              >
                Create Your Own Household Instead
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default JoinHouseholdPage;
