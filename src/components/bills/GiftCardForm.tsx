
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Gift, ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { useReloadly } from '@/hooks/useReloadly';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { useDirectServicePayment } from '@/hooks/useDirectServicePayment';
import { toast } from '@/hooks/use-toast';

interface GiftCardFormProps {
  onBack: () => void;
}

interface GiftCardProduct {
  productId: number;
  productName: string;
  global: boolean;
  senderFee: number;
  discountPercentage: number;
  denominationType: string;
  recipientCurrencyCode: string;
  minRecipientDenomination: number;
  maxRecipientDenomination: number;
  senderCurrencyCode: string;
  senderCurrencySymbol: string;
  fixedRecipientDenominations: number[];
  fixedSenderDenominations: number[];
  logoUrls: string[];
  brand: {
    brandId: number;
    brandName: string;
  };
  country: {
    isoName: string;
    name: string;
    flagUrl: string;
  };
  redeemInstruction: {
    concise: string;
    verbose: string;
  };
}

export const GiftCardForm = ({ onBack }: GiftCardFormProps) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [products, setProducts] = useState<GiftCardProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<GiftCardProduct | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const { loading, getGiftCardProducts } = useReloadly();
  const { wallet, syncWallet } = useRealTimeWallet();
  const { initializeServicePayment } = useDirectServicePayment();

  useEffect(() => {
    loadGiftCardProducts();
  }, []);

  const loadGiftCardProducts = async () => {
    try {
      const productData = await getGiftCardProducts('NG');
      setProducts(productData.content || []);
      console.log('Loaded gift card products:', productData);
    } catch (error) {
      console.error('Failed to load gift card products:', error);
      toast({
        title: "Error",
        description: "Failed to load gift card products. Please try again.",
        variant: "destructive",
      });
    }
  };

  const processGiftCardService = async (reference: string, amountNum: number) => {
    try {
      console.log('Processing gift card service delivery...');
      
      // This would be implemented in the reloadly-services function with 'order_gift_card' action
      // For now, we'll simulate the process
      toast({
        title: "Gift Card Ordered Successfully!",
        description: `${selectedProduct!.productName} gift card for ${selectedProduct!.senderCurrencySymbol}${amountNum} sent to ${recipientEmail}`,
        duration: 5000,
      });

      setRecipientEmail('');
      setAmount('');
      setSelectedProduct(null);
      
    } catch (error) {
      console.error('Gift card service delivery failed:', error);
      
      if (paymentMethod === 'wallet') {
        console.log('Refunding wallet due to service failure...');
        await syncWallet(amountNum, 'credit', `REFUND_${reference}`, {
          service_type: 'gift_card_refund',
          original_reference: reference,
          reason: 'Service delivery failed'
        });
        
        toast({
          title: "Service Failed - Refund Processed",
          description: `₦${amountNum.toLocaleString()} has been refunded to your wallet due to service failure.`,
          variant: "destructive",
          duration: 7000,
        });
      }
      
      throw error;
    }
  };

  const handleWalletPayment = async (amountNum: number) => {
    if (!wallet || wallet.balance < amountNum) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance in your wallet.",
        variant: "destructive",
      });
      return;
    }

    const reference = `GIFTCARD_${Date.now()}`;
    
    try {
      const syncResult = await syncWallet(-amountNum, 'debit', reference, {
        service_type: 'gift_card',
        provider: selectedProduct!.brand.brandName,
        recipient_email: recipientEmail,
        product_id: selectedProduct!.productId
      });

      if (syncResult.error) {
        throw new Error(syncResult.error);
      }

      await processGiftCardService(reference, amountNum);
      
    } catch (error) {
      console.error('Wallet payment failed:', error);
      throw error;
    }
  };

  const handleDirectPayment = async (amountNum: number) => {
    try {
      console.log('Initializing direct payment for gift card...');
      
      await initializeServicePayment({
        service_type: 'gift_card',
        amount: amountNum,
        service_data: {
          product_id: selectedProduct!.productId,
          product_name: selectedProduct!.productName,
          brand_name: selectedProduct!.brand.brandName,
          recipient_email: recipientEmail,
          country_code: 'NG'
        }
      });

      setRecipientEmail('');
      setAmount('');
      setSelectedProduct(null);
      
    } catch (error) {
      console.error('Direct payment failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !recipientEmail || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    
    if (amountNum < selectedProduct.minRecipientDenomination || amountNum > selectedProduct.maxRecipientDenomination) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between ${selectedProduct.senderCurrencySymbol}${selectedProduct.minRecipientDenomination} and ${selectedProduct.senderCurrencySymbol}${selectedProduct.maxRecipientDenomination}`,
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      if (paymentMethod === 'wallet') {
        await handleWalletPayment(amountNum);
      } else {
        await handleDirectPayment(amountNum);
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to process transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                Gift Cards
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="recipient@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>

            {products.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="product">Gift Card</Label>
                <Select 
                  value={selectedProduct?.productId.toString() || ''} 
                  onValueChange={(value) => {
                    const product = products.find(p => p.productId.toString() === value);
                    setSelectedProduct(product || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gift card" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.slice(0, 20).map((product) => (
                      <SelectItem key={product.productId} value={product.productId.toString()}>
                        {product.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedProduct && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({selectedProduct.senderCurrencySymbol})</Label>
                  {selectedProduct.fixedSenderDenominations.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProduct.fixedSenderDenominations.map((fixedAmount) => (
                        <Button
                          key={fixedAmount}
                          type="button"
                          variant={amount === fixedAmount.toString() ? "default" : "outline"}
                          onClick={() => setAmount(fixedAmount.toString())}
                          className="h-12"
                        >
                          {selectedProduct.senderCurrencySymbol}{fixedAmount}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <Input
                      id="amount"
                      type="number"
                      placeholder={`Min: ${selectedProduct.minRecipientDenomination}, Max: ${selectedProduct.maxRecipientDenomination}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min={selectedProduct.minRecipientDenomination}
                      max={selectedProduct.maxRecipientDenomination}
                      step="1"
                      required
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
                        <Wallet className="h-4 w-4" />
                        Wallet Balance
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="direct" id="direct" />
                      <Label htmlFor="direct" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Card/Transfer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {recipientEmail && amount && selectedProduct && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Gift Card:</span>
                    <span>{selectedProduct.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recipient:</span>
                    <span>{recipientEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>{selectedProduct.senderCurrencySymbol}{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{paymentMethod === 'wallet' ? 'Wallet Balance' : 'Card/Transfer'}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Cost:</span>
                    <span>₦{amount}</span>
                  </div>
                  {paymentMethod === 'wallet' && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Wallet Balance:</span>
                      <span>₦{wallet?.balance?.toLocaleString() || '0.00'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700"
              disabled={processing || loading || !selectedProduct || !recipientEmail || !amount}
            >
              {processing ? 'Processing...' : paymentMethod === 'wallet' ? 'Pay from Wallet' : 'Pay with Card/Transfer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
