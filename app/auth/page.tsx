"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const [pendingEmail, setPendingEmail] = useState("")
  const [otpValue, setOtpValue] = useState("")
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const { login, register, verifyOTP, resendOTP, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("login")

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "register") {
      setActiveTab("register")
    }
  }, [searchParams])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/account")
    }
  }, [isAuthenticated, router])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Email validation
      if (!loginData.email || !loginData.email.includes("@")) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Password validation
      if (!loginData.password || loginData.password.length < 6) {
        toast({
          title: "Invalid password",
          description: "Password must be at least 6 characters.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const success = await login(loginData.email, loginData.password)
      if (success) {
        router.push("/")
      } else {
        // Check if OTP verification is needed
        setPendingEmail(loginData.email)
        setShowOTPVerification(true)
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Name validation
    if (!registerData.name || registerData.name.trim().length < 2) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid name (at least 2 characters).",
        variant: "destructive",
      })
      return
    }

    // Email validation
    if (!registerData.email || !registerData.email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // Password validation
    if (!registerData.password || registerData.password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      })
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await register(registerData.name, registerData.email, registerData.password)
      if (success) {
        setPendingEmail(registerData.email)
        setShowOTPVerification(true)
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await verifyOTP(pendingEmail, otpValue)
      if (success) {
        router.push("/")
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    try {
      await resendOTP(pendingEmail)
    } finally {
      setIsLoading(false)
    }
  }

  const resetOTPFlow = () => {
    setShowOTPVerification(false)
    setPendingEmail("")
    setOtpValue("")
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!forgotPasswordEmail || !forgotPasswordEmail.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotPasswordEmail,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResetEmailSent(true)
        toast({
          title: "Reset email sent",
          description: "Please check your email for password reset instructions.",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send reset email. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showOTPVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-theme-light via-white to-theme-light/30">
        <Header />

        <main className="pt-20">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold gradient-text font-playfair mb-2">Verify Your Email</h1>
              <p className="text-gray-600">Enter the 6-digit code sent to {pendingEmail}</p>
            </div>

            <Card className="premium-card shadow-xl">
              <CardContent className="p-6">
                <form onSubmit={handleOTPSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="otp" className="text-center block">Verification Code</Label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || otpValue.length !== 6}
                    className="w-full luxury-gradient text-white hover:shadow-lg transition-all duration-300"
                  >
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Button>

                  <div className="text-center space-y-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-sm text-theme-medium hover:underline"
                    >
                      Resend OTP
                    </Button>
                    <br />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={resetOTPFlow}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Back to login
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-light via-white to-theme-light/30">
      <Header />

      <main className="pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text font-playfair mb-2">Welcome to Nurvi Jewel</h1>
            <p className="text-gray-600">Sign in to your account or create a new one</p>
          </div>

          <Card className="premium-card shadow-xl">
            <CardContent className="p-0">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-t-lg">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Create Account</TabsTrigger>
                  <TabsTrigger value="forgot-password">Reset Password</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="p-6">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="your@email.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full luxury-gradient text-white hover:shadow-lg transition-all duration-300"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="text-center">
                      <Button 
                        type="button" 
                        variant="link" 
                        onClick={() => setActiveTab("forgot-password")}
                        className="text-sm text-theme-medium hover:underline p-0"
                      >
                        Forgot your password?
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="p-6">
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-name"
                          type="text"
                          value={registerData.name}
                          onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="your@email.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-confirm-password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm your password"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full luxury-gradient text-white hover:shadow-lg transition-all duration-300"
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>

                    <p className="text-xs text-gray-600 text-center">
                      By creating an account, you agree to our{" "}
                      <a href="/terms" className="text-theme-medium hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-theme-medium hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="forgot-password" className="p-6">
                  {!resetEmailSent ? (
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                          <Mail className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Reset Your Password</h3>
                        <p className="text-sm text-gray-600 mt-2">
                          Enter your email address and we'll send you a link to reset your password.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="forgot-email"
                            type="email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full luxury-gradient text-white hover:shadow-lg transition-all duration-300"
                      >
                        {isLoading ? "Sending reset email..." : "Send Reset Email"}
                      </Button>

                      <div className="text-center">
                        <Button 
                          type="button" 
                          variant="link" 
                          onClick={() => setActiveTab("login")}
                          className="text-sm text-theme-medium hover:underline p-0"
                        >
                          Back to Sign In
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Check Your Email</h3>
                      <p className="text-sm text-gray-600">
                        We've sent a password reset link to {forgotPasswordEmail}
                      </p>
                      <p className="text-xs text-gray-500">
                        Didn't receive the email? Check your spam folder or contact support.
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setResetEmailSent(false)
                          setForgotPasswordEmail("")
                        }}
                        className="w-full"
                      >
                        Try Again
                      </Button>
                      <Button 
                        type="button" 
                        variant="link" 
                        onClick={() => setActiveTab("login")}
                        className="text-sm text-theme-medium hover:underline p-0"
                      >
                        Back to Sign In
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
