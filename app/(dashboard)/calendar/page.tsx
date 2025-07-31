"use client"

import React from "react"
import { motion } from "framer-motion"
import { InteractiveCalendar } from "@/components/calendar/interactive-calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Home,
  Users,
  BarChart3,
  Settings,
  Clock,
  UserCheck,
  TrendingUp,
  DollarSign,
  Bell,
  Menu,
  X,
  Search,
  ArrowUpRight,
  Edit,
  Trash2,
  Eye,
  Link,
} from "lucide-react"
import { useState, useMemo } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/hooks/use-auth"
import { useBusinessData } from "@/components/providers/BusinessDataProvider"
import { CalendarLoading } from "@/components/ui/loading-state"
import { NoAppointmentsEmpty } from "@/components/ui/empty-state"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

interface Appointment {
  id: string
  title: string
  client: string
  startTime: Date
  endTime: Date
  type: "consultation" | "follow-up" | "meeting" | "review"
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show" | "pending"
  color: string
  avatar?: string
  clientId?: string
  staffId?: string
  serviceId?: string
  days?: number[]
}

// Animation variants
const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const staggerChild = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const { businessId, user, isLoading: authLoading } = useAuth();
  const appointmentsData = useQuery(api.appointments.getAppointments, businessId ? { businessId } : 'skip');
  const { clients, staff, services } = useBusinessData();
  const createAppointment = useMutation(api.appointments.createAppointment);
  const updateAppointment = useMutation(api.appointments.updateAppointment);
  const deleteAppointment = useMutation(api.appointments.deleteAppointment);

  // Transform Convex data to match Appointment interface for UI
  const appointments = useMemo(() => {
    if (!appointmentsData) return [];
    return appointmentsData.map((apt: any) => ({
      id: apt._id,
      title: apt.notes || 'Appointment', // Placeholder, replace with real title logic
      client: apt.clientId, // Placeholder, ideally resolve client name
      startTime: new Date(apt.startTime),
      endTime: new Date(apt.endTime),
      type: "consultation" as const, // Placeholder, extend schema or map type
      status: apt.status,
      color: "bg-blue-500", // Placeholder, map service/staff color
      avatar: undefined, // Placeholder, map staff/client avatar if needed
    }));
  }, [appointmentsData]);

  // Mock appointments for development/fallback
  const mockAppointments: Appointment[] = [
    {
      id: "1",
      title: "Client Consultation",
      client: "John Doe",
      startTime: new Date(2024, 0, 25, 9, 0),
      endTime: new Date(2024, 0, 25, 10, 0),
      type: "consultation",
      status: "confirmed",
      color: "bg-blue-500",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      title: "Follow-up Meeting",
      client: "Jane Smith",
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
      client: "Mike Johnson",
      startTime: new Date(2024, 0, 26, 10, 0),
      endTime: new Date(2024, 0, 26, 11, 30),
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
  ];

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Calendar", active: true },
    { icon: Users, label: "Clients" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Settings, label: "Settings" },
  ]

  // Convex handlers
  const handleAppointmentCreate = async (newAppointment: Omit<Appointment, "id">) => {
    if (!businessId) return;
    if (!newAppointment.client) {
      alert("Please select a client.");
      return;
    }
    if (!newAppointment.staffId) {
      alert("Please select a staff member.");
      return;
    }
    if (!newAppointment.serviceId) {
      alert("Please select a service.");
      return;
    }
    if (!newAppointment.startTime || !newAppointment.endTime) {
      alert("Please select start and end time.");
      return;
    }
    await createAppointment({
      businessId,
      serviceId: newAppointment.serviceId,
      staffId: newAppointment.staffId,
      clientId: newAppointment.client,
      startTime: newAppointment.startTime.getTime(),
      endTime: newAppointment.endTime.getTime(),
      status: newAppointment.status || "confirmed",
      notes: newAppointment.title,
    });
  };

  const handleAppointmentUpdate = async (updatedAppointment: Appointment) => {
    await updateAppointment({
      id: updatedAppointment.id as any,
      updates: {
        staffId: updatedAppointment.staffId,
        serviceId: updatedAppointment.serviceId,
        clientId: updatedAppointment.client,
        startTime: updatedAppointment.startTime.getTime(),
        endTime: updatedAppointment.endTime.getTime(),
        status: updatedAppointment.status as any,
        notes: updatedAppointment.title, // Or use notes field
      },
    });
  };

  const handleAppointmentDelete = async (id: string) => {
    await deleteAppointment({ id: id as any });
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

  // Use real appointments if available, otherwise use mock data
  const displayAppointments = appointments.length > 0 ? appointments : mockAppointments;

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full flex h-screen">      

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ">
        

        {/* Calendar Content */}
        <main className="flex-1  p-6">
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
              appointments={displayAppointments}
              onAppointmentUpdate={handleAppointmentUpdate}
              onAppointmentDelete={handleAppointmentDelete}
              onAppointmentCreate={handleAppointmentCreate}
              clients={clients ? clients.map((c: any) => ({
                id: c._id,
                name: c.name,
                email: c.email,
                avatar: c.avatar || undefined,
              })) : []}
              staff={staff ? staff.map((s: any) => ({
                id: s._id,
                name: s.name,
                email: s.email,
                avatar: s.avatar || undefined,
              })) : []}
              services={services || []}
            />
          </motion.div>
        </main>
      </div>
    </div>
  )
}