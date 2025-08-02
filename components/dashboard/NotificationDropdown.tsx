"use client";

import { useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export function NotificationDropdown() {
  const { user } = useAuth();
  const popoverRef = useRef<HTMLButtonElement>(null);
  const notifications = useQuery(
    api.notifications.getNotifications,
    user?.id ? { userId: user.id } : "skip"
  );
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  if (!user) return null;

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={popoverRef}
          variant="ghost"
          size="icon"
          className="relative focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs"
              onClick={async () => {
                await markAllAsRead({ userId: user.id });
              }}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto divide-y">
          {!notifications && (
            <div className="p-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          )}
          {notifications && notifications.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No notifications yet.
            </div>
          )}
          {notifications && notifications.length > 0 && (
            <ul className="divide-y">
              {notifications.slice(0, 10).map((n: any) => (
                <li
                  key={n._id}
                  className={`flex items-start gap-2 p-4 cursor-pointer hover:bg-muted/50 transition group ${!n.isRead ? "bg-muted/30" : ""}`}
                  onClick={async () => {
                    if (!n.isRead) await markAsRead({ id: n._id });
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {n.title}
                      {!n.isRead && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {n.message}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
