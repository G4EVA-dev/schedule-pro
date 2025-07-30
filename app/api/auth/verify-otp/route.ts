// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { fetchAction } from 'convex/nextjs'; 

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    console.log('Verifying OTP for:', email, 'with code:', otp);

    // Call Convex persistent OTP verification with empty token for registration check
    let result;
    try {
      result = await fetchAction(api.otpActions.publicVerifyOtp, {
        email,
        code: otp,
        token: '', // Empty token triggers registration check mode
      });
    } catch (err: any) {
      console.error('Convex verification error:', err);
      return NextResponse.json(
        { success: false, error: 'Verification failed' },
        { status: 500 }
      );
    }
    
    if (!result.valid) {
      console.log('Verification failed:', result.reason);
      return NextResponse.json(
        { success: false, error: result.reason || 'Invalid or expired OTP' },
        { status: 400 }
      );
    }
    
    console.log('Verification successful');
    return NextResponse.json({ 
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}