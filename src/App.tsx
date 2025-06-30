
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
                
                {/* Main App Routes */}
                <Route path="/app" element={<AppLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="pay-bills" element={<PayBills />} />
                  <Route path="history" element={<History />} />
                  <Route path="wallet" element={<Wallet />} />
                  <Route path="support" element={<Support />} />
                  <Route path="profile/complete" element={<ProfileCompletion />} />
                  <Route path="kyc/documents" element={<DocumentUpload />} />
                </Route>
                
                {/* Direct dashboard route for development */}
                <Route path="/dashboard" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                </Route>
                
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
