import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2 bg-background hover:bg-muted border-2 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-2xl font-bold">Get in Touch</CardTitle>
              <p className="text-muted-foreground">
                Have a question or need help? We're here to assist you.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-xl font-bold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-sm text-muted-foreground">support@banqa.com</p>
                    <p className="text-sm text-muted-foreground">help@banqa.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-sm text-muted-foreground">+234 (0) 123 456 7890</p>
                    <p className="text-sm text-muted-foreground">+234 (0) 987 654 3210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-sm text-muted-foreground">
                      123 Financial District<br />
                      Victoria Island, Lagos<br />
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-xl font-bold">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h4 className="font-semibold text-sm">How do I reset my password?</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the "Forgot Password" link on the login page to reset your password.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">What are the transaction limits?</h4>
                  <p className="text-sm text-muted-foreground">
                    Transaction limits vary by account type and verification level. Check your account settings for details.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">How long do transfers take?</h4>
                  <p className="text-sm text-muted-foreground">
                    Most transfers are processed instantly, while bank transfers may take 1-2 business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
