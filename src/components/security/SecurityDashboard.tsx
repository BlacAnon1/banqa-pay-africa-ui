
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Clock, Lock, Key } from 'lucide-react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { useAuth } from '@/contexts/AuthContext';
import { SecurePinManager } from './SecurePinManager';

export const SecurityDashboard = () => {
  const { user, profile } = useAuth();
  const { securityStatus, lastSecurityCheck } = useSecurityMonitoring();
  const [showPinManager, setShowPinManager] = React.useState(false);

  const getSecurityStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSecurityIcon = (status: string) => {
    switch (status) {
      case 'secure':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const securityChecks = [
    {
      name: 'Account Verification',
      status: profile?.verification_level === 'verified' ? 'complete' : 'pending',
      description: 'Identity verification status'
    },
    {
      name: 'Email Verification',
      status: user?.email_confirmed_at ? 'complete' : 'pending',
      description: 'Email address confirmation'
    },
    {
      name: 'Two-Factor Authentication',
      status: profile?.two_factor_enabled ? 'complete' : 'pending',
      description: 'Additional security layer'
    },
    {
      name: 'Withdrawal PIN',
      status: 'unknown', // Would be determined by checking withdrawal_pins table
      description: 'Secure PIN for fund withdrawals'
    }
  ];

  if (showPinManager) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Security Settings</h2>
          <Button
            variant="outline"
            onClick={() => setShowPinManager(false)}
          >
            Back to Security Dashboard
          </Button>
        </div>
        <SecurePinManager />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Dashboard</h2>
        <Badge className={getSecurityStatusColor(securityStatus)}>
          {getSecurityIcon(securityStatus)}
          <span className="ml-2 capitalize">{securityStatus}</span>
        </Badge>
      </div>

      {securityStatus === 'critical' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Critical security issue detected. Please review your account immediately.
          </AlertDescription>
        </Alert>
      )}

      {securityStatus === 'warning' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Security warning: Unusual activity detected. Please review your recent transactions.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
            <CardDescription>
              Overall security health of your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{check.name}</p>
                  <p className="text-sm text-muted-foreground">{check.description}</p>
                </div>
                <Badge 
                  variant={check.status === 'complete' ? 'default' : 'secondary'}
                  className={check.status === 'complete' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {check.status === 'complete' ? 'Complete' : 'Pending'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Actions
            </CardTitle>
            <CardDescription>
              Manage your security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setShowPinManager(true)}
              className="w-full justify-start"
              variant="outline"
            >
              <Key className="h-4 w-4 mr-2" />
              Manage Withdrawal PIN
            </Button>
            
            <Button
              className="w-full justify-start"
              variant="outline"
              disabled
            >
              <Shield className="h-4 w-4 mr-2" />
              Enable Two-Factor Auth (Coming Soon)
            </Button>
            
            <Button
              className="w-full justify-start"
              variant="outline"
              disabled
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete KYC Verification (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>

      {lastSecurityCheck && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Security Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Last security check: {lastSecurityCheck.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Continuous monitoring active for suspicious activities, unauthorized access attempts, and unusual transaction patterns.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
