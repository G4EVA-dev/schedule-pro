import { mutation, query, internalMutation, internalAction, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Helper function for SHA-256 hashing
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const createPasswordResetToken = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      return { success: true, message: "If an account exists, a reset email has been sent" };
    }

    // Generate secure token
    const token = crypto.randomUUID();
    
    // Hash the token using SHA-256
    const tokenHash = await sha256(token);

    // Token expires in 24 hours
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    // Store token
    await ctx.db.insert("passwordResetTokens", {
      userId: user._id,
      token: tokenHash,
      expiresAt,
      used: false,
      createdAt: Date.now(),
    });

    // For now, we'll return the token for testing purposes
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password/${token}`;

    // Schedule password reset email via internal action
    await ctx.scheduler.runAfter(0, internal.passwordReset.sendPasswordResetInternal, {
      to: user.email,
      resetUrl,
      userName: `${user.firstName} ${user.lastName}`,
    });

    // Log the reset URL for testing
    console.log(`Password reset requested for ${user.email}. Reset URL: ${resetUrl}`);

    return { success: true, message: "If an account exists, a reset email has been sent" };
  },
});

export const validatePasswordResetToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Hash the provided token for comparison
    const tokenHash = await sha256(args.token);

    const tokenRecord = await ctx.db
      .query("passwordResetTokens")
      .filter((q) => q.eq(q.field("token"), tokenHash))
      .first();

    if (!tokenRecord) {
      return { valid: false, error: "Invalid reset token" };
    }

    if (tokenRecord.used) {
      return { valid: false, error: "Reset token has already been used" };
    }

    if (tokenRecord.expiresAt < Date.now()) {
      return { valid: false, error: "Reset token has expired" };
    }

    const user = await ctx.db.get(tokenRecord.userId);
    if (!user) {
      return { valid: false, error: "User not found" };
    }

    return { valid: true, email: user.email };
  },
});

export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Hash the provided token for comparison
    const tokenHash = await sha256(args.token);

    const tokenRecord = await ctx.db
      .query("passwordResetTokens")
      .filter((q) => q.eq(q.field("token"), tokenHash))
      .first();

    if (!tokenRecord) {
      throw new Error("Invalid reset token");
    }

    if (tokenRecord.used) {
      throw new Error("Reset token has already been used");
    }

    if (tokenRecord.expiresAt < Date.now()) {
      throw new Error("Reset token has expired");
    }

    const user = await ctx.db.get(tokenRecord.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Hash new password
    const hashedPassword = await sha256(args.newPassword);

    // Update user password
    await ctx.db.patch(user._id, {
      hashedPassword,
    });

    // Mark token as used
    await ctx.db.patch(tokenRecord._id, {
      used: true,
    });

    // Send confirmation email
    await ctx.scheduler.runAfter(0, internal.email.sendPasswordResetSuccessEmail, {
      to: user.email,
      userName: `${user.firstName} ${user.lastName}`,
    });

    return { success: true, message: "Password reset successfully" };
  },
});

// Cleanup expired tokens (can be run periodically)
export const cleanupExpiredTokens = internalMutation({
  args: {},
  handler: async (ctx) => {
    const expiredTokens = await ctx.db
      .query("passwordResetTokens")
      .filter((q) => q.lt(q.field("expiresAt"), Date.now()))
      .collect();

    for (const token of expiredTokens) {
      await ctx.db.delete(token._id);
    }

    return { cleaned: expiredTokens.length };
  },
});

// Internal mutation to send password reset email via internal action
export const sendPasswordResetInternal = internalAction({
  args: {
    to: v.string(),
    resetUrl: v.string(),
    userName: v.string(),
  },
  handler: async (
    ctx: import("./_generated/server").ActionCtx,
    args: { to: string; resetUrl: string; userName: string }
  ) => {
    await ctx.runAction(internal.email.sendPasswordResetEmail, {
      to: args.to,
      resetUrl: args.resetUrl,
      userName: args.userName,
    });
  },
});

// Helper action for hashing passwords (kept for backward compatibility)
export const hashPassword = action({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    return await sha256(args.password);
  },
});