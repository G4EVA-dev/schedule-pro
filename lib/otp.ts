// lib/otp.ts
import { v4 as uuidv4 } from 'uuid';

// Store OTPs in memory (in production, use Redis or your database)
const otpStore = new Map<string, { email: string; expiresAt: number; code: string }>();

// In lib/otp.ts

export function generateOTP(email: string): { token: string; code: string; expiresAt: number } {
  // Generate a random 6-character alphanumeric code
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const token = uuidv4();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now

  // Store the OTP with the token as the key
  otpStore.set(token, {
    email,
    expiresAt,
    code
  });

  return { token, code, expiresAt };
}

export function verifyOTP(token: string, email: string, code: string): boolean {
  const otpData = otpStore.get(token);
  if (!otpData) return false;

  // Check if OTP is expired
  if (otpData.expiresAt < Date.now()) {
    otpStore.delete(token);
    return false;
  }

  // Check if email and code match
  if (otpData.email !== email || otpData.code !== code) {
    return false;
  }

  // Remove the OTP after successful verification
  otpStore.delete(token);
  return true;
}