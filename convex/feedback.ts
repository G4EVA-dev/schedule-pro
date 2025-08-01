import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Feedback table: stores user feedback, support requests, suggestions
export const submitFeedback = mutation({
  args: {
    email: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    userId: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feedback", {
      email: args.email || undefined,
      subject: args.subject,
      message: args.message,
      userId: args.userId || undefined,
      createdAt: args.createdAt || Date.now(),
    });
  },
});

export const getFeedback = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("feedback").order("desc").collect();
  },
});
