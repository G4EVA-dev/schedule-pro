import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// In-app notification queries and mutations
export const getNotifications = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userId } = args;
    console.log('[NOTIFICATION QUERY DEBUG] getNotifications called with userId:', userId);
    
    if (!userId) {
      console.log('[NOTIFICATION QUERY DEBUG] No userId provided, returning empty array');
      return [];
    }
    
    try {
      const notifications = await ctx.db
        .query("inAppNotifications")
        .withIndex("by_user", q => q.eq("userId", userId!))
        .order("desc")
        .collect();
      
      // console.log('[NOTIFICATION QUERY DEBUG] Found notifications:', {
      //   userId,
      //   count: notifications.length,
      //   notifications: notifications.map(n => ({
      //     id: n._id,
      //     title: n.title,
      //     message: n.message,
      //     isRead: n.isRead,
      //     createdAt: n.createdAt,
      //   })),
      // });
      
      return notifications;
    } catch (error) {
      console.error('[NOTIFICATION QUERY DEBUG] Error querying notifications:', error);
      return [];
    }
  },
});

export const getUnreadCount = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) return 0;
    const unread = await ctx.db
      .query("inAppNotifications")
      .withIndex("by_user", q => q.eq("userId", userId))
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
    // console.log('[NOTIFICATION CREATE DEBUG] Creating notification:', {
    //   userId: args.userId,
    //   title: args.title,
    //   message: args.message,
    //   type: args.type,
    //   relatedId: args.relatedId,
    // });
    
    try {
      const notificationId = await ctx.db.insert("inAppNotifications", {
        ...args,
        isRead: false,
        createdAt: Date.now(),
      });
      // console.log('[NOTIFICATION CREATE DEBUG] Notification created successfully:', notificationId);
      return notificationId;
    } catch (error) {
      // console.error('[NOTIFICATION CREATE DEBUG] Failed to create notification:', error);
      throw error;
    }
  },
});

export const markAsRead = mutation({
  args: { id: v.id("inAppNotifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isRead: true, readAt: Date.now() });
  },
});

export const markAllAsRead = mutation({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) return;
    const unread = await ctx.db
      .query("inAppNotifications")
      .withIndex("by_user", q => q.eq("userId", userId!))
      .filter(q => q.eq(q.field("isRead"), false))
      .collect();
    
    await Promise.all(
      unread.map(notification => 
        ctx.db.patch(notification._id, { isRead: true, readAt: Date.now() })
      )
    );
  },
});
