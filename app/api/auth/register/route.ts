import { NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { fetchAction } from 'convex/nextjs'; // Note: use fetchAction for actions

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }


    // Call Convex action (not mutation)
    const result = await fetchAction(api.auth.registerUser, {
      email: email.toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password,
    });

    return NextResponse.json(
      { 
        message: 'Registration successful! Please check your email for a verification code.',
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
    
    return NextResponse.json(
      { 
        message: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: error instanceof Error && error.message.includes('already exists') ? 409 : 500 
      }
    );
  }
}