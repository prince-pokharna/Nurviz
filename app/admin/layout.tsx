"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdmin } from '@/contexts/admin-context'
import AdminNav from '@/components/admin/admin-nav'
import { Toaster } from '@/components/ui/toaster'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if still loading or already on login page
    if (isLoading || pathname === '/admin') {
      return
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, router, pathname])


  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#B4AFA7] to-[#8A8786] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated && pathname !== '/admin') {
    return null // Will redirect via useEffect
  }

  // Show login page without navigation
  if (pathname === '/admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
        <Toaster />
      </div>
    )
  }

  // Show admin layout with navigation
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  )
}
