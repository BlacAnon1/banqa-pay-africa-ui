
import { MessageSquare, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneSupport } from './PhoneSupport';
import { EmailSupport } from './EmailSupport';

interface SupportTabsContentProps {
  onStartChat: () => void;
}

export const SupportTabsContent = ({ onStartChat }: SupportTabsContentProps) => {
  return {
    chat: (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Live Chat Support
          </CardTitle>
          <CardDescription>Get instant help from our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="h-16 w-16 mx-auto text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start a Live Chat</h3>
            <p className="text-muted-foreground mb-4">
              Connect with our support team for instant assistance
            </p>
            <Button 
              onClick={onStartChat}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Open Chat Window
            </Button>
          </div>
        </CardContent>
      </Card>
    ),
    phone: (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Support
          </CardTitle>
          <CardDescription>Call us for direct assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <PhoneSupport />
        </CardContent>
      </Card>
    ),
    email: (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Support
          </CardTitle>
          <CardDescription>Send us a detailed message</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailSupport />
        </CardContent>
      </Card>
    )
  };
};
