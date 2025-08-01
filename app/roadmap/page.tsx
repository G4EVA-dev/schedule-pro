"use client"
import Link from "next/link";   
import { FeedbackForm } from "./FeedbackForm";
import { ArrowRight, Calendar, Smartphone, Users, Zap, Bell, RefreshCw, CreditCard, FileText, MapPin, Star, Palette, Globe, Gift, Mail, BarChart3, Share2 } from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "Automated Reminders & Notifications",
    status: "Planned",
    description: "SMS/email reminders and push notifications for appointments and changes.",
  },
  {
    icon: Calendar,
    title: "Calendar Sync",
    status: "Coming August 2025",
    description: "Sync with Google/Outlook calendars and export iCal.",
  },
  {
    icon: Users,
    title: "Self-Service Client Portal",
    status: "Planned",
    description: "Clients can view, reschedule, or cancel their appointments and see history.",
  },
  {
    icon: RefreshCw,
    title: "Recurring Appointments",
    status: "Planned",
    description: "Support for weekly, monthly, or custom recurring bookings.",
  },
  {
    icon: Smartphone,
    title: "Mobile App / PWA",
    status: "In Development",
    description: "Progressive Web App and native mobile apps for on-the-go access.",
  },
  {
    icon: Users,
    title: "Advanced Staff Scheduling",
    status: "Planned",
    description: "Staff can set working hours, breaks, and time-off; skill/service matching.",
  },
  {
    icon: CreditCard,
    title: "Payments Integration",
    status: "Planned",
    description: "Accept deposits or payments via Stripe/PayPal; handle refunds/cancellation fees.",
  },
  {
    icon: FileText,
    title: "Customizable Booking Forms",
    status: "Planned",
    description: "Businesses can add custom fields (phone, preferences, uploads, etc.).",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    status: "Planned",
    description: "Visualize business trends, download CSV/PDF summaries, and more.",
  },
  {
    icon: MapPin,
    title: "Multi-location Support",
    status: "Planned",
    description: "Businesses with several branches can let clients pick a location.",
  },
  {
    icon: Zap,
    title: "Waitlist & Overbooking Management",
    status: "Planned",
    description: "Clients can join a waitlist if a slot is full and get notified if it opens.",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    status: "Planned",
    description: "Prompt clients to rate and review their experience after appointments.",
  },
  {
    icon: Palette,
    title: "Brand Customization",
    status: "Planned",
    description: "Businesses can customize colors, logo, and use their own domain (white-label).",
  },
  {
    icon: Globe,
    title: "Accessibility & Internationalization",
    status: "Planned",
    description: "WCAG accessibility, multiple languages, and time zone support.",
  },
  {
    icon: Gift,
    title: "Marketing Tools",
    status: "Planned",
    description: "Promo codes, email campaigns, and integrations with tools like Mailchimp.",
  },
  {
    icon: Share2,
    title: "Quick Wins & Extras",
    status: "Planned",
    description: "Reschedule button, testimonials, share links, and more micro-UX improvements.",
  },
];

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 text-gray-900 dark:text-gray-100 flex flex-col items-center py-12 px-4">
      <div className="flex flex-col items-center mb-8">
        <span className="text-3xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400 mb-2">SchedulePro</span>
        <h1 className="text-3xl font-bold tracking-tight">SchedulePro Roadmap</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center">
          We're always building new features to make scheduling easier and more powerful for you. Here's a sneak peek at what's next!
        </p>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-4xl w-full">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className="group bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col gap-2 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-2">
              <feature.icon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-semibold">{feature.title}</span>
            </div>
            <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-1">{feature.status}</span>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{feature.description}</p>
            <span className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-5 w-5 text-indigo-400" />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-12 max-w-xl w-full">
        <div className="bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-indigo-700 dark:text-indigo-400 text-center">Suggest a Feature or Share Feedback</h2>
          <FeedbackForm />
        </div>
      </div>
    </main>
  );
}
