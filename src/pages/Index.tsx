import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in or has completed onboarding
    // For demo purposes, always redirect to onboarding
    // In a real app, you'd check authentication state here
    const hasCompletedOnboarding = localStorage.getItem(
      "billbuddy_onboarding_complete",
    );

    if (hasCompletedOnboarding) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-teal-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* BillBuddy Logo */}
        <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-navy-600 rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-2xl font-bold text-white">BB</span>
        </div>

        {/* Loading indicator */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>

        <p className="text-gray-600 font-medium">Loading BillBuddy...</p>
      </div>
    </div>
  );
};

export default Index;
