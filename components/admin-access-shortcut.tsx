"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAccessShortcut() {
  const router = useRouter()
  const [tapCount, setTapCount] = useState(0)
  const [tapTimer, setTapTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + Shift + A = Admin Access (for desktop)
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault()
        router.push('/admin')
      }
    }

    // Mobile: Triple tap on logo or header to access admin
    const handleTouchStart = (event: TouchEvent) => {
      // Only trigger on specific elements (logo/header area)
      const target = event.target as HTMLElement
      if (target.closest('header') || target.closest('[data-admin-trigger]')) {
        setTapCount(prev => prev + 1)
        
        // Clear previous timer
        if (tapTimer) {
          clearTimeout(tapTimer)
        }
        
        // Set new timer - reset tap count after 2 seconds
        const newTimer = setTimeout(() => {
          setTapCount(0)
        }, 2000)
        setTapTimer(newTimer)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      if (tapTimer) {
        clearTimeout(tapTimer)
      }
    }
  }, [router, tapTimer])

  // Check for triple tap
  useEffect(() => {
    if (tapCount >= 5) { // 5 taps to access admin on mobile
      setTapCount(0)
      router.push('/admin')
    }
  }, [tapCount, router])

  return null // This component doesn't render anything
}
