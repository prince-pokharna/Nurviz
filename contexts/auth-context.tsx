"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  isEmailVerified?: boolean
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  verifyOTP: (email: string, otp: string) => Promise<boolean>
  resendOTP: (email: string) => Promise<boolean>
  logout: () => void
}

// Mock database for users - in a real app, this would be a backend service
const USERS_STORAGE_KEY = "nurvi-users"
const OTP_STORAGE_KEY = "nurvi-otp"

interface StoredUser {
  id: string
  email: string
  name: string
  password: string
  avatar?: string
  isEmailVerified: boolean
  createdAt: string
}

interface StoredOTP {
  email: string
  otp: string
  expiresAt: number
  type: 'registration' | 'login'
}

// Initialize with some validation helpers
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPassword = (password: string) => {
  return password.length >= 6
}

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via email (real implementation)
const sendOTPEmail = async (email: string, otp: string, type: 'registration' | 'login', name?: string): Promise<boolean> => {
  try {
    console.log(`📧 Sending OTP to ${email}: ${otp} (Type: ${type})`)
    
    // Store OTP for verification (expires in 10 minutes)
    const otpData: StoredOTP = {
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      type
    }
    
    const existingOTPs = JSON.parse(localStorage.getItem(OTP_STORAGE_KEY) || '[]')
    const filteredOTPs = existingOTPs.filter((stored: StoredOTP) => stored.email !== email)
    filteredOTPs.push(otpData)
    
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(filteredOTPs))
    
    // Send actual email using our API
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        otp: otp,
        type: type,
        name: name
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Email sent successfully:', result.messageId)
      return true
    } else {
      console.error('❌ Email sending failed:', result.error)
      return false
    }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return false
  }
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const { toast } = useToast()

  // Initialize users if not exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      const users = localStorage.getItem(USERS_STORAGE_KEY)
      if (!users) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]))
      }
      const otps = localStorage.getItem(OTP_STORAGE_KEY)
      if (!otps) {
        localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify([]))
      }
    }
  }, [])

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem("nurvi-user")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setState({
        user,
        isLoading: false,
        isAuthenticated: user.isEmailVerified !== false, // Default to true for existing users
      })
    } else {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validate inputs
    if (!isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return false
    }

    if (!isValidPassword(password)) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      })
      return false
    }

    try {
      // Get users from storage
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY) || "[]"
      const users: StoredUser[] = JSON.parse(usersJson)

      // Find user by email
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      // Check if user exists and password matches
      if (!user || user.password !== password) {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
        return false
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        // Send OTP for verification
        const otp = generateOTP()
        await sendOTPEmail(email, otp, 'login')
        
        toast({
          title: "Email verification required",
          description: "Please check your email for the OTP to complete login.",
          variant: "destructive",
        })
        return false
      }

      // Create session user (without password)
      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar || "/placeholder.svg?height=40&width=40",
        isEmailVerified: user.isEmailVerified,
      }

      // Save to session
      localStorage.setItem("nurvi-user", JSON.stringify(sessionUser))

      setState({
        user: sessionUser,
        isLoading: false,
        isAuthenticated: true,
      })

      toast({
        title: "Welcome back!",
        description: `You've successfully logged in as ${user.name}.`,
      })

      return true
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Validate inputs
    if (!name || name.trim().length < 2) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid name (at least 2 characters).",
        variant: "destructive",
      })
      return false
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return false
    }

    if (!isValidPassword(password)) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      })
      return false
    }

    try {
      // Get existing users
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY) || "[]"
      const users: StoredUser[] = JSON.parse(usersJson)

      // Check if email already exists
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (existingUser) {
        toast({
          title: "Registration failed",
          description: "This email is already registered. Please use a different email or login.",
          variant: "destructive",
        })
        return false
      }

      // Create new user (unverified)
      const newUser: StoredUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        password,
        avatar: "/placeholder.svg?height=40&width=40",
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
      }

      // Add to users array
      users.push(newUser)
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

      // Send OTP for verification
      const otp = generateOTP()
      await sendOTPEmail(email, otp, 'registration', name)

      toast({
        title: "Registration successful!",
        description: "Please check your email for the OTP to verify your account.",
      })

      return true
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Get stored OTPs
      const otpsJson = localStorage.getItem(OTP_STORAGE_KEY) || "[]"
      const otps: StoredOTP[] = JSON.parse(otpsJson)

      // Find matching OTP
      const storedOTP = otps.find(o => 
        o.email.toLowerCase() === email.toLowerCase() && 
        o.otp === otp && 
        o.expiresAt > Date.now()
      )

      if (!storedOTP) {
        toast({
          title: "Invalid or expired OTP",
          description: "Please check your OTP or request a new one.",
          variant: "destructive",
        })
        return false
      }

      // Remove used OTP
      const filteredOTPs = otps.filter(o => !(o.email === email && o.otp === otp))
      localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(filteredOTPs))

      // Update user as verified
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY) || "[]"
      const users: StoredUser[] = JSON.parse(usersJson)
      const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase())

      if (userIndex >= 0) {
        users[userIndex].isEmailVerified = true
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

        // Auto-login the user after verification
        const user = users[userIndex]
        const sessionUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar || "/placeholder.svg?height=40&width=40",
          isEmailVerified: true,
        }

        localStorage.setItem("nurvi-user", JSON.stringify(sessionUser))

        setState({
          user: sessionUser,
          isLoading: false,
          isAuthenticated: true,
        })

        toast({
          title: "Email verified successfully!",
          description: `Welcome to Nurvi Jewel, ${user.name}!`,
        })

        return true
      }

      return false
    } catch (error) {
      console.error("OTP verification error:", error)
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const resendOTP = async (email: string): Promise<boolean> => {
    try {
      const otp = generateOTP()
      await sendOTPEmail(email, otp, 'login')
      
      toast({
        title: "OTP sent",
        description: "A new OTP has been sent to your email.",
      })
      
      return true
    } catch (error) {
      console.error("Resend OTP error:", error)
      toast({
        title: "Failed to send OTP",
        description: "Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("nurvi-user")
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, verifyOTP, resendOTP, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
