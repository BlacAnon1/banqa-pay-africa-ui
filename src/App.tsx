
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Main App Pages
import Index from "./pages/Index";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import PayBills from "./pages/PayBills";
import Loans from "./pages/Loans";
import History from "./pages/History";
import Wallet from "./pages/Wallet";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

// Legal Pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";

// Profile and KYC Pages
import ProfileCompletion from "./components/profile/ProfileCompletion";
import DocumentUpload from "./components/kyc/DocumentUpload";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Root route */}
                    <Route path="/" element={<Index />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    
                    {/* Legal Pages - Public Routes */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                    
                    {/* Protected App Routes with AppLayout */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="pay-bills" element={<PayBills />} />
                      <Route path="loans" element={<Loans />} />
                      <Route path="history" element={<History />} />
                      <Route path="wallet" element={<Wallet />} />
                      <Route path="support" element={<Support />} />
                      <Route path="profile/complete" element={<ProfileCompletion />} />
                      <Route path="kyc/documents" element={<DocumentUpload />} />
                    </Route>
                    
                    {/* Legacy /app routes for backward compatibility */}
                    <Route path="/app/dashboard" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/app/pay-bills" element={<Navigate to="/pay-bills" replace />} />
                    <Route path="/app/loans" element={<Navigate to="/loans" replace />} />
                    <Route path="/app/history" element={<Navigate to="/history" replace />} />
                    <Route path="/app/wallet" element={<Navigate to="/wallet" replace />} />
                    <Route path="/app/support" element={<Navigate to="/support" replace />} />
                    <Route path="/app/profile/complete" element={<Navigate to="/profile/complete" replace />} />
                    <Route path="/app/kyc/documents" element={<Navigate to="/kyc/documents" replace />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
