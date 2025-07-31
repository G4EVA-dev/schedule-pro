import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// In-app notification queries and mutations
export const getNotifications = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("inAppNotifications")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getUnreadCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("inAppNotifications")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .filter(q => q.eq(q.field("isRead"), false))
      .collect();
    return unread.length;
  },
});

export const createNotification = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("appointment"),
      v.literal("system"),
      v.literal("payment"),
      v.literal("other")
    ),
    relatedId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inAppNotifications", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

export const markAsRead = mutation({
  args: { id: v.id("inAppNotifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isRead: true, readAt: Date.now() });
  },
});

export const markAllAsRead = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("inAppNotifications")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .filter(q => q.eq(q.field("isRead"), false))
      .collect();
    
    await Promise.all(
      unread.map(notification => 
        ctx.db.patch(notification._id, { isRead: true, readAt: Date.now() })
      )
    );
  },
});
