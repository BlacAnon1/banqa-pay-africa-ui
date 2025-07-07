
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, CheckCircle, AlertCircle, CreditCard, Smartphone } from 'lucide-react';
import { SecurityService } from '@/services/securityService';
import { toast } from '@/hooks/use-toast';

interface BankVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bankAccount: {
    id: string;
    bank_name: string;
    account_name: string;
    account_number: string;
    verification_status: string;
    is_verified: boolean;
  } | null;
}

export const BankVerificationModal = ({ open, onOpenChange, bankAccount }: BankVerificationModalProps) => {
  const [verificationMethod, setVerificationMethod] = useState<'micro_deposit' | 'instant'>('micro_deposit');
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationInitiated, setVerificationInitiated] = useState(false);

  if (!bankAccount) return null;

  const handleInitiateVerification = async () => {
    setLoading(true);
    try {
      const result = await SecurityService.initiateBankVerification(bankAccount.id, verificationMethod);
      
      if (result.success) {
        setVerificationInitiated(true);
        toast({
          title: "Verification Initiated",
          description: result.message,
        });
      } else {
        toast({
          title: "Verification Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification initiation error:', error);
      toast({
        title: "Error",
        description: "Failed to initiate verification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAmounts = async () => {
    if (!amount1 || !amount2) {
      toast({
        title: "Missing Information",
        description: "Please enter both deposit amounts",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await SecurityService.verifyMicroDeposits(
        bankAccount.id,
        parseInt(amount1),
        parseInt(amount2)
      );
      
      if (result.success) {
        toast({
          title: "Verification Successful",
          description: result.message,
        });
        onOpenChange(false);
        // Refresh the page or update the bank account status
        window.location.reload();
      } else {
        toast({
          title: "Verification Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Amount verification error:', error);
      toast({
        title: "Error",
        description: "Failed to verify amounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatusBadge = () => {
    switch (bankAccount.verification_status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline"><Shield className="h-3 w-3 mr-1" />Not Verified</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bank Account Verification
          </DialogTitle>
          <DialogDescription>
            Verify your bank account to enable withdrawals and enhance security
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{bankAccount.bank_name}</span>
                {getVerificationStatusBadge()}
              </CardTitle>
              <CardDescription>
                {bankAccount.account_name} • ****{bankAccount.account_number.slice(-4)}
              </CardDescription>
            </CardHeader>
          </Card>

          {bankAccount.is_verified ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                This bank account is already verified and ready for use.
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs value={verificationMethod} onValueChange={(value) => setVerificationMethod(value as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="micro_deposit" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Micro Deposits
                </TabsTrigger>
                <TabsTrigger value="instant" disabled className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Instant Verification
                </TabsTrigger>
              </TabsList>

              <TabsContent value="micro_deposit" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Micro Deposit Verification</CardTitle>
                    <CardDescription>
                      We'll send two small deposits to your account within 1-2 business days
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This process typically takes 1-2 business days. You'll need to check your bank statement for the exact amounts.
                      </AlertDescription>
                    </Alert>

                    {!verificationInitiated ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">How it works:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            <li>We'll send two small deposits (usually less than $1 each) to your account</li>
                            <li>Check your bank statement in 1-2 business days</li>
                            <li>Return here and enter the exact amounts to complete verification</li>
                            <li>The deposits will be reversed after verification</li>
                          </ol>
                        </div>
                        
                        <Button 
                          onClick={handleInitiateVerification}
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? 'Initiating...' : 'Send Micro Deposits'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Micro deposits have been sent! Check your bank account in 1-2 business days.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="amount1">First Deposit Amount (cents)</Label>
                              <Input
                                id="amount1"
                                type="number"
                                placeholder="e.g., 23"
                                value={amount1}
                                onChange={(e) => setAmount1(e.target.value)}
                                min="1"
                                max="99"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="amount2">Second Deposit Amount (cents)</Label>
                              <Input
                                id="amount2"
                                type="number"
                                placeholder="e.g., 47"
                                value={amount2}
                                onChange={(e) => setAmount2(e.target.value)}
                                min="1"
                                max="99"
                              />
                            </div>
                          </div>

                          <Button 
                            onClick={handleVerifyAmounts}
                            disabled={loading || !amount1 || !amount2}
                            className="w-full"
                          >
                            {loading ? 'Verifying...' : 'Verify Amounts'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instant" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instant Verification</CardTitle>
                    <CardDescription>
                      Verify your account instantly using your online banking credentials
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Instant verification is coming soon. Please use micro deposits for now.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
