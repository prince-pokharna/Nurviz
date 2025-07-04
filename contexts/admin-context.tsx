"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AdminUser {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "manager"
  permissions: string[]
}

interface AdminState {
  admin: AdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AdminContextType extends AdminState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AdminContext = createContext<AdminContextType | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminState>({
    admin: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for saved admin session
    const savedAdmin = localStorage.getItem("nurvi-admin")
    if (savedAdmin) {
      setState({
        admin: JSON.parse(savedAdmin),
        isLoading: false,
        isAuthenticated: true,
      })
    } else {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Demo admin credentials - replace with real authentication
    if (email === "admin@nurvijewel.com" && password === "admin123") {
      const admin = {
        id: "admin-1",
        email,
        name: "Admin User",
        role: "super_admin" as const,
        permissions: [
          "view_customers",
          "edit_customers",
          "delete_customers",
          "view_orders",
          "edit_orders",
          "view_analytics",
          "manage_products",
          "manage_settings",
        ],
      }

      localStorage.setItem("nurvi-admin", JSON.stringify(admin))
      setState({
        admin,
        isLoading: false,
        isAuthenticated: true,
      })
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    localStorage.removeItem("nurvi-admin")
    setState({
      admin: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const hasPermission = (permission: string) => {
    return state.admin?.permissions.includes(permission) || false
  }

  return <AdminContext.Provider value={{ ...state, login, logout, hasPermission }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
