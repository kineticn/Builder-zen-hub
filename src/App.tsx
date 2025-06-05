import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserExperienceProvider } from "@/contexts/UserExperienceContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingWizard from "./pages/OnboardingWizard";
import Dashboard from "./pages/Dashboard";
import BillDetail from "./pages/BillDetail";
import AdminDashboard from "./pages/AdminDashboard";
import LegalComplianceAdmin from "./pages/LegalComplianceAdmin";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserExperienceProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div style={{ opacity: 1, minHeight: "100vh" }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<OnboardingWizard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bill/:id" element={<BillDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="/admin/legal-compliance"
                element={<LegalComplianceAdmin />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/activity" element={<Dashboard />} />
              <Route path="/offers" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </UserExperienceProvider>
  </QueryClientProvider>
);

export default App;
