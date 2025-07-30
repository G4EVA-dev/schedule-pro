import { query } from "./_generated/server";
import { v } from "convex/values";

// Query: Get all services for a business
export const getServices = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("services")
      .withIndex("by_business", q => q.eq("businessId", args.businessId))
      .collect();
  },
});
