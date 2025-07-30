import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Query: Get all appointments for a business (optionally filter by staff or client)
export const getAppointments = query({
  args: {
    businessId: v.id("businesses"),
    staffId: v.optional(v.id("staff")),
    clientId: v.optional(v.id("clients")),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("appointments").withIndex("by_business", q => q.eq("businessId", args.businessId));
    
    if (args.staffId) {
      q = q.filter((q) => q.eq(q.field("staffId"), args.staffId));
    }
    if (args.clientId) {
      q = q.filter((q) => q.eq(q.field("clientId"), args.clientId));
    }
    
    return await q.collect();
  },
});

// Mutation: Create an appointment
export const createAppointment = mutation({
  args: {
    businessId: v.id("businesses"),
    serviceId: v.id("services"),
    staffId: v.id("staff"),
    clientId: v.id("clients"),
    startTime: v.number(),
    endTime: v.number(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("appointments", {
      ...args,
      remindersSent: [],
      createdAt: Date.now(),
    });
  },
});

// Mutation: Update an appointment
export const updateAppointment = mutation({
  args: {
    id: v.id("appointments"),
    updates: v.object({
      serviceId: v.optional(v.id("services")),
      staffId: v.optional(v.id("staff")),
      clientId: v.optional(v.id("clients")),
      startTime: v.optional(v.number()),
      endTime: v.optional(v.number()),
      status: v.optional(
        v.union(
          v.literal("scheduled"),
          v.literal("confirmed"),
          v.literal("completed"),
          v.literal("cancelled"),
          v.literal("no_show")
        )
      ),
      notes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, args.updates);
  },
});

// Mutation: Delete an appointment
export const deleteAppointment = mutation({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});