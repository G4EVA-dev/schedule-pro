// app/auth/otp/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function OTPPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'No email provided for verification',
        variant: 'destructive',
      });
      router.push('/auth/register');
      return;
    }

    // Start countdown for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown, email, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!'); // Debug log
    
    if (!email) {
      console.log('No email found');
      return;
    }

    const otpCode = otp.join('');
    console.log('OTP Code:', otpCode, 'Length:', otpCode.length); // Debug log
    
    if (otpCode.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a 6-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    console.log('Starting verification process...'); // Debug log
    setIsLoading(true);

    try {
      console.log('Making API call to verify OTP'); // Debug log
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          otp: otpCode 
        }),
      });

      console.log('Response status:', response.status); // Debug log
      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      toast({
        title: 'Success',
        description: 'Email verified successfully!',
      });

      console.log('Redirecting to dashboard...'); // Debug log
      // Redirect to dashboard or login page
      router.push('/dashboard');

    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to verify OTP',
        variant: 'destructive',
      });
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
    } finally {
      console.log('Setting loading to false'); // Debug log
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || resendDisabled) return;

    setResendDisabled(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      toast({
        title: 'Success',
        description: 'New verification code sent to your email',
      });

      // Reset countdown
      setCountdown(30);
      setOtp(['', '', '', '', '', '']);

    } catch (error) {
      console.error('Resend OTP error:', error);
      toast({
        title: 'Error',
        description: 'Failed to resend OTP. Please try again.',
        variant: 'destructive',
      });
      setResendDisabled(false);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Invalid verification request</p>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We've sent a 6-digit verification code to your email address"
      image="/placeholder.svg?height=400&width=400&text=Verify+Email"
    > 
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Verify Your Email</h1>
            <p className="text-muted-foreground mt-2">
              We've sent a 6-digit code to {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
               <Input
               key={index}
               type="text"
               maxLength={1}
               value={digit}
               onChange={(e) => {
                 const value = e.target.value.toUpperCase();
                 if (value === '' || /^[A-Z0-9]$/.test(value)) {
                   const newOtp = [...otp];
                   newOtp[index] = value;
                   setOtp(newOtp);
                   if (value && index < 5) {
                     const nextInput = e.target.nextElementSibling as HTMLInputElement;
                     if (nextInput) nextInput.focus();
                   }
                 }
               }}
               onKeyDown={(e) => {
                 if (e.key === 'Backspace' && !otp[index] && index > 0) {
                   const prevInput = e.currentTarget.previousSibling as HTMLInputElement;
                   if (prevInput) prevInput.focus();
                 }
               }}
               className="w-12 h-14 text-center text-xl font-mono"
               disabled={isLoading}
               required
             />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || otp.join('').length !== 6}
              onClick={() => console.log('Button clicked!', { otpLength: otp.join('').length, isLoading })}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Didn't receive a code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className={`font-medium ${
                  resendDisabled ? 'text-muted-foreground' : 'text-primary hover:underline'
                }`}
              >
                {resendDisabled ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}