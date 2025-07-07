
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, Upload, Download, Share2, Scan } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRPaymentData {
  type: 'bill_payment' | 'money_transfer';
  amount: number;
  recipient?: string;
  serviceType?: string;
  billReference?: string;
  description?: string;
}

export const QRCodePayments: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'scan'>('generate');
  const [paymentData, setPaymentData] = useState<QRPaymentData>({
    type: 'bill_payment',
    amount: 0
  });
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = () => {
    if (paymentData.amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const qrData = {
      ...paymentData,
      timestamp: Date.now(),
      app: 'banqa'
    };
    
    setQrCodeData(JSON.stringify(qrData));
    toast({
      title: "QR Code Generated",
      description: "QR code is ready for sharing"
    });
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to scan QR codes",
        variant: "destructive"
      });
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsScanning(false);
    }
  };

  const shareQRCode = async () => {
    if (!qrCodeData) return;
    
    try {
      await navigator.share({
        title: 'Banqa Payment QR Code',
        text: `Pay ₦${paymentData.amount.toLocaleString()} via Banqa`,
        url: `banqa://pay?data=${encodeURIComponent(qrCodeData)}`
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(qrCodeData);
      toast({
        title: "Copied to Clipboard",
        description: "QR code data copied to clipboard"
      });
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button 
          variant={mode === 'generate' ? 'default' : 'outline'}
          onClick={() => setMode('generate')}
        >
          <QrCode className="h-4 w-4 mr-2" />
          Generate QR
        </Button>
        <Button 
          variant={mode === 'scan' ? 'default' : 'outline'}
          onClick={() => setMode('scan')}
        >
          <Scan className="h-4 w-4 mr-2" />
          Scan QR
        </Button>
      </div>

      {mode === 'generate' && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Payment QR Code</CardTitle>
            <CardDescription>
              Create a QR code for bill payments or money transfers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={paymentData.type === 'bill_payment' ? 'default' : 'outline'}
                onClick={() => setPaymentData({...paymentData, type: 'bill_payment'})}
              >
                Bill Payment
              </Button>
              <Button
                variant={paymentData.type === 'money_transfer' ? 'default' : 'outline'}
                onClick={() => setPaymentData({...paymentData, type: 'money_transfer'})}
              >
                Money Transfer
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount (₦)</label>
              <Input
                type="number"
                value={paymentData.amount || ''}
                onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value) || 0})}
                placeholder="Enter amount"
              />
            </div>

            {paymentData.type === 'bill_payment' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Service Type</label>
                  <Input
                    value={paymentData.serviceType || ''}
                    onChange={(e) => setPaymentData({...paymentData, serviceType: e.target.value})}
                    placeholder="e.g., Electricity, Water, Internet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bill Reference</label>
                  <Input
                    value={paymentData.billReference || ''}
                    onChange={(e) => setPaymentData({...paymentData, billReference: e.target.value})}
                    placeholder="Bill reference number"
                  />
                </div>
              </>
            )}

            {paymentData.type === 'money_transfer' && (
              <div>
                <label className="block text-sm font-medium mb-2">Recipient</label>
                <Input
                  value={paymentData.recipient || ''}
                  onChange={(e) => setPaymentData({...paymentData, recipient: e.target.value})}
                  placeholder="Recipient Banqa ID or phone number"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <Input
                value={paymentData.description || ''}
                onChange={(e) => setPaymentData({...paymentData, description: e.target.value})}
                placeholder="Payment description"
              />
            </div>

            <Button onClick={generateQRCode} className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>

            {qrCodeData && (
              <div className="p-4 border rounded-lg text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-gray-400" />
                  <div className="absolute text-xs text-gray-600">QR Code Preview</div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button size="sm" onClick={shareQRCode}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {mode === 'scan' && (
        <Card>
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>
              Scan a QR code to make payments instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isScanning ? (
              <div className="text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-gray-100 flex items-center justify-center rounded-lg">
                  <Camera className="h-24 w-24 text-gray-400" />
                </div>
                <Button onClick={startScanning} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <div className="absolute inset-4 border-2 border-white rounded-lg pointer-events-none">
                    <div className="w-full h-full border border-dashed border-white/50"></div>
                  </div>
                </div>
                <Button onClick={stopScanning} variant="outline" className="w-full">
                  Stop Scanning
                </Button>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
