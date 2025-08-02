import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { api } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";

// Test function to verify reminder scheduling works
export const testReminderScheduling = mutation({
  args: {
    businessId: v.id("businesses"),
    serviceId: v.id("services"),
    staffId: v.id("staff"),
    clientId: v.id("clients"),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    appointmentId?: Id<"appointments">;
    reminderScheduled?: boolean;
    appointmentStartTime?: number;
    reminderTime?: number;
    error?: string;
  }> => {
    // Create a test appointment 35 minutes from now (so reminder will be scheduled for 5 minutes from now)
    const testStartTime = Date.now() + (35 * 60 * 1000); // 35 minutes from now
    const testEndTime = testStartTime + (60 * 60 * 1000); // 1 hour duration

    console.log("Creating test appointment with reminder...");
    console.log("Appointment start time:", new Date(testStartTime).toISOString());
    console.log("Reminder will be scheduled for:", new Date(testStartTime - (30 * 60 * 1000)).toISOString());

    try {
      // Create the appointment (this should automatically schedule the reminder)
      const appointmentId: Id<"appointments"> = await ctx.runMutation(api.appointments.createAppointment, {
        businessId: args.businessId,
        serviceId: args.serviceId,
        staffId: args.staffId,
        clientId: args.clientId,
        startTime: testStartTime,
        endTime: testEndTime,
        status: "scheduled",
        notes: "Test appointment for reminder system",
      });

      console.log("Test appointment created:", appointmentId);
      
      // Fetch the created appointment to verify reminder was scheduled
      const appointment = await ctx.db
        .query("appointments")
        .filter(q => q.eq(q.field("_id"), appointmentId))
        .first() as Doc<"appointments"> | null;
      
      console.log("Appointment reminder scheduled:", appointment?.reminderScheduled);

      return {
        success: true,
        appointmentId,
        reminderScheduled: appointment?.reminderScheduled,
        appointmentStartTime: testStartTime,
        reminderTime: testStartTime - (30 * 60 * 1000),
      };
    } catch (error) {
      console.error("Test failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});
