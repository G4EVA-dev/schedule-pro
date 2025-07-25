"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  Filter,
  Download,
  Settings,
  Home,
  BarChart3,
  UserCheck,
  CalendarDays,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const stats = [
    {
      title: "Total Revenue",
      value: "$12,426",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Appointments",
      value: "156",
      change: "+8.2%",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "New Clients",
      value: "24",
      change: "+15.3%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "No-shows",
      value: "3",
      change: "-2.1%",
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentAppointments = [
    {
      client: "Sarah Johnson",
      service: "Consultation",
      time: "10:00 AM",
      status: "confirmed",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      client: "Mike Chen",
      service: "Follow-up",
      time: "11:30 AM",
      status: "pending",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      client: "Emma Davis",
      service: "Initial Meeting",
      time: "2:00 PM",
      status: "confirmed",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      client: "James Wilson",
      service: "Review",
      time: "3:30 PM",
      status: "cancelled",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true, href: "/dashboard" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Users, label: "Clients", href: "/clients" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col animate-slide-right`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 bg-white">
          <div className="text-xl font-bold text-blue-600 hover:scale-105 transition-transform cursor-pointer">
            SchedulePro
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-slate-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    item.active
                      ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 transition-colors ${
                      item.active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {item.active && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full animate-pulse" />}
                </Link>
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">John Doe</p>
              <p className="text-xs text-slate-500 truncate">john@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 z-10 animate-slide-down">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-slate-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500 hidden sm:block">Welcome back, John!</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search - Hidden on mobile */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-800 dark:border-slate-700"
                />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <Button
                size="icon"
                variant="ghost"
                className="relative hover:bg-slate-100 hover:scale-105 transition-all dark:hover:bg-slate-800"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </Button>

              {/* User Avatar */}
              <Avatar className="h-8 w-8 ring-2 ring-slate-100 dark:ring-slate-700">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Welcome Section */}
            <div className="animate-fade-in-up">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Good morning, John! 👋</h2>
                    <p className="text-blue-100 text-lg">Here's what's happening with your business today.</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all">
                      <Plus className="h-4 w-4 mr-2" />
                      New Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                          <p
                            className={`text-sm flex items-center ${
                              stat.change.startsWith("+")
                                ? "text-green-600"
                                : stat.change.startsWith("-")
                                  ? "text-red-600"
                                  : "text-slate-600"
                            }`}
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {stat.change}
                          </p>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bgColor} ml-4`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
              {/* Today's Schedule */}
              <div className="xl:col-span-2 animate-fade-in-up animation-delay-400">
                <Card className="shadow-sm border-0">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div>
                        <CardTitle className="text-xl font-semibold">Today's Schedule</CardTitle>
                        <CardDescription className="text-slate-600">
                          You have {recentAppointments.length} appointments scheduled for today
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="text-xs bg-transparent">
                          <Filter className="h-3 w-3 mr-1" />
                          Filter
                        </Button>
                        <Button size="sm" className="text-xs">
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentAppointments.map((appointment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group hover:scale-[1.01] animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {appointment.client
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{appointment.client}</p>
                            <p className="text-sm text-slate-600">{appointment.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium text-slate-900">{appointment.time}</p>
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "default"
                                  : appointment.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-xs"
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Activity */}
              <div className="space-y-6 animate-fade-in-up animation-delay-600">
                {/* Quick Actions */}
                <Card className="shadow-sm border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: Plus, label: "New Appointment", color: "text-blue-600" },
                      { icon: Users, label: "Add Client", color: "text-green-600" },
                      { icon: CalendarDays, label: "View Calendar", color: "text-purple-600" },
                      { icon: Download, label: "Export Data", color: "text-orange-600" },
                    ].map((action, index) => (
                      <div key={index}>
                        <Button className="w-full justify-start bg-slate-50 hover:bg-slate-100 text-slate-700 border-0 hover:scale-[1.02] transition-all">
                          <action.icon className={`h-4 w-4 mr-3 ${action.color}`} />
                          {action.label}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="shadow-sm border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          type: "booking",
                          message: "New appointment booked",
                          detail: "Sarah Johnson - 2 min ago",
                          color: "bg-green-500",
                        },
                        {
                          type: "payment",
                          message: "Payment received",
                          detail: "$150 from Mike Chen - 1 hour ago",
                          color: "bg-blue-500",
                        },
                        {
                          type: "cancellation",
                          message: "Appointment cancelled",
                          detail: "James Wilson - 3 hours ago",
                          color: "bg-orange-500",
                        },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 animate-slide-up"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className={`w-2 h-2 ${activity.color} rounded-full mt-2 flex-shrink-0`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                            <p className="text-xs text-slate-600 mt-1">{activity.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
