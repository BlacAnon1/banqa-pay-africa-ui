
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make transactions, or contact us for support.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Personal information (name, email, phone number)</li>
                <li>Financial information (bank account details, transaction history)</li>
                <li>Identity verification documents</li>
                <li>Device and usage information</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>To provide and maintain our financial services</li>
                <li>To process transactions and payments</li>
                <li>To verify your identity and prevent fraud</li>
                <li>To communicate with you about your account</li>
                <li>To comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Information Sharing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information only in specific circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>With service providers who assist in our operations</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Data Security</h3>
              <p className="text-sm text-muted-foreground">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
                secure servers, and regular security audits.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
              <p className="text-sm text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
              <p className="text-sm text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Email: privacy@banqa.com</p>
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

export default PrivacyPolicy;
