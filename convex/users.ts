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
      // Add other user fields as needed
    }),
  },
  handler: async (ctx, args) => {
    const { id, updates } = args;
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
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