import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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

        <Card className="shadow-lg">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-3xl font-bold text-foreground">Terms of Service</CardTitle>
            <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-8 p-8">
            <section>
              <h3 className="text-lg font-semibold mb-3">Acceptance of Terms</h3>
              <p className="text-sm text-muted-foreground">
                By accessing and using Banqa's services, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do 
                not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Service Description</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Banqa provides digital financial services including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Digital wallet services</li>
                <li>Bill payment services</li>
                <li>Money transfer services</li>
                <li>Mobile recharge services</li>
                <li>Other financial services as may be offered from time to time</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">User Responsibilities</h3>
              <p className="text-sm text-muted-foreground mb-4">As a user of our services, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use our services only for lawful purposes</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Report any suspicious activity immediately</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Account Security</h3>
              <p className="text-sm text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to accept responsibility for all activities that occur under your account. 
                Banqa reserves the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Transaction Limits and Fees</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Transaction limits and fees may apply to our services. These are subject to change 
                with reasonable notice. Current limits and fees include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Daily transaction limits as specified in your account</li>
                <li>Service fees as disclosed at the time of transaction</li>
                <li>Third-party charges that may apply</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Prohibited Activities</h3>
              <p className="text-sm text-muted-foreground mb-4">You may not use our services for:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Illegal activities or money laundering</li>
                <li>Fraud or unauthorized transactions</li>
                <li>Violation of any laws or regulations</li>
                <li>Activities that harm our platform or other users</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
              <p className="text-sm text-muted-foreground">
                Banqa shall not be liable for any indirect, incidental, special, or consequential 
                damages arising out of or in connection with your use of our services, except as 
                required by applicable law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                For questions about these Terms of Service, contact us at:
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Email: legal@banqa.com</p>
                <p>Phone: +234 (0) 123 456 7890</p>
                <p>Address: Lagos, Nigeria</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
