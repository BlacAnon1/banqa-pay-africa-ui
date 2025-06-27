
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Phone, Mail, HelpCircle, Clock } from 'lucide-react';

const Support = () => {
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
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
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
            <Button variant="outline" className="w-full">
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
            <Button variant="outline" className="w-full">
              support@banqa.com
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Response within 24hrs
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="contact">Contact Form</TabsTrigger>
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

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Send us a message and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Brief description of your issue" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select className="w-full h-10 px-3 py-2 border border-input bg-background text-sm rounded-md">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Describe your issue in detail..."
                    className="min-h-32"
                  />
                </div>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Support;
