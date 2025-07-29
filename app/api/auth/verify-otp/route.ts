// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

     // Convert OTP to uppercase to handle case insensitivity
     const normalizedOtp = otp.toUpperCase();
    
     // Verify the OTP (case-insensitive)
     const isValid = verifyOTP(normalizedOtp, email, normalizedOtp);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}