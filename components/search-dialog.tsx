"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock search data
const recentSearches = ["Kundan Necklace", "Pearl Earrings", "Gold Rings", "Statement Jewelry"]
const trendingSearches = ["Bridal Sets", "Minimalist Jewelry", "Layered Necklaces", "Hoop Earrings"]
const popularProducts = [
  {
    id: "1",
    name: "Royal Kundan Necklace Set",
    price: 45999,
    image: "/placeholder.svg?height=60&width=60",
    category: "Necklaces",
  },
  {
    id: "2",
    name: "Diamond-Cut Hoop Earrings",
    price: 12999,
    image: "/placeholder.svg?height=60&width=60",
    category: "Earrings",
  },
  {
    id: "3",
    name: "Elegant Pearl Bracelet",
    price: 8999,
    image: "/placeholder.svg?height=60&width=60",
    category: "Bracelets",
  },
]

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        // Mock search results
        const results = popularProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setSearchResults(results)
        setIsSearching(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleClose = () => {
    setSearchQuery("")
    setSearchResults([])
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white mx-4 mt-20 rounded-2xl shadow-2xl max-w-2xl mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-6 border-b border-luxury-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-luxury-500" />
              <Input
                placeholder="Search for jewelry, categories, or styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-luxury-200 focus:border-luxury-400 focus:ring-luxury-400"
                autoFocus
              />
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Content */}
        <div className="max-h-96 overflow-y-auto">
          {searchQuery.length === 0 ? (
            /* Default State */
            <div className="p-6 space-y-6">
              {/* Recent Searches */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-luxury-500" />
                  <h3 className="font-medium text-luxury-900">Recent Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1 bg-luxury-100 text-luxury-700 rounded-full text-sm hover:bg-luxury-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Searches */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-luxury-500" />
                  <h3 className="font-medium text-luxury-900">Trending Now</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm hover:bg-rose-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Products */}
              <div>
                <h3 className="font-medium text-luxury-900 mb-3">Popular Products</h3>
                <div className="space-y-3">
                  {popularProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={handleClose}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-luxury-50 transition-colors"
                    >
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-luxury-900">{product.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                          <span className="text-sm font-medium text-luxury-700">₹{product.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : isSearching ? (
            /* Loading State */
            <div className="p-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-luxury-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-luxury-600">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            /* Search Results */
            <div className="p-6">
              <h3 className="font-medium text-luxury-900 mb-3">Search Results ({searchResults.length})</h3>
              <div className="space-y-3">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={handleClose}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-luxury-50 transition-colors"
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-luxury-900">{product.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        <span className="text-sm font-medium text-luxury-700">₹{product.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* No Results */
            <div className="p-6 text-center">
              <p className="text-luxury-600 mb-4">No results found for "{searchQuery}"</p>
              <Link href="/collections" onClick={handleClose}>
                <Button variant="outline" className="border-luxury-400 text-luxury-700">
                  Browse All Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SearchDialog
