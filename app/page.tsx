"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users, BarChart3, Zap, Shield, Star, ArrowRight, CheckCircle, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count.toLocaleString()}</span>
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered scheduling that learns your preferences and optimizes your calendar automatically.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamlessly coordinate with your team members and manage group appointments effortlessly.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Gain insights into your business performance with detailed analytics and reporting.",
    },
    {
      icon: Clock,
      title: "Time Zone Magic",
      description: "Automatically handle time zones and scheduling conflicts across global teams.",
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Real-time updates and notifications keep everyone informed and on schedule.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption and compliance certifications.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "This platform transformed how we handle client meetings. Our booking efficiency increased by 300%.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Operations Director",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "The analytics dashboard gives us insights we never had before. Game-changing for our business.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Consultant",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Clean, intuitive, and powerful. Everything I need to manage my consulting practice efficiently.",
      rating: 5,
    },
  ]

  return (
    <div className="light min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600 hover:scale-105 transition-transform cursor-pointer">
                SchedulePro
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
                <Link href="#testimonials" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Reviews
                </Link>
                <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" className="text-slate-600" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all" asChild>
                <Link href="/auth/register">Start Free Trial</Link>
              </Button>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="#features" className="block px-3 py-2 text-slate-600">
                Features
              </Link>
              <Link href="/pricing" className="block px-3 py-2 text-slate-600">
                Pricing
              </Link>
              <Link href="#testimonials" className="block px-3 py-2 text-slate-600">
                Reviews
              </Link>
              <Link href="/dashboard" className="block px-3 py-2 text-slate-600">
                Dashboard
              </Link>
              <div className="px-3 py-2 space-y-2">
                <ThemeToggle />
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/auth/register">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 animate-slide-up">
              Transform Your Business with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
                Smart Scheduling
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto animate-slide-up animation-delay-200">
              Streamline appointments, boost productivity, and delight your clients with our AI-powered scheduling
              platform trusted by thousands of businesses worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up animation-delay-400">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 hover:scale-105 transition-all"
                asChild
              >
                <Link href="/auth/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 bg-transparent hover:scale-105 transition-all"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center animate-slide-up animation-delay-600">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter end={50000} />+
                </div>
                <div className="text-slate-600">Happy Customers</div>
              </div>
              <div className="text-center animate-slide-up animation-delay-700">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  <AnimatedCounter end={2500000} />+
                </div>
                <div className="text-slate-600">Appointments Scheduled</div>
              </div>
              <div className="text-center animate-slide-up animation-delay-800">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  <AnimatedCounter end={99} />%
                </div>
                <div className="text-slate-600">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your scheduling workflow and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by businesses worldwide</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See what our customers have to say about their experience with SchedulePro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="h-full hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to transform your scheduling?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses already using SchedulePro to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-slate-50 text-lg px-8 py-3 hover:scale-105 transition-all"
                asChild
              >
                <Link href="/auth/register">
                  Start Free Trial
                  <CheckCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 bg-transparent hover:scale-105 transition-all"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">SchedulePro</div>
              <p className="text-slate-400">The modern scheduling platform for growing businesses.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Roadmap & Upcoming Features
                </Link>
                </li>
               
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 SchedulePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
