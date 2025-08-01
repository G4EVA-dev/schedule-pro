import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { fetchMutation } from 'convex/nextjs';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();
    // Call the password reset mutation
    const result = await fetchMutation(api.passwordReset.resetPassword, {
      token,
      newPassword,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
