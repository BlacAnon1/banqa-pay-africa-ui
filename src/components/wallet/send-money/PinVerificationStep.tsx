
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface PinVerificationStepProps {
  onPinVerified: () => void;
  onBack: () => void;
  onVerifyPin: (pin: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export const PinVerificationStep = ({ 
  onPinVerified, 
  onBack, 
  onVerifyPin, 
  loading 
}: PinVerificationStepProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleVerifyPin = async () => {
    if (!pin) {
      setError('Please enter your withdrawal PIN');
      return;
    }

    const result = await onVerifyPin(pin);
    if (result.success) {
      onPinVerified();
    } else {
      setError(result.error || 'Invalid PIN. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-semibold">Verify Your PIN</h3>
        <p className="text-sm text-muted-foreground">
          Enter your withdrawal PIN to authorize this money transfer
        </p>
      </div>

      <div>
        <Label htmlFor="pin">Withdrawal PIN</Label>
        <Input
          id="pin"
          type="password"
          placeholder="Enter your 4-digit PIN"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError('');
          }}
          maxLength={4}
          className="text-center text-lg tracking-widest"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={handleVerifyPin} 
          disabled={!pin || loading}
          className="flex-1"
        >
          {loading ? 'Verifying...' : 'Verify PIN'}
        </Button>
      </div>
    </div>
  );
};
