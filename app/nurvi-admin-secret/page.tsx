"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SecretAdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin page immediately
    router.push('/admin')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#B4AFA7] via-[#9E8E80] to-[#8A8786]">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Redirecting to admin panel...</p>
      </div>
    </div>
  )
}
