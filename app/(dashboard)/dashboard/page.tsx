"use client"

import React, { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { DashboardLoading } from "@/components/ui/loading-state"
import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { useBusinessData } from "@/components/providers/BusinessDataProvider"
import DashboardTour from "@/components/dashboard/DashboardTour"

export default function Dashboard() {
  const [isLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Set page title
  useEffect(() => {
    document.title = 'Dashboard · SchedulePro';
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  }

  // Use the same hooks as other working dashboard pages
  const { user: currentUser, businessId, isLoading: authLoading } = useAuth();

  // Fetch analytics stats
  const analytics = useQuery(api.analytics.getBusinessAnalytics, businessId ? { businessId } : "skip")

  // Fetch today's appointments
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const todaysAppointments = useQuery(api.appointments.getAppointmentsByDate, businessId ? {
    businessId,
    start: today.getTime(),
    end: tomorrow.getTime()
  } : "skip")

  // Stats for dashboard
  const stats = analytics ? [
    {
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: `${analytics.revenueChange >= 0 ? '+' : ''}${analytics.revenueChange.toFixed(1)}%`,
      changeType: analytics.revenueChange >= 0 ? "positive" : "negative",
      icon: DollarSign,
      description: "vs last month",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Appointments",
      value: analytics.totalAppointments.toString(),
      change: `${analytics.appointmentChange >= 0 ? '+' : ''}${analytics.appointmentChange.toFixed(1)}%`,
      changeType: analytics.appointmentChange >= 0 ? "positive" : "negative",
      icon: Calendar,
      description: "this month",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "New Clients",
      value: analytics.totalClients?.toString() ?? "-",
      change: "0%",
      changeType: "positive",
      icon: Users,
      description: "this month",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Completion Rate",
      value: analytics.completionRate ? `${analytics.completionRate}%` : "-",
      change: "0%",
      changeType: "positive",
      icon: CheckCircle,
      description: "vs last month",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ] : []

  // Lookup maps for quick join
  const { clients, staff, services } = useBusinessData();
  const clientMap = Object.fromEntries(
    Array.isArray(clients) ? clients.map((c: any) => [c._id || c.id, c]) : []
  );
  const staffMap = Object.fromEntries(
    Array.isArray(staff) ? staff.map((s: any) => [s._id || s.id, s]) : []
  );
  const serviceMap = Object.fromEntries(
    Array.isArray(services) ? services.map((s: any) => [s._id || s.id, s]) : []
  );

  // Format today's appointments for UI
  const recentAppointments = (todaysAppointments || []).map((apt: any) => {
    const client = clientMap[apt.clientId];
    const staffMember = staffMap[apt.staffId];
    const service = serviceMap[apt.serviceId];
    return {
      id: apt._id,
      client: client?.name || "Unknown Client",
      clientEmail: client?.email,
      service: service?.name || "Unknown Service",
      staff: staffMember?.name || "Unknown Staff",
      time: new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: apt.status || "scheduled",
      avatar: client?.avatar || "/avatars/default.jpg",
    }
  })

  const getStatusBadge = (status: "confirmed" | "pending" | "completed" | "cancelled") => {
    const variants = {
      confirmed: "default",
      pending: "secondary",
      completed: "default",
      cancelled: "destructive",
    } as const

    const colors = {
      confirmed: "text-green-600 bg-green-50",
      pending: "text-yellow-600 bg-yellow-50",
      completed: "text-blue-600 bg-blue-50",
      cancelled: "text-red-600 bg-red-50",
    }

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Debug logs for troubleshooting
  // if (typeof window !== "undefined") {
  //   console.log("currentUser", currentUser)
  //   console.log("businessId", businessId)
  //   console.log("analytics", analytics)
  //   console.log("todaysAppointments", todaysAppointments)
  // }

  // Loading states
  const isDataLoading = authLoading || analytics === undefined || todaysAppointments === undefined
  
  if (isLoading || isDataLoading) {
    return (
      <div className="space-y-6">
        {/* Welcome Section Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Today's Appointments Skeleton */}
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Skeleton */}
          <div className="col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <DashboardTour />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {currentUser?.name
                ? `Welcome back, ${currentUser.name.split(' ')[0]}!`
                : 'Welcome back!'}
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening with your business today.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          id="dashboard-stats"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </span>
                  <span className="ml-1">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Today's Appointments */}
          <motion.div variants={itemVariants} id="dashboard-appointments" className="col-span-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>
                    You have {recentAppointments.length} appointments scheduled for today
                  </CardDescription>
                </div>
                <Link href="/calendar">
                  <Button variant="outline" size="sm" className="gap-2">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAppointments.map((appointment: any) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={appointment.avatar} alt={appointment.client} />
                          <AvatarFallback>
                            {appointment.client ? appointment.client.split(' ').map((n: string) => n[0]).join('') : 'UC'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{appointment.client}</p>
                          <p className="text-sm text-muted-foreground">{appointment.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">{appointment.time}</p>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions & Overview */}
          <motion.div variants={itemVariants} className="col-span-3 space-y-6">
            {/* Booking URL */}
            {businessId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Your Booking URL
                  </CardTitle>
                  <CardDescription>
                    Share this link with clients to let them book appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <code className="flex-1 text-sm font-mono truncate min-w-0 pr-2">
                      {typeof window !== 'undefined' ? `${window.location.origin}/book/${businessId}` : `/book/${businessId}`}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-shrink-0"
                      disabled={isCopied}
                      onClick={() => {
                        const url = typeof window !== 'undefined' ? `${window.location.origin}/book/${businessId}` : `/book/${businessId}`;
                        navigator.clipboard.writeText(url);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                    >
                      {isCopied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

           

            {/* Recent Activity */}
            <Card id="dashboard-recent-activity">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Sarah Johnson</span> confirmed appointment
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">New client</span> Mike Chen registered
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <div className="text-sm">
                      <span className="font-medium">Payment received</span> from Emma Wilson
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </>
  )}
