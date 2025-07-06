
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Eye, Lock, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BiometricAuthProps {
  onSuccess: () => void;
  onFallback: () => void;
  title?: string;
  description?: string;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onSuccess,
  onFallback,
  title = "Biometric Authentication",
  description = "Use your fingerprint or face to authorize this payment"
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      if ('credentials' in navigator && 'create' in navigator.credentials) {
        const available = await (navigator.credentials as any).get({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "Banqa" },
            user: {
              id: new Uint8Array(16),
              name: "user@banqa.com",
              displayName: "Banqa User"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required"
            },
            timeout: 1000
          }
        }).catch(() => null);
        
        setIsSupported(!!available);
        setAvailableMethods(['fingerprint', 'face']);
      }
    } catch (error) {
      console.log('Biometric check failed, will use fallback');
      setIsSupported(false);
    }
  };

  const authenticateWithBiometric = async () => {
    setIsAuthenticating(true);
    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would use WebAuthn API
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        toast({
          title: "Authentication Successful",
          description: "Biometric verification completed"
        });
        onSuccess();
      } else {
        throw new Error("Biometric authentication failed");
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please try again or use PIN",
        variant: "destructive"
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSupported ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={authenticateWithBiometric}
                disabled={isAuthenticating}
                className="h-20 flex-col gap-2"
              >
                <Fingerprint className="h-6 w-6" />
                <span className="text-sm">Fingerprint</span>
              </Button>
              <Button
                variant="outline"
                onClick={authenticateWithBiometric}
                disabled={isAuthenticating}
                className="h-20 flex-col gap-2"
              >
                <Eye className="h-6 w-6" />
                <span className="text-sm">Face ID</span>
              </Button>
            </div>
            
            {isAuthenticating && (
              <div className="text-center text-sm text-muted-foreground">
                Authenticating...
              </div>
            )}
            
            <div className="text-center">
              <Button variant="ghost" onClick={onFallback}>
                Use PIN instead
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Biometric authentication not available on this device
            </p>
            <Button onClick={onFallback} className="w-full">
              Continue with PIN
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
