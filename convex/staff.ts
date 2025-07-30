import { query } from "./_generated/server";
import { v } from "convex/values";

// Query: Get all staff for a business
export const getStaff = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("staff")
      .withIndex("by_business", q => q.eq("businessId", args.businessId))
      .collect();
  },
});
