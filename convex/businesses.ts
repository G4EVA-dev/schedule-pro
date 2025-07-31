import { query } from "./_generated/server";
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
