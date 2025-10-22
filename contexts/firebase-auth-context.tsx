"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '@/lib/firebase-config'
import { FirebaseDatabase } from '@/lib/firebase-database'
import { OTPService } from '@/lib/firebase-auth'
import { useToast } from '@/hooks/use-toast'

interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  emailVerified: boolean
  isAdmin?: boolean
}

interface AuthState {
  user: FirebaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  sendOTP: (email: string, type: 'registration' | 'login' | 'password_reset') => Promise<{ success: boolean; error?: string }>
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>
  resendOTP: (email: string, type: 'registration' | 'login' | 'password_reset') => Promise<{ success: boolean; error?: string }>
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>
  sendEmailVerification: () => Promise<{ success: boolean; error?: string }>
  isAdmin: () => Promise<boolean>
}

const FirebaseAuthContext = createContext<AuthContextType | null>(null)

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // Get additional user data from Firestore
        const userData = await FirebaseDatabase.getUserByEmail(user.email!)
        
        setState({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            isAdmin: userData?.is_admin || false
          },
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/firebase/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.name}!`,
        })
        return { success: true }
      } else {
        if (data.requiresVerification) {
          return { success: false, error: data.error, requiresVerification: true }
        }
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/firebase/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Registration successful",
          description: "Please check your email for verification.",
        })
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      })
    }
  }

  const sendOTP = async (email: string, type: 'registration' | 'login' | 'password_reset') => {
    try {
      const response = await fetch('/api/firebase/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "OTP sent",
          description: "A new OTP has been sent to your email.",
        })
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      return { success: false, error: 'Failed to send OTP. Please try again.' }
    }
  }

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch('/api/firebase/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "OTP verified",
          description: "Your email has been verified successfully.",
        })
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      return { success: false, error: 'OTP verification failed. Please try again.' }
    }
  }

  const resendOTP = async (email: string, type: 'registration' | 'login' | 'password_reset') => {
    return await sendOTP(email, type)
  }

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast({
        title: "Password reset email sent",
        description: "Please check your email for reset instructions.",
      })
      return { success: true }
    } catch (error: any) {
      console.error('Password reset error:', error)
      return { success: false, error: error.message }
    }
  }

  const sendEmailVerification = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        return { success: false, error: 'No user logged in' }
      }

      await sendEmailVerification(user)
      toast({
        title: "Verification email sent",
        description: "Please check your email for verification instructions.",
      })
      return { success: true }
    } catch (error: any) {
      console.error('Email verification error:', error)
      return { success: false, error: error.message }
    }
  }

  const isAdmin = async () => {
    if (!state.user) return false
    return state.user.isAdmin || false
  }

  return (
    <FirebaseAuthContext.Provider 
      value={{ 
        ...state, 
        login, 
        register, 
        logout, 
        sendOTP, 
        verifyOTP, 
        resendOTP, 
        sendPasswordReset, 
        sendEmailVerification,
        isAdmin
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (!context) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider")
  }
  return context
}
