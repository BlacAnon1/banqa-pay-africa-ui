
import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const EmailSupport = () => {
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'medium',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  const supportEmails = [
    {
      department: 'General Support',
      email: 'support@banqa.com',
      description: 'Account issues, payments, general inquiries',
      responseTime: '24 hours'
    },
    {
      department: 'Technical Support',
      email: 'tech@banqa.com',
      description: 'App issues, bugs, technical problems',
      responseTime: '12 hours'
    },
    {
      department: 'Business Inquiries',
      email: 'business@banqa.com',
      description: 'Partnerships, integrations, business accounts',
      responseTime: '48 hours'
    },
    {
      department: 'Security & Fraud',
      email: 'security@banqa.com',
      description: 'Security concerns, fraud reports, suspicious activity',
      responseTime: '6 hours'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'account', label: 'Account Issues' },
    { value: 'payment', label: 'Payment Problems' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'security', label: 'Security Concern' },
    { value: 'business', label: 'Business Inquiry' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would send to your backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate email sending
      const ticketId = `TKT${Date.now().toString().slice(-6)}`;
      
      setIsSubmitted(true);
      toast({
        title: "Support ticket created",
        description: `Your ticket #${ticketId} has been submitted successfully.`,
      });

      // Reset form
      setFormData({
        subject: '',
        priority: 'medium',
        category: 'general',
        message: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
          <p className="text-muted-foreground mb-4">
            We've received your message and will get back to you within 24 hours.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send us a Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject *</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background text-sm rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <div className="flex gap-2">
                {priorities.map(priority => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => handleInputChange('priority', priority.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      formData.priority === priority.value
                        ? `${priority.color} text-white`
                        : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Please describe your issue in detail..."
                className="min-h-32"
                required
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium">Before submitting:</p>
                  <ul className="mt-1 text-xs space-y-1">
                    <li>• Check our FAQ section for quick answers</li>
                    <li>• Include your account email: {profile?.email}</li>
                    <li>• For urgent issues, please call our support line</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.subject || !formData.message}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Department Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Direct Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportEmails.map((dept, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{dept.department}</h3>
                    <p className="text-sm text-emerald-600 font-medium">{dept.email}</p>
                  </div>
                  <Badge variant="outline">{dept.responseTime}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{dept.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.location.href = `mailto:${dept.email}`}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
