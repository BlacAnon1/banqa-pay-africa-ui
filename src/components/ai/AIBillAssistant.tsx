
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileImage, Upload, Camera, MessageSquare, Bot, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExtractedBillData {
  provider: string;
  amount: number;
  billType: string;
  accountNumber: string;
  dueDate?: string;
  reference?: string;
  confidence: number;
}

export const AIBillAssistant: React.FC = () => {
  const [mode, setMode] = useState<'upload' | 'text' | 'sms'>('upload');
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedBillData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Simulate AI processing with OCR
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted data - in production, this would use real OCR/AI
      const mockData: ExtractedBillData = {
        provider: 'AEDC Electricity',
        amount: 15750,
        billType: 'electricity',
        accountNumber: '1234567890',
        dueDate: '2024-01-15',
        reference: 'AEDC-2024-001234',
        confidence: 92
      };
      
      setExtractedData(mockData);
      toast({
        title: "Bill Processed",
        description: `Extracted bill data with ${mockData.confidence}% confidence`
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Could not extract bill information",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processText = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter bill information",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate AI text processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock extracted data from text analysis
      const mockData: ExtractedBillData = {
        provider: 'Lagos Water Corporation',
        amount: 8500,
        billType: 'water',
        accountNumber: '9876543210',
        dueDate: '2024-01-20',
        confidence: 87
      };
      
      setExtractedData(mockData);
      toast({
        title: "Text Processed",
        description: `Extracted bill data with ${mockData.confidence}% confidence`
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Could not extract bill information from text",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        processImage(file);
      } else {
        toast({
          title: "Unsupported File",
          description: "Please upload an image or PDF file",
          variant: "destructive"
        });
      }
    }
  };

  const payBill = () => {
    if (!extractedData) return;
    
    toast({
      title: "Redirecting to Payment",
      description: `Processing ${extractedData.billType} bill payment of ₦${extractedData.amount.toLocaleString()}`
    });
    
    // In production, this would redirect to the payment flow with pre-filled data
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle>AI Bill Assistant</CardTitle>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <CardDescription>
            Upload bill images, PDFs, or paste text to automatically extract payment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={mode === 'upload' ? 'default' : 'outline'}
              onClick={() => setMode('upload')}
              size="sm"
            >
              <FileImage className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button
              variant={mode === 'text' ? 'default' : 'outline'}
              onClick={() => setMode('text')}
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Paste Text
            </Button>
            <Button
              variant={mode === 'sms' ? 'default' : 'outline'}
              onClick={() => setMode('sms')}
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </Button>
          </div>

          {mode === 'upload' && (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-gray-600">Supports images (JPG, PNG) and PDF files</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <Button variant="outline" className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </div>
          )}

          {mode === 'text' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your bill text here... (e.g., email content, SMS message, or typed bill details)"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={6}
              />
              <Button
                onClick={processText}
                disabled={isProcessing || !textInput.trim()}
                className="w-full"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    Extract Bill Details
                  </>
                )}
              </Button>
            </div>
          )}

          {mode === 'sms' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Forward SMS Bills</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Forward bill SMS messages to our AI assistant number:
                </p>
                <div className="font-mono text-lg bg-white p-2 rounded border">
                  +234 906 000 BANQA
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Send bill SMS messages to this number and we'll automatically extract the payment details and notify you.
              </p>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Processing with AI...</span>
            </div>
          )}

          {extractedData && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-green-800">Bill Details Extracted</CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    {extractedData.confidence}% Confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Provider:</span>
                    <p className="text-sm">{extractedData.provider}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Amount:</span>
                    <p className="text-sm font-bold">₦{extractedData.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Bill Type:</span>
                    <p className="text-sm capitalize">{extractedData.billType}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Account:</span>
                    <p className="text-sm">{extractedData.accountNumber}</p>
                  </div>
                  {extractedData.dueDate && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Due Date:</span>
                      <p className="text-sm">{extractedData.dueDate}</p>
                    </div>
                  )}
                  {extractedData.reference && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Reference:</span>
                      <p className="text-sm">{extractedData.reference}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={payBill} className="flex-1">
                    <Zap className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                  <Button variant="outline" onClick={() => setExtractedData(null)}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
