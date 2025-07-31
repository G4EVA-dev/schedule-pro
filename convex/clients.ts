import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query: Get all clients for a business
export const getClients = query({
  args: {
    businessId: v.id("businesses"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.number()), // createdAt cursor
  },
  handler: async (ctx, args) => {
    const { businessId, limit = 10, cursor } = args;
    let q = ctx.db
      .query("clients")
      .withIndex("by_business", q => q.eq("businessId", businessId))
      .order("desc");
    if (cursor) {
      q = q.filter(q => q.lt(q.field("createdAt"), cursor));
    }
    const items = await q.take(limit);
    // For total count
    const total = await ctx.db
      .query("clients")
      .withIndex("by_business", q => q.eq("businessId", businessId))
      .collect();
    const nextCursor = items.length === limit ? items[items.length - 1].createdAt : null;
    return {
      items,
      nextCursor,
      total: total.length,
    };
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
