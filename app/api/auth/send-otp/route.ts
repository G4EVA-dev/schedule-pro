import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOTP } from '@/lib/otp';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate OTP
    const { token, expiresAt } = generateOTP(email);
    const otpCode = token.split('-')[0].slice(0, 6).toUpperCase();

    // Send email with OTP
    const { data, error } = await resend.emails.send({
      from: 'SchedulePro <onboarding@resend.dev>',
      to: email,
      subject: 'Your OTP for SchedulePro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your One-Time Password</h2>
          <p>Use the following OTP to verify your email:</p>
          <h1 style="font-size: 2.5rem; letter-spacing: 0.5rem; color: #2563eb; margin: 1.5rem 0;">
            ${otpCode}
          </h1>
          <p>This OTP is valid for 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending OTP email:', error);
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'OTP sent successfully',
      // In production, don't send the OTP back in the response
      // This is just for testing
      otp: process.env.NODE_ENV === 'development' ? otpCode : undefined
    });

  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}