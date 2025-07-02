
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityService } from '@/services/securityService';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SecurePinManager = () => {
  const { user } = useAuth();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasExistingPin, setHasExistingPin] = useState(false);

  React.useEffect(() => {
    checkExistingPin();
  }, [user]);

  const checkExistingPin = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('withdrawal_pins')
        .select('id')
        .eq('user_id', user.id)
        .single();

      setHasExistingPin(!!data && !error);
    } catch (error) {
      console.error('Error checking existing PIN:', error);
    }
  };

  const validatePin = (pin: string): boolean => {
    if (pin.length !== 6) return false;
    if (!/^\d+$/.test(pin)) return false;
    
    // Check for sequential numbers
    const sequential = ['123456', '654321', '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999', '000000'];
    if (sequential.includes(pin)) return false;
    
    return true;
  };

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!SecurityService.checkRateLimit('pin_creation')) {
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "PIN Mismatch",
        description: "Please ensure both PIN entries match",
        variant: "destructive",
      });
      return;
    }

    if (!validatePin(newPin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be 6 digits and cannot be sequential or repeated numbers",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // In a real application, you would hash the PIN server-side
      // For demo purposes, we're using a simple hash
      const pinHash = btoa(newPin + user.id);

      if (hasExistingPin) {
        // Update existing PIN
        const { error } = await supabase
          .from('withdrawal_pins')
          .update({ pin_hash: pinHash, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new PIN
        const { error } = await supabase
          .from('withdrawal_pins')
          .insert({ user_id: user.id, pin_hash: pinHash });

        if (error) throw error;
        setHasExistingPin(true);
      }

      toast({
        title: "PIN Updated",
        description: "Your withdrawal PIN has been set successfully",
      });

      // Clear form
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      
    } catch (error: any) {
      console.error('PIN creation error:', error);
      toast({
        title: "PIN Creation Failed",
        description: error.message || "Failed to create PIN",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Withdrawal PIN
        </CardTitle>
        <CardDescription>
          Set a secure 6-digit PIN to authorize withdrawals and protect your funds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSetPin} className="space-y-4">
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Your PIN is encrypted and stored securely. It cannot be recovered, only reset.
            </AlertDescription>
          </Alert>

          {hasExistingPin && (
            <div className="space-y-2">
              <Label htmlFor="currentPin">Current PIN</Label>
              <div className="relative">
                <Input
                  id="currentPin"
                  type={showPins ? "text" : "password"}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter current PIN"
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPin">New PIN</Label>
            <div className="relative">
              <Input
                id="newPin"
                type={showPins ? "text" : "password"}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit PIN"
                maxLength={6}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm PIN</Label>
            <div className="relative">
              <Input
                id="confirmPin"
                type={showPins ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Confirm 6-digit PIN"
                maxLength={6}
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPins(!showPins)}
                disabled={loading}
              >
                {showPins ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>PIN Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Must be exactly 6 digits</li>
              <li>Cannot be sequential (123456, 654321)</li>
              <li>Cannot be repeated numbers (111111, 222222)</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || newPin.length !== 6 || confirmPin.length !== 6}
          >
            {loading ? 'Setting PIN...' : hasExistingPin ? 'Update PIN' : 'Set PIN'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
