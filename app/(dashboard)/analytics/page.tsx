"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  Home,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Download,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [timeRange, setTimeRange] = useState("30d")

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Users, label: "Clients", href: "/clients" },
    { icon: BarChart3, label: "Analytics", active: true },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  const revenueData = [
    { month: "Jan", revenue: 4000, appointments: 24, percentage: 67 },
    { month: "Feb", revenue: 3000, appointments: 18, percentage: 50 },
    { month: "Mar", revenue: 5000, appointments: 30, percentage: 83 },
    { month: "Apr", revenue: 4500, appointments: 27, percentage: 75 },
    { month: "May", revenue: 6000, appointments: 36, percentage: 100 },
    { month: "Jun", revenue: 5500, appointments: 33, percentage: 92 },
  ]

  const appointmentTypeData = [
    { name: "Consultation", value: 45, color: "bg-blue-500" },
    { name: "Follow-up", value: 30, color: "bg-green-500" },
    { name: "Review", value: 15, color: "bg-orange-500" },
    { name: "Meeting", value: 10, color: "bg-purple-500" },
  ]

  const stats = [
    {
      title: "Total Revenue",
      value: "$28,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Total Appointments",
      value: "168",
      change: "+8.2%",
      trend: "up",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Avg. Session Duration",
      value: "45 min",
      change: "-2.1%",
      trend: "down",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Client Retention",
      value: "87%",
      change: "+5.3%",
      trend: "up",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue))

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col animate-slide-right`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="text-xl font-bold text-blue-600 hover:scale-105 transition-transform cursor-pointer">
            SchedulePro
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Link
                  href={item.href || "#"}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    item.active
                      ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100 dark:bg-blue-950 dark:border-blue-800"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border animate-slide-down">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-semibold">Analytics</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <ThemeToggle />

              <Button size="icon" variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold mb-1">{stat.value}</p>
                        <p
                          className={`text-sm flex items-center ${
                            stat.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="animate-fade-in-up">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue and appointment count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-end justify-between space-x-2 p-4">
                    {revenueData.map((data, index) => (
                      <div key={data.month} className="flex flex-col items-center flex-1">
                        <div className="w-full flex flex-col items-center mb-2">
                          <div
                            className="w-full bg-blue-500 rounded-t-md transition-all duration-1000 hover:bg-blue-600 relative group"
                            style={{
                              height: `${(data.revenue / maxRevenue) * 200}px`,
                              animationDelay: `${index * 100}ms`,
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              ${data.revenue.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointment Types */}
            <div className="animate-fade-in-up">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Types</CardTitle>
                  <CardDescription>Distribution of appointment categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointmentTypeData.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${item.color} transition-all duration-1000`}
                              style={{
                                width: `${item.value}%`,
                                animationDelay: `${index * 200}ms`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold w-8 text-right">{item.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Donut Chart Visualization */}
                  <div className="mt-8 flex justify-center">
                    <div className="relative w-48 h-48">
                      <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-muted opacity-20"
                        />
                        {appointmentTypeData.map((item, index) => {
                          const offset = appointmentTypeData.slice(0, index).reduce((sum, prev) => sum + prev.value, 0)
                          const circumference = 2 * Math.PI * 40
                          const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`
                          const strokeDashoffset = -((offset / 100) * circumference)

                          return (
                            <circle
                              key={item.name}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              strokeWidth="8"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              className={`${item.color.replace("bg-", "stroke-")} transition-all duration-1000`}
                              style={{ animationDelay: `${index * 300}ms` }}
                            />
                          )
                        })}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">100%</div>
                          <div className="text-sm text-muted-foreground">Total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Appointments Bar Chart */}
          <div className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Appointments</CardTitle>
                <CardDescription>Number of appointments scheduled each month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end justify-between space-x-4 p-4">
                  {revenueData.map((data, index) => {
                    const maxAppointments = Math.max(...revenueData.map((d) => d.appointments))
                    return (
                      <div key={data.month} className="flex flex-col items-center flex-1">
                        <div className="w-full flex flex-col items-center mb-2">
                          <div
                            className="w-full bg-green-500 rounded-t-md transition-all duration-1000 hover:bg-green-600 relative group"
                            style={{
                              height: `${(data.appointments / maxAppointments) * 200}px`,
                              animationDelay: `${index * 150}ms`,
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {data.appointments} appointments
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">{data.month}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Performance Metrics */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Booking Conversion Rate", value: "68%", change: "+5.2%", trend: "up" },
                  { label: "Average Booking Value", value: "$167", change: "+12.1%", trend: "up" },
                  { label: "Client Satisfaction", value: "4.8/5", change: "+0.2", trend: "up" },
                  { label: "No-show Rate", value: "8%", change: "-2.1%", trend: "down" },
                ].map((metric, index) => (
                  <div key={metric.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{metric.label}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <div
                      className={`flex items-center text-sm ${
                        metric.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest business activities and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    action: "New client registered",
                    detail: "Sarah Johnson joined your client list",
                    time: "2 hours ago",
                    color: "bg-green-500",
                  },
                  {
                    action: "Appointment completed",
                    detail: "Follow-up session with Mike Chen",
                    time: "4 hours ago",
                    color: "bg-blue-500",
                  },
                  {
                    action: "Payment received",
                    detail: "$150 payment from Emma Davis",
                    time: "6 hours ago",
                    color: "bg-purple-500",
                  },
                  {
                    action: "Appointment rescheduled",
                    detail: "James Wilson moved to next week",
                    time: "1 day ago",
                    color: "bg-orange-500",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 ${activity.color} rounded-full mt-2 flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.detail}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
