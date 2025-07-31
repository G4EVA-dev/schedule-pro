import { query } from "./_generated/server";
import { v } from "convex/values";

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
