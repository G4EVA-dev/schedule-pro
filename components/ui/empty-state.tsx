"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Plus, 
  ArrowRight,
  Search,
  Clock,
  UserPlus,
  Settings
} from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: "default" | "outline" | "secondary"
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon = Calendar,
  title,
  description,
  action,
  secondaryAction,
  className
}: EmptyStateProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  }

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-center justify-center p-8 ${className}`}
    >
      <Card className="max-w-md mx-auto border-dashed">
        <CardContent className="flex flex-col items-center text-center p-8">
          <motion.div
            variants={iconVariants}
            className="mb-4 p-3 rounded-full bg-muted"
          >
            <Icon className="h-8 w-8 text-muted-foreground" />
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {action && (
              action.href ? (
                <Link href={action.href} className="flex-1">
                  <Button 
                    variant={action.variant || "default"} 
                    className="w-full"
                  >
                    {action.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant={action.variant || "default"} 
                  onClick={action.onClick}
                  className="flex-1"
                >
                  {action.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )
            )}
            
            {secondaryAction && (
              secondaryAction.href ? (
                <Link href={secondaryAction.href}>
                  <Button variant="outline" size="sm">
                    {secondaryAction.label}
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Predefined empty states for common scenarios
export function NoAppointmentsEmpty() {
  return (
    <EmptyState
      icon={Calendar}
      title="No appointments scheduled"
      description="You don't have any appointments yet. Start by creating your first appointment to get organized."
      action={{
        label: "Schedule Appointment",
        href: "/calendar?new=true"
      }}
      secondaryAction={{
        label: "View Calendar",
        href: "/calendar"
      }}
    />
  )
}

export function NoClientsEmpty() {
  return (
    <EmptyState
      icon={Users}
      title="No clients yet"
      description="Build your client base by adding your first client. You can import from existing contacts or add them manually."
      action={{
        label: "Add Client",
        href: "/clients?new=true"
      }}
      secondaryAction={{
        label: "Import Contacts",
        href: "/clients?import=true"
      }}
    />
  )
}

export function NoServicesEmpty() {
  return (
    <EmptyState
      icon={Clock}
      title="No services configured"
      description="Set up your services to start accepting appointments. Define what you offer, pricing, and duration."
      action={{
        label: "Add Service",
        href: "/settings?tab=services"
      }}
    />
  )
}

export function NoStaffEmpty() {
  return (
    <EmptyState
      icon={UserPlus}
      title="No staff members"
      description="Add team members to help manage appointments and grow your business."
      action={{
        label: "Add Staff Member",
        href: "/settings?tab=staff"
      }}
    />
  )
}

export function NoSearchResultsEmpty({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search terms or browse all items.`}
      action={{
        label: "Clear Search",
        onClick: () => window.location.reload()
      }}
    />
  )
}

export function SetupBusinessEmpty() {
  return (
    <EmptyState
      icon={Settings}
      title="Complete your business setup"
      description="Finish setting up your business profile, services, and staff to start accepting appointments."
      action={{
        label: "Complete Setup",
        href: "/settings"
      }}
    />
  )
}
