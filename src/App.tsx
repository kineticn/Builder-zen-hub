import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserExperienceProvider } from "@/contexts/UserExperienceContext";
import { initConsoleFilter } from "@/utils/console-filter";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import OffersPage from "./pages/OffersPage";
import ActivityPage from "./pages/ActivityPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingWizard from "./pages/OnboardingWizard";
import Dashboard from "./pages/Dashboard";
import BillDetail from "./pages/BillDetail";
import AdminDashboard from "./pages/AdminDashboard";
import LegalComplianceAdmin from "./pages/LegalComplianceAdmin";
import Settings from "./pages/Settings";
import ProfileEditPage from "./pages/ProfileEditPage";
import AddBillPage from "./pages/AddBillPage";

const queryClient = new QueryClient();

// Initialize console filtering for development
if (process.env.NODE_ENV === "development") {
  initConsoleFilter();
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserExperienceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div style={{ opacity: 1, minHeight: "100vh" }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/app" element={<Index />} />
              <Route path="/onboarding" element={<OnboardingWizard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-bill" element={<AddBillPage />} />
              <Route path="/bill/:id" element={<BillDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="/admin/legal-compliance"
                element={<LegalComplianceAdmin />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile/edit" element={<ProfileEditPage />} />
              <Route path="/activity" element={<ActivityPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </UserExperienceProvider>
  </QueryClientProvider>
);

export default App;
