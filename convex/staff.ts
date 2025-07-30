import { query, mutation } from "./_generated/server";
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

// Mutation: Create a staff member
export const createStaff = mutation({
  args: {
    businessId: v.id("businesses"),
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    services: v.optional(v.array(v.id("services"))),
    workingHours: v.optional(v.object({
      monday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      tuesday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      wednesday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      thursday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      friday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      saturday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      sunday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("staff", {
      businessId: args.businessId,
      userId: args.userId,
      name: args.name,
      email: args.email,
      avatar: args.avatar,
      services: args.services || [],
      workingHours: args.workingHours || {
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "17:00" },
        saturday: { start: "09:00", end: "17:00" },
        sunday: { start: "09:00", end: "17:00" },
      },
    });
  },
});

// Mutation: Update a staff member
export const updateStaff = mutation({
  args: {
    id: v.id("staff"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatar: v.optional(v.string()),
    services: v.optional(v.array(v.id("services"))),
    workingHours: v.optional(v.object({
      monday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      tuesday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      wednesday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      thursday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      friday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      saturday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
      sunday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
      })),
    })),
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

// Mutation: Delete a staff member
export const deleteStaff = mutation({
  args: {
    id: v.id("staff"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});