import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query: Get all clients for a business
export const getClients = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clients")
      .withIndex("by_business", q => q.eq("businessId", args.businessId))
      .collect();
  },
});

// Mutation: Create a new client
export const createClient = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("clients", {
      businessId: args.businessId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      notes: args.notes,
      createdAt: Date.now(),
    });
  },
});
