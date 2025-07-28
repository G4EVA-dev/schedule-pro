import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { internalMutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.optional(v.union(v.literal("owner"), v.literal("staff"))),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      role: args.role || "owner",
      createdAt: Date.now(),
    });
  },
});

export const getCurrentUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Internal mutation that accepts pre-hashed password
export const registerUserInternal = internalMutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    hashedPassword: v.string(),
  },
  handler: async (ctx, args): Promise<{ userId: Id<"users">; businessId: Id<"businesses"> }> => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("An account with this email already exists");
    }

    // Create user
    const userId: Id<"users"> = await ctx.db.insert("users", {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      hashedPassword: args.hashedPassword,
      role: "owner" as const,
      createdAt: Date.now(),
    });

    // Create a default business for the user
    const businessId = await ctx.db.insert("businesses", {
      name: `${args.firstName}'s Business`,
      slug: `${args.firstName.toLowerCase()}-${Date.now()}`,
      description: "My business",
      timezone: "UTC",
      currency: "USD",
      ownerId: userId,
      settings: {
        bookingWindow: 30, // 30 days in advance
        minNotice: 2, // 2 hours
        bufferTime: 15, // 15 minutes
      },
    });

    // Update user with business ID
    await ctx.db.patch(userId, {
      businessId,
    });

    return { userId, businessId };
  },
});

// PUBLIC action that handles the full registration flow
export const registerUser = action({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ userId: Id<"users">; businessId: Id<"businesses"> }> => {
    // Hash the password using the correct property name
    const hashedPassword = await ctx.runAction(internal.authActions.hashPassword, {
      password: args.password,
    });
    
    if (typeof hashedPassword !== 'string') {
      throw new Error('Failed to hash password');
    }

    // Call the internal mutation to create user and business
    return await ctx.runMutation(internal.auth.registerUserInternal, {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      hashedPassword,
    });
  },
});

// Alternative: Public mutation for client-side hashed passwords
export const register = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    hashedPassword: v.string(), // Pre-hashed on client
  },
  handler: async (ctx, args): Promise<{ userId: Id<"users">; businessId: Id<"businesses"> }> => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("An account with this email already exists");
    }

    // Create user
    const userId: Id<"users"> = await ctx.db.insert("users", {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      hashedPassword: args.hashedPassword,
      role: "owner" as const,
      createdAt: Date.now(),
    });

    // Create a default business for the user
    const businessId = await ctx.db.insert("businesses", {
      name: `${args.firstName}'s Business`,
      slug: `${args.firstName.toLowerCase()}-${Date.now()}`,
      description: "My business",
      timezone: "UTC",
      currency: "USD",
      ownerId: userId,
      settings: {
        bookingWindow: 30, // 30 days in advance
        minNotice: 2, // 2 hours
        bufferTime: 15, // 15 minutes
      },
    });

    // Update user with business ID
    await ctx.db.patch(userId, {
      businessId,
    });

    return { userId, businessId };
  },
});