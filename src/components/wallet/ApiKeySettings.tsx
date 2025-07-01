
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Key } from 'lucide-react';

export const ApiKeySettings = () => {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid Resend API key",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // This would typically be handled through a secure backend
      // For now, we'll show a message to configure it in Supabase
      toast({
        title: "API Key Configuration",
        description: "Please add RESEND_API_KEY to your Supabase Edge Functions secrets",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Configuration
        </CardTitle>
        <CardDescription>
          Configure your Resend API key for email notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resend-key">Resend API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="resend-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Resend API key"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleSaveApiKey} disabled={loading}>
              Save
            </Button>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">How to get your Resend API key:</h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>1. Go to <a href="https://resend.com" target="_blank" rel="noopener" className="text-blue-600 underline">resend.com</a> and sign up</li>
            <li>2. Verify your domain at <a href="https://resend.com/domains" target="_blank" rel="noopener" className="text-blue-600 underline">resend.com/domains</a></li>
            <li>3. Create an API key at <a href="https://resend.com/api-keys" target="_blank" rel="noopener" className="text-blue-600 underline">resend.com/api-keys</a></li>
            <li>4. Add it to Supabase Edge Functions secrets as RESEND_API_KEY</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
