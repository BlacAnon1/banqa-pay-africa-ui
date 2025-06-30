
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('Index page - loading:', loading, 'isAuthenticated:', isAuthenticated);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <p className="text-emerald-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // For development, always redirect to dashboard since we're using mock auth
  return <Navigate to="/dashboard" replace />;
};

export default Index;
