"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Link2 } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Set page title
  useEffect(() => {
    document.title = 'Notifications · SchedulePro';
  }, []);

  const notifications = useQuery(
    api.notifications.getNotifications,
    user ? { userId: user.id } : undefined
  ) as import("@/types").Notification[] | undefined;
  const isLoading = notifications === undefined;
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  // Loading skeletons
  const skeletons = Array.from({ length: 4 });

  const handleMarkAsRead = async (id: string) => {
    await markAsRead({ id });
  };
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    await markAllAsRead({ userId: user.id });
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications && notifications.some((n: any) => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 flex items-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {skeletons.map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg h-20 w-full" />
          ))}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-4">
          {(notifications as import("@/types").Notification[]).map((n) => (
            <Card key={n.id} className={n.isRead ? "opacity-70" : "border-primary border-2"}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {n.title}
                    {n.relatedId && (
                      <Link href={`/${getNotificationLink(n)}`} className="ml-2 text-blue-600 underline flex items-center gap-1 text-xs">
                        <Link2 className="w-3 h-3" /> View
                      </Link>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{n.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="ml-2 px-2 py-1 text-xs rounded bg-secondary hover:bg-secondary/80"
                  >
                    Mark as read
                  </button>
                )}
                {!n.isRead && <Badge variant="secondary">Unread</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-12">
          <p>No notifications yet.</p>
        </div>
      )}
    </div>
  );

  // Helper to generate a link based on notification type
  function getNotificationLink(n: import("@/types").Notification) {
    switch (n.type) {
      case "appointment":
        return `calendar?appointment=${n.relatedId}`;
      case "payment":
        return `analytics?payment=${n.relatedId}`;
      case "system":
      case "other":
      default:
        return "dashboard";
    }
  }

}
