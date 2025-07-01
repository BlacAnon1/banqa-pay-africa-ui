
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface BanqaIdCardProps {
  banqaId: string;
}

export const BanqaIdCard = ({ banqaId }: BanqaIdCardProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(banqaId);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Your Banqa ID has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy Banqa ID to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
      <CardHeader>
        <CardTitle className="text-white">Your Banqa ID</CardTitle>
        <CardDescription className="text-blue-100">
          Share this ID with others to receive money
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-mono font-bold tracking-wider">
            {banqaId}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="text-white hover:bg-blue-600"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
