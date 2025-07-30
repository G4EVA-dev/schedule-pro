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
    // Save appointment
    const appointmentId = await ctx.db.insert("appointments", {
      ...args,
      remindersSent: [],
      createdAt: Date.now(),
    });

    // Fetch client, staff, and service details
    const client = await ctx.db.get(args.clientId);
    const staff = await ctx.db.get(args.staffId);
    const service = await ctx.db.get(args.serviceId);

    // Send appointment creation email to client (if email present)
    if (client?.email) {
      try {
        // Dynamically import email utility (works in Convex)
        const { sendAppointmentEmail } = await import("../lib/appointmentEmail");
        await sendAppointmentEmail({
          to: client.email,
          subject: `Your appointment is confirmed: ${service?.name || "Service"}`,
          appointment: {
            clientName: client.name || client.email,
            staffName: staff?.name || "Staff",
            serviceName: service?.name || "Service",
            startTime: new Date(args.startTime),
            endTime: new Date(args.endTime),
            notes: args.notes,
          },
          type: "creation",
        });
      } catch (error) {
        console.error("Failed to send appointment email:", error);
      }
    }

    return appointmentId;
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