
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
  
  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If not authenticated, show welcome page with login options
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-600">
            Welcome to Banqa
          </CardTitle>
          <CardDescription>
            Your gateway to financial services across Africa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/login">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="w-full">
              Create Account
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
