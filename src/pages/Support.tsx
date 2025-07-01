import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Phone, Mail, HelpCircle, Clock } from 'lucide-react';
import { LiveChatWidget } from '@/components/support/LiveChatWidget';
import { PhoneSupport } from '@/components/support/PhoneSupport';
import { EmailSupport } from '@/components/support/EmailSupport';

const Support = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const faqs = [
    {
      question: "How do I pay my electricity bill?",
      answer: "Go to Pay Bills, select Electricity, choose your provider, enter your meter number and amount, then proceed with payment."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept bank transfers, debit cards, and wallet balance. All payments are secured with bank-level encryption."
    },
    {
      question: "How long does it take for payments to reflect?",
      answer: "Most payments are processed instantly. In rare cases, it may take up to 24 hours depending on the service provider."
    },
    {
      question: "Can I get a refund if payment fails?",
      answer: "Yes, failed payments are automatically refunded to your wallet within 24 hours. You'll receive a notification once processed."
    },
    {
      question: "How do I add money to my wallet?",
      answer: "Go to Wallet, click Add Funds, enter the amount, and choose your preferred payment method (bank transfer or debit card)."
    }
  ];

  const tickets = [
    { id: 'TKT001', subject: 'Payment not reflected', status: 'open', date: '2024-12-25', priority: 'high' },
    { id: 'TKT002', subject: 'Unable to add funds', status: 'resolved', date: '2024-12-23', priority: 'medium' },
    { id: 'TKT003', subject: 'Account verification', status: 'pending', date: '2024-12-20', priority: 'low' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
        <p className="text-muted-foreground">Get help and find answers to your questions</p>
      </div>

      {/* Quick Contact */}
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
              onClick={() => setIsChatOpen(true)}
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

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Track your support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground">#{ticket.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge 
                          variant={ticket.status === 'resolved' ? 'default' : 
                                  ticket.status === 'open' ? 'destructive' : 'secondary'}
                        >
                          {ticket.status}
                        </Badge>
                        <Badge variant="outline">
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {ticket.date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
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
                  onClick={() => setIsChatOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Open Chat Window
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phone">
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
        </TabsContent>

        <TabsContent value="email">
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
        </TabsContent>
      </Tabs>

      {/* Live Chat Widget */}
      <LiveChatWidget 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
    </div>
  );
};

export default Support;
