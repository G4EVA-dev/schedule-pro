import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Get user by ID
export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Create or get OAuth user
export const createOAuthUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) return existingUser._id;

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      firstName: args.name.split(' ')[0],
      lastName: args.name.split(' ').slice(1).join(' ') || '',
      role: "owner",
      createdAt: Date.now(),
      avatarUrl: args.image, // Using avatarUrl to match schema
      emailVerified: false,
    });

    // Create default business
    const businessId = await ctx.db.insert("businesses", {
      name: `${args.name}'s Business`,
      slug: `${args.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      description: "My business",
      timezone: "UTC",
      currency: "USD",
      ownerId: userId,
      settings: {
        bookingWindow: 30,
        minNotice: 2,
        bufferTime: 15,
      },
    });

    // Update user with business ID
    await ctx.db.patch(userId, { businessId });
    return userId;
  },
});

// Update user
export const update = mutation({
  args: {
    id: v.id("users"),
    updates: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerified: v.optional(v.boolean()),
      avatarUrl: v.optional(v.string()),
      // Add other user fields as needed
    }),
  },
  handler: async (ctx, args) => {
    const { id, updates } = args;
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

// Mark email as verified
export const markEmailVerified = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { emailVerified: true });
    return await ctx.db.get(args.id);
  },
});

// Delete user
export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.email) return null;

    // Find the user by email (or another unique field)
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .first();
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    // Split name into firstName and lastName if provided
    const profileUpdates: any = {};
    if (updates.name) {
      const nameParts = updates.name.split(' ');
      profileUpdates.firstName = nameParts[0];
      profileUpdates.lastName = nameParts.slice(1).join(' ') || '';
    }
    if (updates.email) profileUpdates.email = updates.email;
    if (updates.avatarUrl) profileUpdates.avatarUrl = updates.avatarUrl;
    
    await ctx.db.patch(userId, profileUpdates);
    return await ctx.db.get(userId);
  },
});