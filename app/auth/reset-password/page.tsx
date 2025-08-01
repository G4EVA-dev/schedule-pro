"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { useParams, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Convex password reset
  // import { useSearchParams } from 'next/navigation';
  // import { api } from '@/convex/_generated/api';
  // import { useAction } from 'convex/react';

  const [error, setError] = useState("");
  // Retrieve token from either ?token query or /reset-password/[token] segment
  const searchParams = useSearchParams();
  const params = useParams();
  const token = searchParams.get("token") ?? (params?.token as string | undefined) ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (!token) {
      setError("Reset token missing from URL");
      return;
    }
    setIsLoading(true);
    try {
      // This should call a backend API route or directly use Convex action
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: formData.password }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password reset successful"
        subtitle="Your password has been successfully updated. You can now sign in with your new password"
        image="/placeholder.svg?height=400&width=400&text=Success"
      >
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-1 pb-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Password updated!</CardTitle>
              <CardDescription>
                Your password has been successfully reset. You can now sign in with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Continue to sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Create new password"
      subtitle="Your new password must be different from your previous password"
      image="/placeholder.svg?height=400&width=400&text=New+Password"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create new password</h1>
          <p className="text-muted-foreground">Your new password must be different from previous used passwords</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Set new password</CardTitle>
            <CardDescription>Must be at least 8 characters with a mix of letters, numbers & symbols</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">Password requirements:</p>
                  <ul className="space-y-1 text-xs">
                    <li
                      className={`flex items-center ${formData.password.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full mr-2 ${formData.password.length >= 8 ? "bg-green-600" : "bg-muted-foreground"}`}
                      />
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center ${/[A-Z]/.test(formData.password) ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? "bg-green-600" : "bg-muted-foreground"}`}
                      />
                      One uppercase letter
                    </li>
                    <li
                      className={`flex items-center ${/[0-9]/.test(formData.password) ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full mr-2 ${/[0-9]/.test(formData.password) ? "bg-green-600" : "bg-muted-foreground"}`}
                      />
                      One number
                    </li>
                    <li
                      className={`flex items-center ${/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(formData.password) ? "bg-green-600" : "bg-muted-foreground"}`}
                      />
                      One special character
                    </li>
                  </ul>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating password...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Reset password
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  )
}
