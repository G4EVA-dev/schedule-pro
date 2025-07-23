"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SocialLoginProps {
  isRegister?: boolean
}

export function SocialLogin({ isRegister = false }: SocialLoginProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSocialLogin = async (provider: string) => {
    setLoadingProvider(provider)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoadingProvider(null)
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  const buttonText = isRegister ? "Sign up" : "Continue"

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full h-11 border-2 hover:bg-accent bg-transparent"
        onClick={() => handleSocialLogin("google")}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "google" ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Connecting...
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {buttonText} with Google
          </div>
        )}
      </Button>

      <Button
        variant="outline"
        className="w-full h-11 border-2 hover:bg-accent bg-transparent"
        onClick={() => handleSocialLogin("facebook")}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "facebook" ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Connecting...
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {buttonText} with Facebook
          </div>
        )}
      </Button>

      <Button
        variant="outline"
        className="w-full h-11 border-2 hover:bg-accent bg-transparent"
        onClick={() => handleSocialLogin("apple")}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "apple" ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Connecting...
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C8.396 0 8.025.044 6.79.207 5.557.37 4.697.594 3.953.89c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.884.11 5.744-.054 6.978-.218 8.214-.262 8.585-.262 12.017c0 3.431.044 3.803.207 5.037.164 1.234.388 2.094.684 2.838.306.79.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.744.296 1.604.52 2.838.684 1.234.164 1.606.208 5.037.208 3.431 0 3.803-.044 5.037-.208 1.234-.164 2.094-.388 2.838-.684.79-.305 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.744.52-1.604.684-2.838.164-1.234.208-1.606.208-5.037 0-3.431-.044-3.803-.208-5.037-.164-1.234-.388-2.094-.684-2.838a5.907 5.907 0 0 0-1.384-2.126A5.907 5.907 0 0 0 19.892.63c-.744-.296-1.604-.52-2.838-.684C15.82.044 15.448 0 12.017 0zm0 2.17c3.304 0 3.648.012 4.938.07 1.192.054 1.839.25 2.27.413.571.222.978.487 1.405.914.427.427.692.834.914 1.405.163.431.359 1.078.413 2.27.058 1.29.07 1.634.07 4.938s-.012 3.648-.07 4.938c-.054 1.192-.25 1.839-.413 2.27-.222.571-.487.978-.914 1.405-.427.427-.834.692-1.405.914-.431.163-1.078.359-2.27.413-1.29.058-1.634.07-4.938.07s-3.648-.012-4.938-.07c-1.192-.054-1.839-.25-2.27-.413-.571-.222-.978-.487-1.405-.914-.427-.427-.692-.834-.914-1.405-.163-.431-.359-1.078-.413-2.27-.058-1.29-.07-1.634-.07-4.938s.012-3.648.07-4.938c.054-1.192.25-1.839.413-2.27.222-.571.487-.978.914-1.405.427-.427.834-.692 1.405-.914.431-.163 1.078-.359 2.27-.413 1.29-.058 1.634-.07 4.938-.07z" />
              <path d="M12.017 15.33a3.312 3.312 0 1 1 0-6.624 3.312 3.312 0 0 1 0 6.624zm0-8.457a5.145 5.145 0 1 0 0 10.29 5.145 5.145 0 0 0 0-10.29zm6.532-1.194a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
            </svg>
            {buttonText} with Apple
          </div>
        )}
      </Button>
    </div>
  )
}
