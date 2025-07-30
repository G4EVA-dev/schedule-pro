"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, Clock, User, Trash2, MoreHorizontal } from "lucide-react"
import { useState, useRef, useCallback } from "react"
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

interface StaffOption {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface ServiceOption {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  price?: number;
  color?: string;
}

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
  clientId?: string
  staffId?: string
  serviceId?: string
  days?: number[]
}

interface CalendarProps {
  appointments: Appointment[]
  onAppointmentUpdate: (appointment: Appointment) => void
  onAppointmentDelete: (id: string) => void
  onAppointmentCreate: (appointment: Omit<Appointment, "id">) => void
  clients?: ClientOption[]
}

const appointmentTypes = {
  consultation: { color: "bg-blue-500", label: "Consultation" },
  "follow-up": { color: "bg-green-500", label: "Follow-up" },
  meeting: { color: "bg-purple-500", label: "Meeting" },
  review: { color: "bg-orange-500", label: "Review" },
}

export function InteractiveCalendar({
  appointments,
  onAppointmentUpdate,
  onAppointmentDelete,
  onAppointmentCreate,
  clients = [],
  staff = [],
  services = [],
}: CalendarProps & { staff?: StaffOption[]; services?: ServiceOption[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const calendarRef = useRef<HTMLDivElement>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days: Date[] = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return `${hour}:00`
  })

  const handleDragStart = useCallback((appointment: Appointment, event: React.DragEvent) => {
    setDraggedAppointment(appointment)
    const rect = event.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
    event.dataTransfer.effectAllowed = "move"
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (targetDate: Date, event: React.DragEvent) => {
      event.preventDefault()
      if (!draggedAppointment) return

      const duration = draggedAppointment.endTime.getTime() - draggedAppointment.startTime.getTime()
      const newStartTime = new Date(targetDate)
      newStartTime.setHours(draggedAppointment.startTime.getHours(), draggedAppointment.startTime.getMinutes())
      const newEndTime = new Date(newStartTime.getTime() + duration)

      const updatedAppointment = {
        ...draggedAppointment,
        startTime: newStartTime,
        endTime: newEndTime,
      }

      onAppointmentUpdate(updatedAppointment)
      setDraggedAppointment(null)
    },
    [draggedAppointment, onAppointmentUpdate],
  )

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((appointment) => isSameDay(appointment.startTime, date))
  }

  const AppointmentCard = ({ appointment, isDragging = false }: { appointment: Appointment; isDragging?: boolean }) => (
    <motion.div
      draggable
      onDragStart={(e) => handleDragStart(appointment, e as any)}
      className={`p-2 rounded-md text-white text-xs cursor-move mb-1 ${appointment.color} ${
        isDragging ? "opacity-50" : "opacity-100"
      } hover:shadow-lg transition-all duration-200`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileDrag={{ scale: 1.05, rotate: 2 }}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span className="font-medium truncate">
            {format(appointment.startTime, "HH:mm")} - {appointment.title}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedAppointment(appointment)
          }}
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex items-center space-x-1 mt-1">
        <User className="h-3 w-3" />
        <span className="truncate">{appointment.client}</span>
      </div>
    </motion.div>
  )

  const MonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="p-2 text-center font-semibold text-slate-600 bg-slate-50">
          {day}
        </div>
      ))}
      <AnimatePresence mode="wait">
        {days.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())

          return (
            <motion.div
              key={day.toISOString()}
              className={`min-h-[120px] p-2 border border-slate-200 ${
                isCurrentMonth ? "bg-white" : "bg-slate-50"
              } ${isToday ? "ring-2 ring-blue-500" : ""} hover:bg-slate-50 transition-colors`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(day, e)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-sm font-medium ${
                    isCurrentMonth ? "text-slate-900" : "text-slate-400"
                  } ${isToday ? "text-blue-600 font-bold" : ""}`}
                >
                  {format(day, "d")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <AnimatePresence>
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      isDragging={draggedAppointment?.id === appointment.id}
                    />
                  ))}
                </AnimatePresence>
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-slate-500 text-center">+{dayAppointments.length - 3} more</div>
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )

  const WeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="grid grid-cols-8 gap-1 h-[600px]">
        <div className="bg-slate-50"></div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="p-2 text-center font-semibold text-slate-600 bg-slate-50">
            <div>{format(day, "EEE")}</div>
            <div className={`text-lg ${isSameDay(day, new Date()) ? "text-blue-600 font-bold" : ""}`}>
              {format(day, "d")}
            </div>
          </div>
        ))}

        <div className="overflow-y-auto">
          {timeSlots.map((time) => (
            <div key={time} className="h-12 border-b border-slate-200 text-xs text-slate-500 p-1">
              {time}
            </div>
          ))}
        </div>

        {weekDays.map((day) => (
          <div key={day.toISOString()} className="border-l border-slate-200 relative">
            {timeSlots.map((time, timeIndex) => (
              <div
                key={time}
                className="h-12 border-b border-slate-200 hover:bg-blue-50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  const dropDate = new Date(day)
                  dropDate.setHours(timeIndex, 0, 0, 0)
                  handleDrop(dropDate, e)
                }}
              />
            ))}

            <div className="absolute inset-0 pointer-events-none">
              {getAppointmentsForDay(day).map((appointment) => {
                const startHour = appointment.startTime.getHours()
                const startMinute = appointment.startTime.getMinutes()
                const duration = (appointment.endTime.getTime() - appointment.startTime.getTime()) / (1000 * 60)
                const top = (startHour + startMinute / 60) * 48
                const height = (duration / 60) * 48

                return (
                  <motion.div
                    key={appointment.id}
                    className={`absolute left-1 right-1 ${appointment.color} text-white p-1 rounded text-xs pointer-events-auto cursor-move`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                    draggable
                    onDragStart={(e) => handleDragStart(appointment, e as any)}
                    whileHover={{ scale: 1.02, zIndex: 10 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="font-medium truncate">{appointment.title}</div>
                    <div className="truncate opacity-90">{appointment.client}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-100 rounded-lg p-1">
              {(["month", "week", "day"] as const).map((viewType) => (
                <Button
                  key={viewType}
                  variant={view === viewType ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView(viewType)}
                  className="capitalize"
                >
                  {viewType}
                </Button>
              ))}
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent ref={calendarRef} className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {view === "month" && <MonthView />}
            {view === "week" && <WeekView />}
          </motion.div>
        </AnimatePresence>
      </CardContent>

      {/* Create Appointment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
            <DialogDescription>Schedule a new appointment with your client.</DialogDescription>
          </DialogHeader>
          <AppointmentForm
            onSubmit={(appointment) => {
              onAppointmentCreate(appointment)
              setIsCreateDialogOpen(false)
            }}
            onCancel={() => setIsCreateDialogOpen(false)}
            clients={clients}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Update appointment details or delete the appointment.</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <AppointmentForm
              appointment={selectedAppointment}
              onSubmit={(appointment) => {
                onAppointmentUpdate({ ...appointment, id: selectedAppointment.id })
                setSelectedAppointment(null)
              }}
              onDelete={() => {
                onAppointmentDelete(selectedAppointment.id)
                setSelectedAppointment(null)
              }}
              onCancel={() => setSelectedAppointment(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

interface AppointmentFormProps {
  appointment?: Appointment
  onSubmit: (appointment: Omit<Appointment, "id">) => void
  onDelete?: () => void
  onCancel: () => void
}

interface ClientOption {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

function AppointmentForm({ appointment, onSubmit, onDelete, onCancel, clients = [], staff = [], services = [] }: AppointmentFormProps & { clients?: ClientOption[]; staff?: StaffOption[]; services?: ServiceOption[] }) {
  const [formData, setFormData] = useState({
    title: appointment?.title || "",
    client: appointment?.client || "",
    staffId: appointment?.staffId || "",
    serviceId: appointment?.serviceId || "",
    startTime: appointment?.startTime ? format(appointment.startTime, "yyyy-MM-dd'T'HH:mm") : "",
    endTime: appointment?.endTime ? format(appointment.endTime, "yyyy-MM-dd'T'HH:mm") : "",
    type: appointment?.type || ("consultation" as const),
    status: appointment?.status || ("confirmed" as const),
  })

  // For client dropdown search

  // Staff and Services dropdowns
  // Add Select dropdowns for staff and services in the form UI below client dropdown.

  const [clientSearch, setClientSearch] = useState("");
  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.email?.toLowerCase().includes(clientSearch.toLowerCase()) ?? false)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const appointmentData = {
      title: formData.title,
      client: formData.client,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
      type: formData.type,
      status: formData.status,
      color: appointmentTypes[formData.type].color,
      avatar: `/placeholder.svg?height=6&width=6`,
    }

    onSubmit(appointmentData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Appointment title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client">Client</Label>
        <Select
          value={formData.client}
          onValueChange={val => setFormData({ ...formData, client: val })}
          required
          disabled={!clients.length}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={clients.length ? "Select client" : "No clients found"} />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white px-2 py-1">
              <Input
                autoFocus
                className="w-full"
                placeholder="Search clients..."
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                disabled={!clients.length}
              />
            </div>
            {filteredClients.length ? (
              filteredClients.map((client) => (
                <SelectItem key={client.id} value={client.id} className="flex items-center space-x-2">
                  {/* <Avatar className="h-6 w-6 mr-2"> 
                    <AvatarImage src={client.avatar || "/placeholder.svg?height=5&width=5"} />
                    <AvatarFallback>{client.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar> */}
                  <span className="truncate font-medium">{client.name}</span>
                  {client.email && <span className="ml-2 text-xs text-slate-500 truncate">{client.email}</span>}
                </SelectItem>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-slate-500">No clients found</div>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(appointmentTypes).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="staff">Staff</Label>
          <Select value={formData.staffId} onValueChange={value => setFormData(f => ({ ...f, staffId: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select staff" />
            </SelectTrigger>
            <SelectContent>
              {staff.map((s: any) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="service">Service</Label>
          <Select value={formData.serviceId} onValueChange={value => setFormData(f => ({ ...f, serviceId: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((svc: any) => (
                <SelectItem key={svc.id} value={svc.id}>{svc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <div>
          {onDelete && (
            <Button type="button" variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{appointment ? "Update" : "Create"} Appointment</Button>
        </div>
      </div>
    </form>
  )
}
