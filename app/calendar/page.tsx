"use client"

import { motion } from "framer-motion"
import { InteractiveCalendar } from "@/components/calendar/interactive-calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Home,
  BarChart3,
  UserCheck,
} from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Appointment {
  id: string
  title: string
  client: string
  startTime: Date
  endTime: Date
  type: "consultation" | "follow-up" | "meeting" | "review"
  status: "confirmed" | "pending" | "cancelled"
  color: string
  avatar?: string
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const staggerChild = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function CalendarPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Initial Consultation",
      client: "Sarah Johnson",
      startTime: new Date(2024, 0, 25, 10, 0),
      endTime: new Date(2024, 0, 25, 11, 0),
      type: "consultation",
      status: "confirmed",
      color: "bg-blue-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      title: "Follow-up Meeting",
      client: "Mike Chen",
      startTime: new Date(2024, 0, 25, 14, 0),
      endTime: new Date(2024, 0, 25, 15, 0),
      type: "follow-up",
      status: "confirmed",
      color: "bg-green-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      title: "Project Review",
      client: "Emma Davis",
      startTime: new Date(2024, 0, 26, 9, 0),
      endTime: new Date(2024, 0, 26, 10, 30),
      type: "review",
      status: "pending",
      color: "bg-orange-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      title: "Team Meeting",
      client: "James Wilson",
      startTime: new Date(2024, 0, 27, 11, 0),
      endTime: new Date(2024, 0, 27, 12, 0),
      type: "meeting",
      status: "confirmed",
      color: "bg-purple-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      title: "Strategy Session",
      client: "Lisa Anderson",
      startTime: new Date(2024, 0, 28, 15, 0),
      endTime: new Date(2024, 0, 28, 16, 30),
      type: "consultation",
      status: "confirmed",
      color: "bg-blue-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ])

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Calendar", active: true },
    { icon: Users, label: "Clients" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Settings, label: "Settings" },
  ]

  const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt)))
  }

  const handleAppointmentDelete = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id))
  }

  const handleAppointmentCreate = (newAppointment: Omit<Appointment, "id">) => {
    const appointment: Appointment = {
      ...newAppointment,
      id: Date.now().toString(),
    }
    setAppointments((prev) => [...prev, appointment])
  }

  const stats = [
    {
      title: "Today's Appointments",
      value: "8",
      change: "+2 from yesterday",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "This Week",
      value: "32",
      change: "+12% from last week",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Confirmed",
      value: "28",
      change: "87.5% confirmation rate",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Revenue",
      value: "$3,240",
      change: "+18% this month",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col`}
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className="text-xl font-bold text-blue-600">SchedulePro</div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            {sidebarItems.map((item, index) => (
              <motion.div key={index} variants={staggerChild}>
                <Link
                  href={item.href || "#"}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    item.active
                      ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </nav>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.header
          className="bg-white shadow-sm border-b border-slate-200"
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-semibold text-slate-900">Calendar</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input placeholder="Search appointments..." className="pl-10 w-64" />
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="icon" variant="ghost" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
              </motion.div>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </motion.header>

        {/* Calendar Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={staggerChild}>
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-sm text-slate-500 mt-1">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive Calendar */}
          <motion.div {...fadeInUp}>
            <InteractiveCalendar
              appointments={appointments}
              onAppointmentUpdate={handleAppointmentUpdate}
              onAppointmentDelete={handleAppointmentDelete}
              onAppointmentCreate={handleAppointmentCreate}
            />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
