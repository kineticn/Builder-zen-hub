import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Users,
  UserPlus,
  Settings,
  Crown,
  Edit,
  Trash2,
  Home,
  Building,
  UserCheck,
  Mail,
  Copy,
  MoreHorizontal,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { tokens } from "@/design-tokens";

interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
  status: "active" | "pending" | "inactive";
  joinedAt: string;
  lastActive: string;
}

interface Household {
  id: string;
  name: string;
  type: "home" | "rental" | "parents" | "shared";
  icon: React.ReactNode;
  role: "owner" | "editor" | "viewer";
  totalMonthlyOutflow: number;
  upcomingJointBills: number;
  members: HouseholdMember[];
  inviteCode: string;
  isPrivate: boolean;
}

const mockHouseholds: Household[] = [
  {
    id: "home",
    name: "Primary Home",
    type: "home",
    icon: <Home className="h-4 w-4" />,
    role: "owner",
    totalMonthlyOutflow: 2260.48,
    upcomingJointBills: 4,
    isPrivate: false,
    inviteCode: "HOME-ABC123",
    members: [
      {
        id: "user1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "owner",
        status: "active",
        joinedAt: "2023-01-15",
        lastActive: "2024-12-15",
      },
      {
        id: "user2",
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "editor",
        status: "active",
        joinedAt: "2023-01-15",
        lastActive: "2024-12-14",
      },
    ],
  },
  {
    id: "rental",
    name: "Rental Property",
    type: "rental",
    icon: <Building className="h-4 w-4" />,
    role: "owner",
    totalMonthlyOutflow: 890.0,
    upcomingJointBills: 2,
    isPrivate: true,
    inviteCode: "RENT-XYZ789",
    members: [
      {
        id: "user1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "owner",
        status: "active",
        joinedAt: "2023-06-01",
        lastActive: "2024-12-15",
      },
    ],
  },
  {
    id: "parents",
    name: "Parents' House",
    type: "parents",
    icon: <Users className="h-4 w-4" />,
    role: "editor",
    totalMonthlyOutflow: 1540.25,
    upcomingJointBills: 3,
    isPrivate: false,
    inviteCode: "FAM-DEF456",
    members: [
      {
        id: "user3",
        name: "Robert Johnson Sr.",
        email: "dad@example.com",
        role: "owner",
        status: "active",
        joinedAt: "2023-03-10",
        lastActive: "2024-12-13",
      },
      {
        id: "user1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "editor",
        status: "active",
        joinedAt: "2023-03-15",
        lastActive: "2024-12-15",
      },
      {
        id: "user4",
        name: "Mary Johnson",
        email: "mom@example.com",
        role: "editor",
        status: "active",
        joinedAt: "2023-03-10",
        lastActive: "2024-12-12",
      },
    ],
  },
];

/**
 * Household management page for creating, editing, and managing households
 * Includes member management, invitations, and household settings
 * Mobile-first responsive design with role-based permissions
 */
const HouseholdManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [households] = useState<Household[]>(mockHouseholds);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(
    null,
  );
  const [showInviteCode, setShowInviteCode] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleColor = (role: HouseholdMember["role"]) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "editor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "viewer":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: HouseholdMember["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const canManageHousehold = (household: Household) => {
    return household.role === "owner" || household.role === "editor";
  };

  const handleCopyInviteCode = (inviteCode: string) => {
    navigator.clipboard.writeText(inviteCode);
    toast({
      title: "Invite code copied",
      description:
        "Share this code with others to invite them to your household.",
    });
  };

  const handleCreateHousehold = () => {
    navigate("/household/create");
  };

  const handleInviteUser = (householdId: string) => {
    navigate(`/household/${householdId}/invite`);
  };

  const handleEditHousehold = (householdId: string) => {
    navigate(`/household/${householdId}/edit`);
  };

  const handleDeleteHousehold = (household: Household) => {
    if (household.role !== "owner") {
      toast({
        title: "Permission denied",
        description: "Only household owners can delete households.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Household deleted",
      description: `${household.name} has been deleted.`,
    });
  };

  const handleRemoveMember = (householdId: string, memberId: string) => {
    toast({
      title: "Member removed",
      description: "The member has been removed from the household.",
    });
  };

  const handleUpdateMemberRole = (
    householdId: string,
    memberId: string,
    newRole: HouseholdMember["role"],
  ) => {
    toast({
      title: "Role updated",
      description: `Member role has been updated to ${newRole}.`,
    });
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
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Household Management</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateHousehold}
            className="text-white hover:bg-white/10 p-2"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-navy-200 text-sm">
          Manage your households, invite members, and control access
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={handleCreateHousehold}
            className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 h-12"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Household</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/household/join")}
            className="flex items-center justify-center space-x-2 h-12"
          >
            <UserPlus className="h-5 w-5" />
            <span>Join Household</span>
          </Button>
        </div>

        {/* Households List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Households
          </h2>

          {households.map((household) => (
            <Card key={household.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                      {household.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {household.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant="outline"
                          className={getRoleColor(household.role)}
                        >
                          {household.role}
                        </Badge>
                        {household.isPrivate && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canManageHousehold(household) && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleInviteUser(household.id)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Members
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditHousehold(household.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Household
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={() => setSelectedHousehold(household)}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        View Members
                      </DropdownMenuItem>
                      {household.role === "owner" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Household
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Household?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{household.name}"
                                and remove all members. This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteHousehold(household)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Household
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {household.members.length}
                    </p>
                    <p className="text-xs text-gray-500">Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-teal-600">
                      {formatCurrency(household.totalMonthlyOutflow)}
                    </p>
                    <p className="text-xs text-gray-500">Monthly Bills</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-amber-600">
                      {household.upcomingJointBills}
                    </p>
                    <p className="text-xs text-gray-500">Upcoming</p>
                  </div>
                </div>

                {/* Invite Code */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Invite Code
                      </p>
                      <p className="text-xs text-gray-500">
                        Share this code to invite others
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <code
                        className={cn(
                          "px-2 py-1 bg-white border rounded text-sm font-mono",
                          showInviteCode === household.id
                            ? "text-gray-900"
                            : "text-transparent bg-gray-300",
                        )}
                      >
                        {showInviteCode === household.id
                          ? household.inviteCode
                          : "••••••••"}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (showInviteCode === household.id) {
                            handleCopyInviteCode(household.inviteCode);
                          } else {
                            setShowInviteCode(household.id);
                          }
                        }}
                        className="h-8 w-8 p-0"
                      >
                        {showInviteCode === household.id ? (
                          <Copy className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Member Details Modal */}
        {selectedHousehold && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  {selectedHousehold.icon}
                  <span>{selectedHousehold.name} Members</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedHousehold(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedHousehold.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-teal-100 text-teal-700">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant="outline"
                            className={getRoleColor(member.role)}
                          >
                            {member.role}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getStatusColor(member.status)}
                          >
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {canManageHousehold(selectedHousehold) &&
                      member.role !== "owner" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateMemberRole(
                                  selectedHousehold.id,
                                  member.id,
                                  "editor",
                                )
                              }
                            >
                              Make Editor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateMemberRole(
                                  selectedHousehold.id,
                                  member.id,
                                  "viewer",
                                )
                              }
                            >
                              Make Viewer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRemoveMember(
                                  selectedHousehold.id,
                                  member.id,
                                )
                              }
                              className="text-red-600 focus:text-red-600"
                            >
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                  </div>
                ))}
              </div>

              {canManageHousehold(selectedHousehold) && (
                <Button
                  onClick={() => handleInviteUser(selectedHousehold.id)}
                  className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite New Member
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default HouseholdManagementPage;
