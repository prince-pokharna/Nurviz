"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
  isSale?: boolean
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isWishlisted: (id: string) => boolean
  toggleWishlist: (item: WishlistItem) => void
  clearWishlist: () => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const { toast } = useToast()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('nurvi-wishlist')
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist)
          setItems(Array.isArray(parsedWishlist) ? parsedWishlist : [])
        } catch (error) {
          console.error('Error parsing wishlist:', error)
          setItems([])
        }
      }
      setIsHydrated(true)
    }
  }, [])

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('nurvi-wishlist', JSON.stringify(items))
      // Dispatch custom event to notify other components (like header)
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { count: items.length } 
      }))
    }
  }, [items, isHydrated])

  const addToWishlist = (item: WishlistItem) => {
    setItems(prevItems => {
      // Check if item already exists
      if (prevItems.some(existingItem => existingItem.id === item.id)) {
        return prevItems
      }
      
      const newItems = [...prevItems, item]
      
      toast({
        title: "Added to wishlist! ❤️",
        description: `${item.name} has been added to your wishlist.`,
      })
      
      return newItems
    })
  }

  const removeFromWishlist = (id: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id)
      const newItems = prevItems.filter(item => item.id !== id)
      
      if (itemToRemove) {
        toast({
          title: "Removed from wishlist",
          description: `${itemToRemove.name} has been removed from your wishlist.`,
        })
      }
      
      return newItems
    })
  }

  const isWishlisted = (id: string): boolean => {
    return items.some(item => item.id === id)
  }

  const toggleWishlist = (item: WishlistItem) => {
    if (isWishlisted(item.id)) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(item)
    }
  }

  const clearWishlist = () => {
    setItems([])
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    })
  }

  const contextValue: WishlistContextType = {
    items,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    toggleWishlist,
    clearWishlist,
    wishlistCount: items.length,
  }

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  )
} 