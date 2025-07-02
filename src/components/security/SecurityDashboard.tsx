
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Clock, User, Lock, Eye, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

export const SecurityDashboard = () => {
  const { profile } = useAuth();
  const { securityStatus, lastSecurityCheck } = useSecurityMonitoring();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'critical': return <Shield className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getVerificationBadge = () => {
    if (!profile?.verification_level) return { text: 'Unverified', variant: 'destructive' as const };
    
    switch (profile.verification_level) {
      case 'basic':
        return { text: 'Basic Verified', variant: 'secondary' as const };
      case 'enhanced':
        return { text: 'Enhanced Verified', variant: 'default' as const };
      case 'premium':
        return { text: 'Premium Verified', variant: 'default' as const };
      default:
        return { text: 'Unverified', variant: 'destructive' as const };
    }
  };

  const verificationBadge = getVerificationBadge();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Security Dashboard</h2>
        <p className="text-muted-foreground">Monitor and manage your account security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Security Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <div className={`p-2 rounded-full ${getStatusColor(securityStatus)}`}>
              {getStatusIcon(securityStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{securityStatus}</div>
            <p className="text-xs text-muted-foreground">
              Last check: {lastSecurityCheck ? lastSecurityCheck.toLocaleTimeString() : 'Never'}
            </p>
          </CardContent>
        </Card>

        {/* Account Verification */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Level</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={verificationBadge.variant}>{verificationBadge.text}</Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Higher verification increases transaction limits
            </p>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Two-Factor Auth</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={profile?.two_factor_enabled ? 'default' : 'destructive'}>
              {profile?.two_factor_enabled ? 'Enabled' : 'Disabled'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Add an extra layer of security
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Security Actions
          </CardTitle>
          <CardDescription>
            Take action to improve your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Secure your account with 2FA</p>
            </div>
            <Button variant="outline" size="sm">
              Setup 2FA
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Review Login Activity</p>
              <p className="text-sm text-muted-foreground">Check recent account access</p>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Activity
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Update Security Settings</p>
              <p className="text-sm text-muted-foreground">Manage passwords and PINs</p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
