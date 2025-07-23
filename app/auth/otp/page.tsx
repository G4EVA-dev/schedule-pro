"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { useSearchParams } from "next/navigation"

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "user@example.com"

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      alert("Please enter all 6 digits")
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  const handleResend = async () => {
    setCanResend(false)
    setTimeLeft(60)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert("New OTP sent!")
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We've sent a 6-digit verification code to your email address"
      image="/placeholder.svg?height=400&width=400&text=Verify+Email"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Check your email</h1>
          <p className="text-muted-foreground">
            We sent a verification code to <strong>{email}</strong>
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Enter verification code</CardTitle>
            <CardDescription>Enter the 6-digit code we sent to your email address</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    autoComplete="off"
                  />
                ))}
              </div>

              <div className="text-center">
                {canResend ? (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResend}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend code
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Resend code in {timeLeft}s</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Verify email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>

              <Button asChild variant="ghost" className="w-full">
                <Link href="/auth/register">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to registration
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Didn't receive the code? Check your spam folder or{" "}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-700">
            use a different email
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
