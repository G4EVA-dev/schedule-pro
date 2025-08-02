"use client"

import type React from "react"

import { Calendar, Users, BarChart3, Zap, Shield, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  image: string
}

export function AuthLayout({ children, title, subtitle, image }: AuthLayoutProps) {
  const features = [
    { icon: Calendar, text: "Smart scheduling" },
    { icon: Users, text: "Team collaboration" },
    { icon: BarChart3, text: "Advanced analytics" },
    { icon: Zap, text: "Instant notifications" },
    { icon: Shield, text: "Enterprise security" },
    { icon: Star, text: "5-star support" },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Branding Section - 30% */}
      <div className="hidden lg:flex lg:w-[30%] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="grid grid-cols-8 gap-4 h-full opacity-20">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold">SchedulePro</span>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Trusted by 50,000+ businesses
            </Badge>
          </div>

          {/* Main Content */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 leading-tight">{title}</h1>
            <p className="text-blue-100 text-lg leading-relaxed">{subtitle}</p>
          </div>

          {/* Powered by */}
          <div className="border-t px-4 py-4 text-blue-100 text-sm leading-relaxed">
            Powered by <a href="https://convex.dev" target="_blank" rel="noopener" className="font-semibold text-primary hover:underline">Convex</a> &amp; <a href="https://resend.com" target="_blank" rel="noopener" className="font-semibold text-primary hover:underline">Resend</a>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="h-5 w-5 text-blue-200" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-sm text-blue-100 mb-2">
              "SchedulePro transformed how we manage appointments. Our efficiency increased by 300%!"
            </p>
            <p className="text-xs text-blue-200">— Sarah Chen, CEO at TechFlow</p>
          </div>
        </div>
      </div>

      {/* Right Auth Section - 70% */}
      <div className="flex-1 lg:w-[70%] flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-2xl">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">SchedulePro</span>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
