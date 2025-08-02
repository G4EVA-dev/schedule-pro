import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api, internal } from "./_generated/api";

// Schedule a reminder for an appointment (30 minutes before)
export const scheduleReminder = mutation({
  args: {
    appointmentId: v.id("appointments"),
    appointmentStartTime: v.number(), // timestamp
    clientEmail: v.string(),
    clientName: v.string(),
    serviceName: v.string(),
    businessName: v.string(),
  },
  handler: async (ctx, args) => {
    // Calculate reminder time (30 minutes before appointment)
    const reminderTime = args.appointmentStartTime - (30 * 60 * 1000); // 30 minutes in milliseconds
    
    // Only schedule if reminder time is in the future
    if (reminderTime > Date.now()) {
      // Schedule the reminder using the crons component
      await ctx.scheduler.runAt(
        reminderTime,
        api.appointmentReminders.sendReminder,
        {
          appointmentId: args.appointmentId,
          clientEmail: args.clientEmail,
          clientName: args.clientName,
          serviceName: args.serviceName,
          businessName: args.businessName,
          appointmentStartTime: args.appointmentStartTime,
        }
      );
      
      // Update the appointment to mark that reminder is scheduled
      await ctx.db.patch(args.appointmentId, {
        reminderScheduled: true,
      });
    }
  },
});

// Send the actual reminder email
export const sendReminder = mutation({
  args: {
    appointmentId: v.id("appointments"),
    clientEmail: v.string(),
    clientName: v.string(),
    serviceName: v.string(),
    businessName: v.string(),
    appointmentStartTime: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if appointment still exists and hasn't been cancelled
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment || appointment.status === "cancelled") {
      return; // Don't send reminder for cancelled appointments
    }

    // Fetch staff details for personalized email
    const staff = await ctx.db.get(appointment.staffId);
    const staffName = staff?.name || "Your provider";

    // Send email using the existing email system with real data
    try {
      await ctx.scheduler.runAfter(0, internal.email.sendAppointmentEmailInternal, {
        to: args.clientEmail,
        subject: `Reminder: Your ${args.serviceName} appointment is in 30 minutes`,
        appointment: {
          clientName: args.clientName,
          staffName: staffName,
          serviceName: args.serviceName,
          startTime: args.appointmentStartTime,
          endTime: appointment.endTime, // Use actual end time from appointment
          notes: `This is a friendly reminder from ${args.businessName}`,
        },
        type: "reminder",
      });

      // Mark reminder as sent
      const currentReminders = appointment.remindersSent || [];
      await ctx.db.patch(args.appointmentId, {
        remindersSent: [...currentReminders, "30min"],
      });
    } catch (error) {
      console.error("Failed to send reminder email:", error);
    }
  },
});

// Note: Email sending is now handled by the existing email.ts system
// The sendAppointmentEmailInternal function handles reminder emails with proper templates

// Cancel a scheduled reminder (useful when appointment is cancelled/rescheduled)
export const cancelReminder = mutation({
  args: {
    appointmentId: v.id("appointments"),
  },
  handler: async (ctx, args) => {
    // Update appointment to mark reminder as cancelled
    await ctx.db.patch(args.appointmentId, {
      reminderScheduled: false,
    });
    
    // Note: We can't easily cancel already scheduled jobs with the current crons component
    // The scheduled job will run but check if appointment is cancelled
  },
});
