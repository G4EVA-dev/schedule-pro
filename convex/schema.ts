// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    role: v.union(v.literal("owner"), v.literal("staff")),
    businessId: v.optional(v.id("businesses")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  businesses: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    timezone: v.string(),
    currency: v.string(),
    ownerId: v.id("users"),
    settings: v.object({
      bookingWindow: v.number(), // days in advance
      minNotice: v.number(), // hours
      bufferTime: v.number(), // minutes
    }),
  }).index("by_slug", ["slug"]).index("by_owner", ["ownerId"]),

  services: defineTable({
    businessId: v.id("businesses"),
    name: v.string(),
    description: v.optional(v.string()),
    duration: v.number(), // minutes
    price: v.number(), // cents
    color: v.string(),
    isActive: v.boolean(),
  }).index("by_business", ["businessId"]),

  staff: defineTable({
    businessId: v.id("businesses"),
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    services: v.array(v.id("services")),
    workingHours: v.object({
      monday: v.optional(v.object({ start: v.string(), end: v.string() })),
      tuesday: v.optional(v.object({ start: v.string(), end: v.string() })),
      wednesday: v.optional(v.object({ start: v.string(), end: v.string() })),
      thursday: v.optional(v.object({ start: v.string(), end: v.string() })),
      friday: v.optional(v.object({ start: v.string(), end: v.string() })),
      saturday: v.optional(v.object({ start: v.string(), end: v.string() })),
      sunday: v.optional(v.object({ start: v.string(), end: v.string() })),
    }),
  }).index("by_business", ["businessId"]),

  clients: defineTable({
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_business", ["businessId"]).index("by_email", ["businessId", "email"]),

  appointments: defineTable({
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
    remindersSent: v.array(v.string()), // ["24h", "2h", "confirmed"]
    createdAt: v.number(),
  })
    .index("by_business", ["businessId"])
    .index("by_staff_date", ["staffId", "startTime"])
    .index("by_client", ["clientId"]),

  notifications: defineTable({
    businessId: v.id("businesses"),
    appointmentId: v.optional(v.id("appointments")),
    type: v.union(
      v.literal("booking_confirmation"),
      v.literal("reminder_24h"),
      v.literal("reminder_2h"),
      v.literal("cancellation"),
      v.literal("reschedule")
    ),
    recipientEmail: v.string(),
    status: v.union(v.literal("pending"), v.literal("sent"), v.literal("failed")),
    scheduledFor: v.number(),
    sentAt: v.optional(v.number()),
    error: v.optional(v.string()),
  }).index("by_status_scheduled", ["status", "scheduledFor"]),
});