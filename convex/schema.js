import { defineSchema, defineTable, s } from "convex/schema";

export default defineSchema({
  // ...existing tables...
  notifications: defineTable({
    userId: s.string(),
    title: s.string(),
    message: s.string(),
    type: s.union(
      s.literal("appointment"),
      s.literal("system"),
      s.literal("payment"),
      s.literal("other")
    ),
    isRead: s.boolean(),
    relatedId: s.optional(s.string()),
    createdAt: s.number(),
    readAt: s.optional(s.number()),
  }).index("by_user", ["userId"]).index("by_createdAt", ["createdAt"]),
});
