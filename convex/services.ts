import { query, mutation } from "./_generated/server";
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

// Mutation: Create a service
export const createService = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    description: v.optional(v.string()),
    duration: v.number(), // Required in schema (minutes)
    price: v.number(), // Required in schema (cents)
    color: v.string(), // Required in schema
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("services", {
      businessId: args.businessId,
      name: args.name,
      description: args.description,
      duration: args.duration,
      price: args.price,
      color: args.color,
      isActive: args.isActive ?? true,
    });
  },
});

// Mutation: Update a service
export const updateService = mutation({
  args: {
    id: v.id("services"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
    price: v.optional(v.number()),
    color: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    return await ctx.db.patch(id, filteredUpdates);
  },
});

// Mutation: Delete a service
export const deleteService = mutation({
  args: {
    id: v.id("services"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});