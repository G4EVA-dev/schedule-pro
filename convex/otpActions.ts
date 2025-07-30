"use node";
import { internalAction, action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { v4 as uuidv4 } from "uuid";

// Action to generate and persist OTP, with rate limiting
export const generateOtp = internalAction({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    // Check for recent OTPs for this email (rate limit: max 3 in last 15 min)
    const recentOtps = await ctx.runQuery(api.otps.by_email, { email: args.email });
    const fifteenMinutesAgo = now - 15 * 60 * 1000;
    const recentCount = recentOtps.filter((o: any) => o.createdAt > fifteenMinutesAgo).length;
    
    if (recentCount >= 3) {
      throw new Error("Too many OTP requests. Please try again later.");
    }

    // Generate code and token
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const token = uuidv4();
    const expiresAt = now + 15 * 60 * 1000;

    // Save OTP (invalidate previous for this email)
    await ctx.runMutation(api.otps.invalidateOtpsForEmail, { email: args.email });
    await ctx.runMutation(api.otps.createOtp, {
      email: args.email,
      code,
      token,
      expiresAt,
      verified: false,
      attempts: 0,
      createdAt: now,
      updatedAt: now,
    });

    return { token, code, expiresAt };
  },
});

// Internal action to verify OTP
export const verifyOtp = internalAction({
  args: {
    email: v.string(),
    code: v.string(),
    token: v.string(),
    registrationCheck: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Registration check: see if any OTP for this email is verified and not expired
    if (args.registrationCheck) {
      const otps = await ctx.runQuery(api.otps.by_email, { email: args.email });
      const now = Date.now();
      const verified = otps.some((otp: any) => otp.verified && otp.expiresAt > now);
      if (verified) {
        return { valid: true };
      } else {
        return { valid: false, reason: 'No verified OTP for this email.' };
      }
    }

    // Normal OTP verification
    const otps = await ctx.runQuery(api.otps.by_token, { token: args.token });
    if (!otps.length) return { valid: false, reason: "Invalid token" };
    
    const otp = otps[0];
    if (otp.email !== args.email) return { valid: false, reason: "Email mismatch" };
    if (otp.expiresAt < Date.now()) return { valid: false, reason: "Expired" };
    if (otp.verified) return { valid: false, reason: "Already used" };
    
    if (otp.code !== args.code) {
      await ctx.runMutation(api.otps.incrementAttempts, { id: otp._id });
      return { valid: false, reason: "Incorrect code" };
    }

    await ctx.runMutation(api.otps.markVerified, { id: otp._id });
    return { valid: true };
  },
});

// Public action to generate OTP (can be called from API routes)
export const publicGenerateOtp = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<{ token: string; code: string; expiresAt: number }> => {
    const now = Date.now();
    // Check for recent OTPs for this email (rate limit: max 3 in last 15 min)
    const recentOtps = await ctx.runQuery(api.otps.by_email, { email: args.email });
    const fifteenMinutesAgo = now - 15 * 60 * 1000;
    const recentCount = recentOtps.filter((o: any) => o.createdAt > fifteenMinutesAgo).length;
    
    if (recentCount >= 3) {
      throw new Error("Too many OTP requests. Please try again later.");
    }

    // Generate code and token
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const token = uuidv4();
    const expiresAt = now + 15 * 60 * 1000;

    // Save OTP (invalidate previous for this email)
    await ctx.runMutation(api.otps.invalidateOtpsForEmail, { email: args.email });
    await ctx.runMutation(api.otps.createOtp, {
      email: args.email,
      code,
      token,
      expiresAt,
      verified: false,
      attempts: 0,
      createdAt: now,
      updatedAt: now,
    });

    return { token, code, expiresAt };
  },
});

// Public action for OTP verification (can be called from API routes)
export const publicVerifyOtp = action({
  args: {
    email: v.string(),
    code: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args): Promise<{ valid: boolean; reason?: string }> => {
    // For registration check (empty token means find any valid OTP for this email)
    if (args.token === '') {
      const otps = await ctx.runQuery(api.otps.by_email, { email: args.email });
      const now = Date.now();
      
      // Find an OTP that matches the code and hasn't expired
      for (const otp of otps) {
        if (otp.code === args.code && otp.expiresAt > now && !otp.verified) {
          // Mark this OTP as verified
          await ctx.runMutation(api.otps.markVerified, { id: otp._id });
          
          // Set user.emailVerified = true
          const user = await ctx.runQuery(api.users.getByEmail, { email: args.email });
          if (user && !user.emailVerified) {
            await ctx.runMutation(api.users.markEmailVerified, { id: user._id });
          }
          
          return { valid: true };
        }
      }
      
      return { valid: false, reason: 'Invalid or expired OTP code' };
    }

    // Normal OTP verification with token
    const otps = await ctx.runQuery(api.otps.by_token, { token: args.token });
    if (!otps.length) return { valid: false, reason: "Invalid token" };
    
    const otp = otps[0];
    if (otp.email !== args.email) return { valid: false, reason: "Email mismatch" };
    if (otp.expiresAt < Date.now()) return { valid: false, reason: "Expired" };
    if (otp.verified) return { valid: false, reason: "Already used" };
    
    if (otp.code !== args.code) {
      await ctx.runMutation(api.otps.incrementAttempts, { id: otp._id });
      return { valid: false, reason: "Incorrect code" };
    }

    await ctx.runMutation(api.otps.markVerified, { id: otp._id });
    
    // Set user.emailVerified = true
    const user = await ctx.runQuery(api.users.getByEmail, { email: args.email });
    if (user && !user.emailVerified) {
      await ctx.runMutation(api.users.markEmailVerified, { id: user._id });
    }
    
    return { valid: true };
  },
});