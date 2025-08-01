import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { api } from '@/convex/_generated/api';
import { fetchAction } from 'convex/nextjs'; 
import { OtpEmail } from '@/components/emails/otp-email';
import { render } from '@react-email/components';
import React from 'react';

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

    // Send email with OTP - await the render function
    const emailHtml = await render(React.createElement(OtpEmail, { code: otpCode, expiresAt: expiresAt }));
    const { data, error } = await resend.emails.send({
      from: `${process.env.SENDER_NAME || 'SchedulePro'} <${process.env.FROM_EMAIL || 'otp@email.schedulepro.store'}>`,
      to: email,
      subject: 'Your SchedulePro Login Code',
      html: emailHtml,
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