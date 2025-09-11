"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { AdminUser, hasPermission as checkPermission } from "@/lib/admin-auth"
import { AdminPermission } from "@/lib/admin-config"

interface AdminState {
  admin: AdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AdminContextType extends AdminState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: AdminPermission) => boolean
  refreshAuth: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>({
    admin: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Verify authentication on mount
  useEffect(() => {
    console.log('🔍 Admin context mounting, verifying auth...')
    verifyAuth()
  }, [])

  const verifyAuth = async () => {
    try {
      console.log('🔍 Verifying admin authentication...')
      const response = await fetch('/api/admin/auth/verify', {
        method: 'GET',
        credentials: 'include',
      })

      console.log('📡 Auth verification response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Auth verification successful:', data)
        setState({
          admin: data.admin,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        console.log('❌ Auth verification failed')
        setState({
          admin: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    } catch (error) {
      console.error('❌ Auth verification error:', error)
      setState({
        admin: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Admin context login called:', { email, passwordLength: password.length })
      
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      console.log('📡 Login response status:', response.status)
      const data = await response.json()
      console.log('📡 Login response data:', data)

      if (response.ok && data.success) {
        console.log('✅ Admin context login successful')
        setState({
          admin: data.admin,
          isLoading: false,
          isAuthenticated: true,
        })
        
        // Store token in localStorage as backup
        if (data.token) {
          localStorage.setItem("nurvi-admin-token", data.token)
        }
      } else {
        console.log('❌ Admin context login failed:', data.error)
        throw new Error(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('❌ Admin context login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }

    // Clear local storage and state
    localStorage.removeItem("nurvi-admin-token")
    setState({
      admin: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const hasPermission = (permission: AdminPermission) => {
    return checkPermission(state.admin, permission)
  }

  const refreshAuth = async () => {
    await verifyAuth()
  }

  return (
    <AdminContext.Provider 
      value={{ ...state, login, logout, hasPermission, refreshAuth }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
