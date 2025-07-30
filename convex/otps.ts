import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const createOtp = mutation({
  args: {
    email: v.string(),
    code: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    verified: v.boolean(),
    attempts: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("otps", args);
  },
});

export const internalCreateOtp = internalMutation({
  args: {
    email: v.string(),
    code: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    verified: v.boolean(),
    attempts: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("otps", args);
  },
});

export const invalidateOtpsForEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("otps").withIndex("by_email", q => q.eq("email", args.email)).collect();
    for (const otp of existing) {
      await ctx.db.patch(otp._id, { expiresAt: Date.now() - 1 });
    }
  },
});

export const internalInvalidateOtpsForEmail = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("otps").withIndex("by_email", q => q.eq("email", args.email)).collect();
    for (const otp of existing) {
      await ctx.db.patch(otp._id, { expiresAt: Date.now() - 1 });
    }
  },
});

export const markVerified = mutation({
  args: { id: v.id("otps") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { verified: true, updatedAt: Date.now() });
  },
});

export const internalMarkVerified = internalMutation({
  args: { id: v.id("otps") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { verified: true, updatedAt: Date.now() });
  },
});

export const incrementAttempts = mutation({
  args: { id: v.id("otps") },
  handler: async (ctx, args) => {
    const otp = await ctx.db.get(args.id);
    if (!otp) return;
    await ctx.db.patch(args.id, { attempts: otp.attempts + 1, updatedAt: Date.now() });
  },
});

export const internalIncrementAttempts = internalMutation({
  args: { id: v.id("otps") },
  handler: async (ctx, args) => {
    const otp = await ctx.db.get(args.id);
    if (!otp) return;
    await ctx.db.patch(args.id, { attempts: otp.attempts + 1, updatedAt: Date.now() });
  },
});

export const by_email = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("otps").withIndex("by_email", q => q.eq("email", args.email)).collect();
  },
});

export const internalByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("otps").withIndex("by_email", q => q.eq("email", args.email)).collect();
  },
});

export const by_token = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("otps").withIndex("by_token", q => q.eq("token", args.token)).collect();
  },
});

export const internalByToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("otps").withIndex("by_token", q => q.eq("token", args.token)).collect();
  },
});
