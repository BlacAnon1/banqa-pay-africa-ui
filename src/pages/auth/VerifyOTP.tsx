
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const VerifyOTP = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Verify OTP</CardTitle>
          <CardDescription>
            Enter the verification code sent to your phone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center">OTP verification will be implemented with Supabase integration.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;
