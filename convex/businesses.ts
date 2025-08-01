import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query: Get all businesses for a user (by owner)
export const getUserBusinesses = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_owner", q => q.eq("ownerId", args.userId))
      .collect();
    if (businesses.length === 0) {
      console.log(`[Convex Debug] No businesses found for userId: ${args.userId}`);
    }
    return businesses;
  },
});

// Query: Get a business by ID
export const getBusiness = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;
    return business;
  },
});

// Update business profile
export const updateBusinessProfile = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    workingHours: v.optional(v.object({
      monday: v.optional(v.object({ start: v.string(), end: v.string(), enabled: v.boolean() })),
      tuesday: v.optional(v.object({ start: v.string(), end: v.string(), enabled: v.boolean() })),
      wednesday: v.optional(v.object({ start: v.string(), end: v.string(), enabled: v.boolean() })),
      thursday: v.optional(v.object({ start: v.string(), end: v.string(), enabled: v.boolean() })),
      friday: v.optional(v.object({ start: v.string(), end: v.string(), enabled: v.boolean() })),
      saturday: v.optional(v.object({ start: v.string(), end: v.string(), enabled: v.boolean() })),
      sunday: v.optional(v.object({ start: v.string(), end: v.string(), enabled: v.boolean() })),
    })),
  },
  handler: async (ctx, args) => {
    const { businessId, ...updates } = args;
    // Only allow updates to fields in schema
    const allowedFields = ["name", "description", "logo", "workingHours"];
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
    );
    await ctx.db.patch(businessId, filteredUpdates);
    return await ctx.db.get(businessId);
  },
});
