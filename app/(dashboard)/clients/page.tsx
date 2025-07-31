"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Home,
  BarChart3,
  Plus,
  Download,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/hooks/use-auth"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive" | "pending"
  totalAppointments: number
  totalSpent: number
  lastVisit: string
  avatar?: string
  notes?: string
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

export default function ClientsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Convex and Auth
  const { businessId } = useAuth();
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [cursor, setCursor] = useState<number | null>(null);
  // Search and filter state
  const [searchValue, setSearchValue] = useState("");
  // Paginated query
  // Only include cursor if not null
  const clientsQueryArgs = businessId
    ? cursor != null
      ? { businessId, limit: pageSize, cursor }
      : { businessId, limit: pageSize }
    : 'skip';
  const clientsData = useQuery(
    api.clients.getClients,
    clientsQueryArgs
  );
  const createClient = useMutation(api.clients.createClient);
  const clientsLoading = businessId && !clientsData;
  const clients: Client[] = clientsData?.items || [];
  const totalClients = clientsData?.total || 0;
  const nextCursor = clientsData?.nextCursor || null;

  // Pagination logic
  const totalPages = Math.ceil(totalClients / pageSize);
  const handleNextPage = () => {
    if (page < totalPages && nextCursor) {
      setPage(page + 1);
      setCursor(nextCursor);
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      // Need to track previous cursors in a stack for full cursor-based pagination. For now, reset to first page.
      setCursor(null);
    }
  };

  // Add Client Form State
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name || !form.email) {
      setFormError('Name and email are required.');
      return;
    }
    if (!businessId) {
      setFormError('Business context missing.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createClient({
        businessId,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        notes: form.notes || undefined,
      });
      setForm({ name: '', email: '', phone: '', notes: '' });
      setIsCreateDialogOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Users, label: "Clients", active: true },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  // For now, filter on frontend (for small lists); for large lists, move to backend
  const filteredClients = clients.filter((client: Client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // CSV Export
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  function clientsToCSV(clients: Client[]): string {
    const headers = [
      'Name', 'Email', 'Phone', 'Address', 'Status', 'Total Appointments', 'Total Spent', 'Last Visit', 'Notes'
    ];
    const rows = clients.map(c => [
      c.name,
      c.email,
      c.phone,
      c.address,
      c.status,
      c.totalAppointments,
      c.totalSpent,
      c.lastVisit,
      c.notes?.replace(/\n/g, ' ').replace(/,/g, ';') || ''
    ]);
    return [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }

  const handleExportCSV = async () => {
    setExporting(true);
    setExportError(null);
    setExportSuccess(false);
    try {
      // For a professional UX, fetch all clients for export if needed (not just current page)
      // For now, export filteredClients (current page)
      const csv = clientsToCSV(filteredClients);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clients_export_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (err: any) {
      setExportError('Failed to export clients.');
    } finally {
      setExporting(false);
    }
  };

  const stats = [
    {
      title: "Total Clients",
      value: clientsLoading ? <Skeleton className="h-7 w-12" /> : clients.length.toString(),
      change: clientsLoading ? <Skeleton className="h-4 w-20" /> : "+12% this month",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Clients",
      value: clientsLoading ? <Skeleton className="h-7 w-12" /> : clients.filter((c: Client) => c.status === "active").length.toString(),
      change: clientsLoading ? <Skeleton className="h-4 w-20" /> : "85% active rate",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: clientsLoading ? <Skeleton className="h-7 w-16" /> : `$${clients.reduce((sum: number, c: Client) => sum + c.totalSpent, 0).toLocaleString()}`,
      change: clientsLoading ? <Skeleton className="h-4 w-20" /> : "+18% this month",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg. per Client",
      value: clientsLoading ? <Skeleton className="h-7 w-16" /> : `$${Math.round(clients.reduce((sum: number, c: Client) => sum + c.totalSpent, 0) / (clients.length || 1))}`,
      change: clientsLoading ? <Skeleton className="h-4 w-20" /> : "+5% this month",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="flex h-screen">
              {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
       {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
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

          {/* Clients Table */}
          <motion.div {...fadeInUp}>
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle>Client Management</CardTitle>
                  <div className="flex space-x-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                     variant="outline"
                     size="sm"
                     onClick={handleExportCSV}
                     disabled={exporting || filteredClients.length === 0}
                   >
                     <Download className="h-4 w-4 mr-2" />
                     {exporting ? 'Exporting...' : 'Export CSV'}
                   </Button>
                   {exportError && (
                     <span className="text-red-500 text-xs ml-2">{exportError}</span>
                   )}
                   {exportSuccess && (
                     <span className="text-green-600 text-xs ml-2">Exported!</span>
                   )}
                    {businessId && (
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Client
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientsLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg animate-pulse">
                        <div className="flex items-center space-x-4 flex-1">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 min-w-0">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <div className="flex space-x-2 mb-1">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-12" />
                            </div>
                            <div className="flex space-x-4">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <Skeleton className="h-5 w-12" />
                          <Skeleton className="h-5 w-16" />
                          <div className="flex space-x-1">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    filteredClients.map((client: Client, index: number) => (
                      <motion.div
                        key={client.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={client.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {client.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-slate-900">{client.name}</h3>
                              <Badge
                                variant={
                                  client.status === "active"
                                    ? "default"
                                    : client.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {client.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {client.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {client.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-slate-900">{client.totalAppointments}</p>
                            <p className="text-slate-600">Appointments</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-slate-900">${client.totalSpent}</p>
                            <p className="text-slate-600">Total Spent</p>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => setSelectedClient(client)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
               </CardContent>
             </Card>
           </motion.div>

           {/* Pagination Controls */}
           <div className="flex justify-center items-center mt-6 space-x-2">
             <Button
               variant="outline"
               size="sm"
               onClick={handlePrevPage}
               disabled={page === 1}
             >
               Prev
             </Button>
             {Array.from({ length: totalPages }).map((_, idx) => (
               <Button
                 key={idx}
                 variant={page === idx + 1 ? "default" : "outline"}
                 size="sm"
                 onClick={() => {
                   setPage(idx + 1);
                   setCursor(idx === 0 ? null : nextCursor); // Only accurate for 2 pages; for more, need a cursor stack
                 }}
               >
                 {idx + 1}
               </Button>
             ))}
             <Button
               variant="outline"
               size="sm"
               onClick={handleNextPage}
               disabled={page === totalPages || totalPages === 0}
             >
               Next
             </Button>
             <span className="ml-4 text-sm text-slate-500">
               Page {page} of {totalPages}
             </span>
           </div>
        </main>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Enter client details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient} className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Input
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                disabled={isSubmitting}
              />
            </div>
            {formError && <div className="text-red-500 text-sm">{formError}</div>}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="ghost" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting || !!clientsLoading}>
                {isSubmitting ? 'Adding...' : 'Add Client'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Client Details Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>View and manage client information</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedClient.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedClient.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedClient.name}</h3>
                  <Badge variant={selectedClient.status === "active" ? "default" : "secondary"}>
                    {selectedClient.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Email</Label>
                  <p className="mt-1">{selectedClient.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Phone</Label>
                  <p className="mt-1">{selectedClient.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-slate-600">Address</Label>
                  <p className="mt-1">{selectedClient.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Total Appointments</Label>
                  <p className="mt-1 font-semibold">{selectedClient.totalAppointments}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Total Spent</Label>
                  <p className="mt-1 font-semibold">${selectedClient.totalSpent}</p>
                </div>
              </div>

              {selectedClient.notes && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Notes</Label>
                  <p className="mt-1 text-sm text-slate-700">{selectedClient.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}