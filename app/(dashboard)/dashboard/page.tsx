"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

export default function Dashboard() {
  const [isLoading] = useState(false)

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

  const stats = [
    {
      title: "Total Revenue",
      value: "$12,426",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "vs last month",
    },
    {
      title: "Appointments",
      value: "156",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Calendar,
      description: "this month",
    },
    {
      title: "New Clients",
      value: "24",
      change: "+4.1%",
      changeType: "positive" as const,
      icon: Users,
      description: "this month",
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: CheckCircle,
      description: "vs last month",
    },
  ]

  const recentAppointments = [
    {
      id: 1,
      client: "Sarah Johnson",
      service: "Hair Cut & Style",
      time: "10:00 AM",
      status: "confirmed" as const,
      avatar: "/avatars/sarah.jpg",
    },
    {
      id: 2,
      client: "Mike Chen",
      service: "Beard Trim",
      time: "11:30 AM",
      status: "pending" as const,
      avatar: "/avatars/mike.jpg",
    },
    {
      id: 3,
      client: "Emma Wilson",
      service: "Color Treatment",
      time: "2:00 PM",
      status: "confirmed" as const,
      avatar: "/avatars/emma.jpg",
    },
    {
      id: 4,
      client: "David Brown",
      service: "Full Service",
      time: "3:30 PM",
      status: "pending" as const,
      avatar: "/avatars/david.jpg",
    },
  ]

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

  if (isLoading) {
    return <DashboardLoading />
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your business today.
          </p>
        </div>
        <Link href="/calendar?new=true">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
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
        <motion.div variants={itemVariants} className="col-span-4">
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
                {recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={appointment.avatar} alt={appointment.client} />
                        <AvatarFallback>
                          {appointment.client.split(' ').map(n => n[0]).join('')}
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
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/calendar?new=true">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Calendar className="h-4 w-4" />
                  Schedule Appointment
                </Button>
              </Link>
              <Link href="/clients?new=true">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Users className="h-4 w-4" />
                  Add New Client
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Clock className="h-4 w-4" />
                  Manage Services
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
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
  )
}
