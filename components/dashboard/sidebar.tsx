"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Users,
  BarChart3,
  Settings,
  Home,
  UserCheck,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  MapIcon,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and analytics",
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "Schedule and appointments",
    badge: "", // Could be dynamic
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
    description: "Manage your clients",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Business insights",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Configure your business",
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    description: "View your Notifications",
  },
  
]

const quickActions = [
  {
    name: "New Appointment",
    href: "/calendar?new=true",
    icon: Calendar,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    name: "Add Client",
    href: "/clients?new=true",
    icon: UserCheck,
    color: "bg-green-500 hover:bg-green-600",
  }, 
  {
    name: "Add Staff",
    href: "/settings?tab=business",
    icon: Plus,
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    name: "Add Service",
    href: "/settings?tab=business",
    icon: UserCheck,
    color: "bg-purple-500 hover:bg-purple-600",
  }, 

]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  // Fetch notifications for badge
  const notifications = useQuery(
    api.notifications.getNotifications,
    user ? { userId: user.id } : undefined
  ) as import("@/types").Notification[] | undefined;
  const unreadCount = notifications ? notifications.filter((n: import("@/types").Notification) => !n.isRead).length : 0;

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-card", className)}>
      {/* Logo and Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground p-1">
            <Image 
              src="/favicon_io/favicon-32x32.png" 
              alt="SchedulePro Logo" 
              width={20} 
              height={20}
              className="w-5 h-5 brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">SchedulePro</span>
            <span className="text-xs text-muted-foreground">Business</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {/* Quick Actions */}
        <div className="mb-6">
          <h4 className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </h4>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-4 text-white mb-4",
                    action.color
                  )}
                >
                  <action.icon className="h-4 w-4" />
                  {action.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Main Navigation */}
        <div className="mb-6">
          <h4 className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Navigation
          </h4>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-3 px-3 py-2.5",
                      isActive && "bg-secondary/80 font-medium"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <Separator className="mb-6" />

        {/* Help & Support and RoadMap */}
        <div className="space-y-1">
          <Link href="/help">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3 px-3">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </Button>
          </Link>
          <Link href="/roadmap">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3 px-3 relative">
              <MapIcon className="h-4 w-4" />
              Roadmap              
            </Button>
          </Link>
        </div>
      </ScrollArea>

      {/* Powered by */}
      <div className="border-t px-4 py-2 text-[11px] text-muted-foreground text-center">
        Powered by <a href="https://convex.dev" target="_blank" rel="noopener" className="font-semibold text-muted-foreground hover:underline">Convex</a> &amp; <a href="https://resend.com" target="_blank" rel="noopener" className="font-semibold text-muted-foreground hover:underline">Resend</a>
      </div>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
