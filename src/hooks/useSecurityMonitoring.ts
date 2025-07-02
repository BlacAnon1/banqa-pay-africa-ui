
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityService } from '@/services/securityService';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSecurityMonitoring = () => {
  const { user, profile } = useAuth();
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'critical'>('secure');
  const [lastSecurityCheck, setLastSecurityCheck] = useState<Date | null>(null);

  useEffect(() => {
    if (!user || !profile) return;

    const performSecurityCheck = async () => {
      try {
        // Check session validity
        const sessionValid = await SecurityService.validateSession();
        if (!sessionValid) {
          setSecurityStatus('critical');
          toast({
            title: "Security Alert",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          return;
        }

        // Check for suspicious transactions
        const { data: recentTransactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (recentTransactions && SecurityService.detectSuspiciousActivity(recentTransactions)) {
          setSecurityStatus('warning');
          toast({
            title: "Security Notice",
            description: "Unusual activity detected. Please review your recent transactions.",
            variant: "destructive",
          });
        }

        // Monitor for multiple device logins (simplified check)
        const userAgent = navigator.userAgent;
        const storedUserAgent = SecurityService.secureRetrieve('user_agent');
        
        if (storedUserAgent && storedUserAgent !== userAgent) {
          setSecurityStatus('warning');
          toast({
            title: "New Device Detected",
            description: "Your account is being accessed from a new device.",
          });
        }
        
        SecurityService.secureStore('user_agent', userAgent);
        setLastSecurityCheck(new Date());
        
        if (securityStatus !== 'warning' && securityStatus !== 'critical') {
          setSecurityStatus('secure');
        }

      } catch (error) {
        console.error('Security check failed:', error);
        setSecurityStatus('warning');
      }
    };

    // Perform initial security check
    performSecurityCheck();

    // Set up periodic security checks every 5 minutes
    const securityInterval = setInterval(performSecurityCheck, 5 * 60 * 1000);

    // Monitor for suspicious activity patterns
    const activityMonitor = setInterval(() => {
      // Check for rapid page navigation (potential bot activity)
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0] as PerformanceNavigationTiming;
        if (navigation.loadEventEnd - navigation.fetchStart < 100) {
          console.warn('Potential automated activity detected');
        }
      }
    }, 30000);

    return () => {
      clearInterval(securityInterval);
      clearInterval(activityMonitor);
    };
  }, [user, profile, securityStatus]);

  // Cleanup on component unmount or user logout
  useEffect(() => {
    return () => {
      if (!user) {
        SecurityService.clearSensitiveData();
      }
    };
  }, [user]);

  return {
    securityStatus,
    lastSecurityCheck
  };
};
