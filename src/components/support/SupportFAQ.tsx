
import { HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const SupportFAQ = () => {
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

  return (
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
  );
};
