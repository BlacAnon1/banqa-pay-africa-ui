
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

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
import History from "./pages/History";
import Wallet from "./pages/Wallet";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

// Profile and KYC Pages
import ProfileCompletion from "./components/profile/ProfileCompletion";
import DocumentUpload from "./components/kyc/DocumentUpload";

const queryClient = new QueryClient();

const App = () => (
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
                
                {/* Main App Routes - Direct access with AppLayout wrapper */}
                <Route path="/dashboard" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                </Route>
                <Route path="/pay-bills" element={<AppLayout />}>
                  <Route index element={<PayBills />} />
                </Route>
                <Route path="/history" element={<AppLayout />}>
                  <Route index element={<History />} />
                </Route>
                <Route path="/wallet" element={<AppLayout />}>
                  <Route index element={<Wallet />} />
                </Route>
                <Route path="/support" element={<AppLayout />}>
                  <Route index element={<Support />} />
                </Route>
                <Route path="/profile/complete" element={<AppLayout />}>
                  <Route index element={<ProfileCompletion />} />
                </Route>
                <Route path="/kyc/documents" element={<AppLayout />}>
                  <Route index element={<DocumentUpload />} />
                </Route>
                
                {/* Legacy /app routes for backward compatibility */}
                <Route path="/app/dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/app/pay-bills" element={<Navigate to="/pay-bills" replace />} />
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
);

export default App;
