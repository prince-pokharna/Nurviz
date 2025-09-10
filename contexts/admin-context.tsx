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
    verifyAuth()
  }, [])

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setState({
          admin: data.admin,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        setState({
          admin: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    } catch (error) {
      console.error('Auth verification failed:', error)
      setState({
        admin: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
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
        throw new Error(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
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
