
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

// Page imports
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import VerifyOTP from '@/pages/auth/VerifyOTP';
import Dashboard from '@/pages/Dashboard';
import PayBills from '@/pages/PayBills';
import Wallet from '@/pages/Wallet';
import Advanced from '@/pages/Advanced';
import History from '@/pages/History';
import Support from '@/pages/Support';
import ContactUs from '@/pages/ContactUs';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import KYCDocuments from '@/pages/KYCDocuments';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <Router>
                <div className="App">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/contact" element={<ContactUs />} />
                    
                    {/* Protected routes with layout */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Dashboard />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/pay-bills" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <PayBills />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/wallet" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Wallet />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/advanced" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Advanced />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <History />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Profile />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/profile/complete" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Profile />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/kyc/documents" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <KYCDocuments />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/support" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Support />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </Router>
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
