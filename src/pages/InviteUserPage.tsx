import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Copy,
  Send,
  UserPlus,
  QrCode,
  Share2,
  Link,
  Users,
  Crown,
  Eye,
  Edit3,
  Shield,
  CheckCircle,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { tokens } from "@/design-tokens";

interface InviteFormData {
  email: string;
  phone: string;
  role: "editor" | "viewer";
  message: string;
  inviteMethod: "email" | "phone" | "link";
}

interface PendingInvite {
  id: string;
  email: string;
  role: "editor" | "viewer";
  status: "pending" | "accepted" | "expired";
  sentAt: string;
  expiresAt: string;
}

const mockHousehold = {
  id: "home",
  name: "Primary Home",
  inviteCode: "HOME-ABC123",
};

const mockPendingInvites: PendingInvite[] = [
  {
    id: "inv1",
    email: "john.doe@example.com",
    role: "editor",
    status: "pending",
    sentAt: "2024-12-14T10:30:00Z",
    expiresAt: "2024-12-21T10:30:00Z",
  },
  {
    id: "inv2",
    email: "jane.smith@example.com",
    role: "viewer",
    status: "accepted",
    sentAt: "2024-12-13T15:45:00Z",
    expiresAt: "2024-12-20T15:45:00Z",
  },
  {
    id: "inv3",
    email: "old.user@example.com",
    role: "editor",
    status: "expired",
    sentAt: "2024-12-01T09:15:00Z",
    expiresAt: "2024-12-08T09:15:00Z",
  },
];

/**
 * Invite user page for sending household invitations
 * Supports email, phone, and link-based invitations
 * Mobile-first responsive design with multiple invitation methods
 */
const InviteUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { householdId } = useParams<{ householdId: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingInvites] = useState<PendingInvite[]>(mockPendingInvites);

  const [formData, setFormData] = useState<InviteFormData>({
    email: "",
    phone: "",
    role: "editor",
    message: `Hi! You've been invited to join "${mockHousehold.name}" on BillBuddy. This will help us manage household bills together and stay organized with our payments.`,
    inviteMethod: "email",
  });

  const [errors, setErrors] = useState<Partial<InviteFormData>>({});

  const handleInputChange = (field: keyof InviteFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<InviteFormData> = {};

    if (formData.inviteMethod === "email" && !formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (
      formData.inviteMethod === "email" &&
      !isValidEmail(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.inviteMethod === "phone" && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const method =
        formData.inviteMethod === "email"
          ? "email"
          : formData.inviteMethod === "phone"
            ? "phone"
            : "link";

      toast({
        title: "Invitation sent!",
        description: `Invitation sent via ${method} to join ${mockHousehold.name}.`,
      });

      // Reset form
      setFormData((prev) => ({
        ...prev,
        email: "",
        phone: "",
        message: `Hi! You've been invited to join "${mockHousehold.name}" on BillBuddy. This will help us manage household bills together and stay organized with our payments.`,
      }));
    } catch (error) {
      toast({
        title: "Error sending invitation",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `https://billbuddy.app/invite/${mockHousehold.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Invite link copied",
      description: "Share this link with anyone you want to invite.",
    });
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(mockHousehold.inviteCode);
    toast({
      title: "Invite code copied",
      description: "Share this code for others to join your household.",
    });
  };

  const handleResendInvite = (inviteId: string) => {
    toast({
      title: "Invitation resent",
      description: "A new invitation has been sent.",
    });
  };

  const handleRevokeInvite = (inviteId: string) => {
    toast({
      title: "Invitation revoked",
      description: "The invitation has been cancelled.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: PendingInvite["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200";
      case "expired":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role: "editor" | "viewer") => {
    return role === "editor" ? (
      <Edit3 className="h-4 w-4" />
    ) : (
      <Eye className="h-4 w-4" />
    );
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
          <h1 className="text-xl font-bold">Invite Members</h1>
          <div className="w-10"></div>
        </div>
        <p className="text-navy-200 text-sm">
          Invite others to join {mockHousehold.name}
        </p>
      </div>

      <div className="p-6 space-y-6">
        <Tabs defaultValue="invite" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invite" className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Send Invite</span>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>
                Pending (
                {pendingInvites.filter((i) => i.status === "pending").length})
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Send Invite Tab */}
          <TabsContent value="invite" className="space-y-6">
            {/* Invite Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Choose Invitation Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange("inviteMethod", "email")}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-lg border-2 transition-colors",
                      formData.inviteMethod === "email"
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <Mail
                      className={cn(
                        "h-6 w-6 mb-2",
                        formData.inviteMethod === "email"
                          ? "text-teal-600"
                          : "text-gray-600",
                      )}
                    />
                    <span className="font-medium">Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange("inviteMethod", "phone")}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-lg border-2 transition-colors",
                      formData.inviteMethod === "phone"
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <Phone
                      className={cn(
                        "h-6 w-6 mb-2",
                        formData.inviteMethod === "phone"
                          ? "text-teal-600"
                          : "text-gray-600",
                      )}
                    />
                    <span className="font-medium">SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange("inviteMethod", "link")}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-lg border-2 transition-colors",
                      formData.inviteMethod === "link"
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <Link
                      className={cn(
                        "h-6 w-6 mb-2",
                        formData.inviteMethod === "link"
                          ? "text-teal-600"
                          : "text-gray-600",
                      )}
                    />
                    <span className="font-medium">Link</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Invite Form */}
            {formData.inviteMethod !== "link" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Invitation Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendInvite} className="space-y-4">
                    {formData.inviteMethod === "email" && (
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="user@example.com"
                          className={cn(errors.email && "border-red-500")}
                        />
                        {errors.email && (
                          <p className="text-red-600 text-sm">{errors.email}</p>
                        )}
                      </div>
                    )}

                    {formData.inviteMethod === "phone" && (
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+1 (555) 123-4567"
                          className={cn(errors.phone && "border-red-500")}
                        />
                        {errors.phone && (
                          <p className="text-red-600 text-sm">{errors.phone}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: "editor" | "viewer") =>
                          handleInputChange("role", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor">
                            <div className="flex items-center space-x-2">
                              <Edit3 className="h-4 w-4" />
                              <div>
                                <span className="font-medium">Editor</span>
                                <span className="text-xs text-gray-500 block">
                                  Can add and edit bills
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="viewer">
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4" />
                              <div>
                                <span className="font-medium">Viewer</span>
                                <span className="text-xs text-gray-500 block">
                                  Can only view bills
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Personal Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        rows={4}
                        placeholder="Add a personal message to your invitation..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-teal-600 hover:bg-teal-700"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="h-4 w-4" />
                          <span>Send Invitation</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Share Link/Code */}
            {formData.inviteMethod === "link" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share Invitation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Invite Link</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={`https://billbuddy.app/invite/${mockHousehold.inviteCode}`}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyInviteLink}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Invite Code</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={mockHousehold.inviteCode}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyInviteCode}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>QR Code</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pending Invites Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingInvites.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pending invitations
                  </h3>
                  <p className="text-gray-600 text-center">
                    Send your first invitation to start building your household
                    team.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingInvites.map((invite) => (
                  <Card key={invite.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                            {getRoleIcon(invite.role)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {invite.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant="outline"
                                className={getStatusColor(invite.status)}
                              >
                                {invite.status === "pending" && (
                                  <Clock className="h-3 w-3 mr-1" />
                                )}
                                {invite.status === "accepted" && (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                )}
                                {invite.status.charAt(0).toUpperCase() +
                                  invite.status.slice(1)}
                              </Badge>
                              <Badge variant="outline">{invite.role}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Sent {formatDate(invite.sentAt)}
                              {invite.status === "pending" &&
                                ` • Expires ${formatDate(invite.expiresAt)}`}
                            </p>
                          </div>
                        </div>

                        {invite.status === "pending" && (
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvite(invite.id)}
                            >
                              Resend
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeInvite(invite.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default InviteUserPage;
