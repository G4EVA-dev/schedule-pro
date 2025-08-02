import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internal, api } from "./_generated/api";

// Query: Get appointments for a business within a date range
export const getAppointmentsByDate = query({
  args: {
    businessId: v.id("businesses"),
    start: v.number(),
    end: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_business", q => q.eq("businessId", args.businessId))
      .filter(q => q.gte(q.field("startTime"), args.start))
      .filter(q => q.lt(q.field("startTime"), args.end))
      .collect();
  },
});

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

    // Debug logging
    // console.log('[APPOINTMENT DEBUG] Creating appointment:', {
    //   appointmentId,
    //   clientId: args.clientId,
    //   staffId: args.staffId,
    //   serviceId: args.serviceId,
    // });
    // console.log('[APPOINTMENT DEBUG] Fetched records:', {
    //   client: client ? { _id: client._id, name: client.name, email: client.email } : null,
    //   staff: staff ? { _id: staff._id, userId: staff.userId, name: staff.name, email: staff.email } : null,
    //   service: service ? { _id: service._id, name: service.name } : null,
    // });

    // Send appointment creation email to client (if email present)
    if (client?.email) {
      try {
        // Schedule email to be sent
        await ctx.scheduler.runAfter(0, internal.email.sendAppointmentEmailInternal, {
          to: client.email,
          subject: `Your appointment is confirmed: ${service?.name || "Service"}`,
          appointment: {
            clientName: client.name || client.email,
            staffName: staff?.name || "Staff",
            serviceName: service?.name || "Service",
            startTime: args.startTime,
            endTime: args.endTime,
            notes: args.notes,
          },
          type: "creation",
        });
      } catch (error) {
        console.error("Failed to send appointment email:", error);
      }
    }

    // Send appointment notification to staff (if email present)
    if (staff?.email) {
      try {
        await ctx.scheduler.runAfter(0, internal.email.sendAppointmentEmailInternal, {
          to: staff.email,
          subject: `New appointment booked: ${service?.name || "Service"}`,
          appointment: {
            clientName: client?.name || client?.email || "Client",
            staffName: staff.name || staff.email,
            serviceName: service?.name || "Service",
            startTime: args.startTime,
            endTime: args.endTime,
            notes: args.notes,
          },
          type: "staff",
        });
        // Staff email sent above
      } catch (error) {
        console.error("Failed to send staff appointment email:", error);
      }
    }
    // Send to owner (always notify owner of new bookings)
    if (staff?.businessId) {
      const business = await ctx.db.get(staff.businessId);
      if (business?.ownerId) {
        const owner = await ctx.db.get(business.ownerId);
        // Only send if owner is different from staff user
        if (owner?.email && owner.email !== client?.email && staff.userId !== business.ownerId) {
          try {
            await ctx.scheduler.runAfter(0, internal.email.sendAppointmentEmailInternal, {
              to: owner.email,
              subject: `New appointment booked: ${service?.name || "Service"}`,
              appointment: {
                clientName: client?.name || client?.email || "Client",
                staffName: staff.name || staff.email,
                serviceName: service?.name || "Service",
                startTime: args.startTime,
                endTime: args.endTime,
                notes: args.notes,
              },
              type: "staff",
            });
          } catch (error) {
            console.error("Failed to send owner appointment email:", error);
          }
        }
      }
    }

    // In-app notification for staff (use staff.userId, not staff._id)
    console.log('[NOTIFICATION DEBUG] Checking staff notification conditions:', {
      staffExists: !!staff,
      staffUserId: staff?.userId,
      staffName: staff?.name,
    });
    
    if (staff?.userId) {
      console.log('[NOTIFICATION DEBUG] Creating staff notification with userId:', staff.userId);
      try {
        const notificationId = await ctx.runMutation(api.notifications.createNotification, {
          userId: staff.userId,
          title: "New Appointment Booked",
          message: `You have a new appointment for ${service?.name || "a service"}.`,
          type: "appointment",
          relatedId: appointmentId,
        });
        console.log('[NOTIFICATION DEBUG] Staff notification created successfully:', notificationId);
      } catch (error) {
        console.error('[NOTIFICATION DEBUG] Failed to create staff notification:', error);
      }
    } else {
      console.log('[NOTIFICATION DEBUG] Skipping staff notification - no staff.userId found');
    }

    // Note: Clients don't have user accounts in this system, so no in-app notifications for clients
    // They only receive email notifications (handled above)

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