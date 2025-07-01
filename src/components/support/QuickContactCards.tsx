
import { MessageSquare, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickContactCardsProps {
  onStartChat: () => void;
}

export const QuickContactCards = ({ onStartChat }: QuickContactCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="text-center">
          <MessageSquare className="h-8 w-8 mx-auto text-emerald-600 mb-2" />
          <CardTitle className="text-lg">Live Chat</CardTitle>
          <CardDescription>Chat with our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={onStartChat}
          >
            Start Chat
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Available 24/7
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="text-center">
          <Phone className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <CardTitle className="text-lg">Phone Support</CardTitle>
          <CardDescription>Call our support hotline</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = 'tel:+2347002267'}
          >
            +234 700 BANQA (22672)
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Mon-Fri 8AM-8PM
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="text-center">
          <Mail className="h-8 w-8 mx-auto text-purple-600 mb-2" />
          <CardTitle className="text-lg">Email Support</CardTitle>
          <CardDescription>Send us an email</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = 'mailto:support@banqa.com'}
          >
            support@banqa.com
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Response within 24hrs
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
