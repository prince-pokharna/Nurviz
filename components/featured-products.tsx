"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import { getFeaturedProducts } from "@/lib/constants"

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("all")
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Load products after hydration to avoid mismatch
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Try to fetch from API first (client-side)
        const response = await fetch('/api/inventory')
        if (response.ok) {
          const data = await response.json()
          const featured = data.featured && data.featured.length > 0 ? data.featured : data.all.slice(0, 6)
          setFeaturedProducts(featured)
        } else {
          // Fallback to constants function
          setFeaturedProducts(getFeaturedProducts())
        }
      } catch (error) {
        console.warn('Failed to load from API, using fallback:', error)
        // Fallback to constants function
        setFeaturedProducts(getFeaturedProducts())
      }
      setIsHydrated(true)
    }
    
    loadProducts()
  }, [])

  const tabs = [
    { id: "all", label: "All Products", count: isHydrated ? featuredProducts.length : 0 },
    { id: "new", label: "New Arrivals", count: isHydrated ? featuredProducts.filter((p) => p.isNew).length : 0 },
    { id: "sale", label: "On Sale", count: isHydrated ? featuredProducts.filter((p) => p.isSale).length : 0 },
    { id: "trending", label: "Trending", count: isHydrated ? featuredProducts.filter((p) => (p.rating || 0) >= 4.8).length : 0 },
  ]

  const filteredProducts = featuredProducts.filter((product) => {
    if (activeTab === "all") return true
    if (activeTab === "new") return product.isNew
    if (activeTab === "sale") return product.isSale
    if (activeTab === "trending") return (product.rating || 0) >= 4.8
    return true
  })

  return (
    <section className="py-20 luxury-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-luxury-100 text-luxury-700 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Featured Collection
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text font-serif mb-6">Handpicked for You</h2>
          <p className="text-xl text-luxury-700 max-w-3xl mx-auto leading-relaxed">
            Discover our most loved pieces, carefully curated for the modern woman who appreciates timeless elegance and
            contemporary style.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "luxury-gradient text-white shadow-lg"
                  : "bg-white text-luxury-700 hover:bg-luxury-50 border border-luxury-200"
              }`}
            >
              {tab.label}
              {isHydrated && (
                <Badge
                  variant="secondary"
                  className={`ml-2 ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-luxury-100 text-luxury-600"}`}
                >
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12"
        >
          {filteredProducts.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Show loading state if not hydrated */}
        {!isHydrated && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/collections">
            <Button size="lg" className="luxury-gradient text-white hover:shadow-xl transition-all duration-300 group">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
