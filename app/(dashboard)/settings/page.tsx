"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StaffServiceCard } from "@/components/dashboard/StaffServiceCard";
import { MultiSelect } from "@/components/ui/multiselect";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "@/providers/theme-provider"
import {
  Calendar,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  Home,
  BarChart3,
  User,
  Shield,
  Palette,
  MapPin,
  Save,
  Upload,
  Moon,
  Sun,
  Monitor,
  Check,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@/hooks/use-auth"
import { CreateStaffModal, CreateServiceModal } from "@/components/dashboard/StaffServiceModals"
import { useBusinessData } from "@/components/providers/BusinessDataProvider"

import type { Theme } from "@/providers/theme-provider";

type AppearanceSettingsProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export default function SettingsPage() { 
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("est")
  const { theme, setTheme } = useTheme()

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Users, label: "Clients", href: "/clients" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", active: true },
  ]

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business", icon: MapPin },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ]

  const ProfileSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback className="text-lg">JD</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-sm text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              defaultValue="Professional consultant with 10+ years of experience helping businesses grow."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const BusinessSettings = () => {
    const updateStaff = useMutation(api.staff.updateStaff);
    const { businessId, user } = useAuth();
    // Staff
    const { staff, services } = useBusinessData();
    const createStaff = useMutation(api.staff.createStaff);
    const createService = useMutation(api.services.createService);

    // Modal state
    const [staffModalOpen, setStaffModalOpen] = useState(false);
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    // Loading/Error handling
    const staffLoading = businessId && !staff;
    const servicesLoading = businessId && !services;
    // No error state from context, Convex handles errors globally

    // Handlers
    const handleCreateStaff = async (data: any) => {
      if (!businessId || !user?.id) {
        alert('User context not loaded. Please refresh and try again.');
        return;
      }
      await createStaff({ businessId, userId: user.id, ...data });
      setStaffModalOpen(false);
    };
    const handleCreateService = async (data: any) => {
      if (!businessId) return;
      await createService({ businessId, ...data });
      setServiceModalOpen(false);
    };
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Manage your business details and working hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Public Booking Link Section */}
            {businessId && (
              <div className="mb-6 p-4 rounded-lg border bg-muted/30 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">Share your booking link:</div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-xs text-muted-foreground break-all">Business ID: <span className="font-mono">{businessId}</span></span>
                    <button
                      className="ml-2 px-2 py-1 text-xs border rounded hover:bg-muted"
                      onClick={() => {
                        navigator.clipboard.writeText(businessId);
                        alert('Business ID copied!');
                      }}
                    >Copy</button>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground break-all">
                      Booking URL: <span className="font-mono">{typeof window !== 'undefined' ? `${window.location.origin}/book/${businessId}` : `/book/${businessId}`}</span>
                    </span>
                    <button
                      className="ml-2 px-2 py-1 text-xs border rounded hover:bg-muted"
                      onClick={() => {
                        const url = typeof window !== 'undefined' ? `${window.location.origin}/book/${businessId}` : `/book/${businessId}`;
                        navigator.clipboard.writeText(url);
                        alert('Booking URL copied!');
                      }}
                    >Copy</button>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" defaultValue="John Doe Consulting" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select defaultValue="consulting">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Input id="address" defaultValue="123 Business St, New York, NY 10001" />
            </div>

            <div className="space-y-4">
              <Label>Working Hours</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Switch defaultChecked={day !== "Sunday"} />
                      <span className="font-medium">{day}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Input className="w-20 h-8" defaultValue="09:00" />
                      <span>-</span>
                      <Input className="w-20 h-8" defaultValue="17:00" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Management */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Staff</Label>
                <Button onClick={() => setStaffModalOpen(true)} size="sm">Add Staff</Button>
              </div>
              {staffLoading ? (
                <div className="text-muted-foreground text-sm">Loading staff...</div>
              ) : staff && staff.length === 0 ? (
                <div className="text-muted-foreground text-sm">No staff members yet.</div>
              ) : (
                <ul className="divide-y border rounded-md mt-2">
                  {staff && staff.map((staff: any) => (
                    <li key={staff._id} className="flex items-center p-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={staff.avatar || "/placeholder.svg?height=32&width=32"} />
                        <AvatarFallback>{staff.name?.slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{staff.name}</div>
                        <div className="text-xs text-muted-foreground">{staff.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <CreateStaffModal open={staffModalOpen} onClose={() => setStaffModalOpen(false)} onSubmit={handleCreateStaff} />
            </div>

            {/* Services Management */}
            <div className="space-y-2 mt-6">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Services</Label>
                <Button onClick={() => setServiceModalOpen(true)} size="sm">Add Service</Button>
              </div>
              {servicesLoading ? (
                <div className="text-muted-foreground text-sm">Loading services...</div>
              ) : services && services.length === 0 ? (
                <div className="text-muted-foreground text-sm">No services yet.</div>
              ) : (
                <ul className="divide-y border rounded-md mt-2">
                  {services && services.map((service: any) => (
                    <li key={service._id} className="flex items-center p-2">
                      <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: service.color || '#888' }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{service.name}</div>
                        <div className="text-xs text-muted-foreground">{service.description}</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-xs ml-2">{service.duration} min</div>
                        <div className="text-xs ml-4">${(service.price/100).toFixed(2)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <CreateServiceModal open={serviceModalOpen} onClose={() => setServiceModalOpen(false)} onSubmit={handleCreateService} />
            </div>

            {/* Staff-Service Assignment UI */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-4">Assign Services to Staff</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staff && staff.length > 0 && services && services.length > 0 ? (
                  staff.map((member: any) => (
                    <StaffServiceCard
                      key={member._id}
                      staff={member}
                      services={services}
                      onUpdate={async (newServices: string[]) => {
                        await updateStaff({
                          id: member._id,
                          services: newServices,
                        });
                      }}
                    />
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm col-span-2">Add staff and services to enable assignment.</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const NotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified about appointments and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="border-t pt-6">
            <Label className="text-base font-medium mb-4 block">Notification Types</Label>
            <div className="space-y-3">
              {[
                "New appointment bookings",
                "Appointment cancellations",
                "Appointment reminders",
                "Payment confirmations",
                "Client messages",
                "System updates",
              ].map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <Label className="text-sm">{type}</Label>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const SecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-base font-medium">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Login Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme, setTheme }) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance Settings</CardTitle>
          <CardDescription>Customize the look and feel of your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium mb-3 block">Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all hover:scale-105 ${
                    theme === "light" ? "border-blue-500 ring-2 ring-blue-200" : "border-border hover:border-slate-300"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <div className="w-full h-20 bg-white rounded border mb-2 flex items-center justify-center">
                    <Sun className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="text-sm font-medium">Light</p>
                    {theme === "light" && <Check className="h-4 w-4 ml-2 text-blue-500" />}
                  </div>
                </div>
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all hover:scale-105 ${
                    theme === "dark" ? "border-blue-500 ring-2 ring-blue-200" : "border-border hover:border-slate-300"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <div className="w-full h-20 bg-slate-900 rounded mb-2 flex items-center justify-center">
                    <Moon className="h-8 w-8 text-slate-300" />
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="text-sm font-medium">Dark</p>
                    {theme === "dark" && <Check className="h-4 w-4 ml-2 text-blue-500" />}
                  </div>
                </div>
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all hover:scale-105 ${
                    theme === "system" ? "border-blue-500 ring-2 ring-blue-200" : "border-border hover:border-slate-300"
                  }`}
                  onClick={() => setTheme("system")}
                >
                  <div className="w-full h-20 bg-gradient-to-br from-white to-slate-900 rounded mb-2 flex items-center justify-center">
                    <Monitor className="h-8 w-8 text-slate-600" />
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="text-sm font-medium">System</p>
                    {theme === "system" && <Check className="h-4 w-4 ml-2 text-blue-500" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="cst">Central Time (CST)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="gmt">GMT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-6">
              <Label className="text-base font-medium mb-4 block">Display Preferences</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Show Animations</Label>
                    <p className="text-xs text-muted-foreground">Enable smooth transitions and animations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">High Contrast</Label>
                    <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />
      case "business":
        return <BusinessSettings />
      case "notifications":
        return <NotificationSettings />
      case "security":
        return <SecuritySettings />
      case "appearance":
        return <AppearanceSettings theme={theme} setTheme={setTheme} />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <div className="flex h-screen bg-background">
     {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border animate-slide-down">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-semibold">Settings</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button className="hover:scale-105 transition-all">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="flex">
            {/* Settings Sidebar */}
            <div className="w-64 bg-card border-r border-border p-6">
              <nav className="space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all hover:scale-[1.02] ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950 dark:border-blue-800"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-6">
              <div key={activeTab} className="animate-fade-in-up">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}