import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { api } from '@/convex/_generated/api';
import { fetchAction } from 'convex/nextjs'; // Add this import

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

    // Generate OTP using Convex persistent backend
    let otpResult;
    try {
      // Use fetchAction to call the public action
      otpResult = await fetchAction(api.otpActions.publicGenerateOtp, {
        email,
      });
    } catch (err: any) {
      if (err.message && err.message.includes('Too many OTP requests')) {
        return NextResponse.json(
          { error: 'Too many OTP requests. Please try again later.' },
          { status: 429 }
        );
      }
      console.error('Error generating OTP:', err);
      return NextResponse.json(
        { error: 'Failed to generate OTP' },
        { status: 500 }
      );
    }

    // Rest of your code remains the same...
    const otpCode = otpResult.code;
    const token = otpResult.token;
    const expiresAt = otpResult.expiresAt;

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
      token: token,
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