import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { fetchMutation } from 'convex/nextjs';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    // Call the password reset mutation
    const result = await fetchMutation(api.passwordReset.createPasswordResetToken, {
      email,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset' },
      { status: 500 }
    );
  }
}
