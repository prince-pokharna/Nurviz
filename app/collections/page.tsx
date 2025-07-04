"use client"

import { useState, useEffect } from "react"
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import ProductQuickView from "@/components/product-quick-view"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { PRODUCTS, PRODUCT_CATEGORIES, PRODUCT_MATERIALS } from "@/lib/constants"

export default function CollectionsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All")
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [visibleProducts, setVisibleProducts] = useState(12)
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  const styles = ["Trendy", "Minimal", "Statement", "Casual", "Elegant", "Traditional", "Contemporary", "Bridal"]
  const materials = PRODUCT_MATERIALS
  const occasions = ["Everyday", "Party", "Content Creation", "Photoshoot", "Wedding", "Festival"]

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  // Load products after hydration to avoid mismatch
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Try to fetch from API first (client-side)
        const response = await fetch('/api/inventory')
        if (response.ok) {
          const data = await response.json()
          setAllProducts(data.all || [])
        } else {
          // Fallback to constants
          setAllProducts(PRODUCTS)
        }
      } catch (error) {
        console.warn('Failed to load from API, using fallback:', error)
        // Fallback to constants
        setAllProducts(PRODUCTS)
      }
      setIsHydrated(true)
    }
    
    loadProducts()
  }, [])

  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory !== "All" && product.category !== selectedCategory) return false
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false
    
    // Filter by styles if selected
    if (selectedStyles.length > 0) {
      const productStyle = product.style || ""
      const hasMatchingStyle = selectedStyles.some(style => 
        productStyle.toLowerCase().includes(style.toLowerCase())
      )
      if (!hasMatchingStyle) return false
    }
    
    // Filter by materials if selected
    if (selectedMaterials.length > 0) {
      const productMaterial = product.material || ""
      const hasMatchingMaterial = selectedMaterials.some(material => 
        productMaterial.toLowerCase().includes(material.toLowerCase())
      )
      if (!hasMatchingMaterial) return false
    }
    
    // Filter by occasions if selected
    if (selectedOccasions.length > 0) {
      const productOccasion = product.occasion || ""
      const hasMatchingOccasion = selectedOccasions.some(occasion => 
        productOccasion.toLowerCase().includes(occasion.toLowerCase())
      )
      if (!hasMatchingOccasion) return false
    }
    
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "newest":
        return b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1
      default:
        return 0
    }
  })

  const displayedProducts = sortedProducts.slice(0, visibleProducts)

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 12)
  }

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product)
    setIsQuickViewOpen(true)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            key="All"
            onClick={() => setSelectedCategory("All")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === "All" ? "bg-amber-100 text-amber-800" : "hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category.name ? "bg-amber-100 text-amber-800" : "hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={100000} min={0} step={1000} className="w-full" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
            <span>₹{priceRange[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Style</h3>
        <div className="space-y-2">
          {styles.map((style) => (
            <div key={style} className="flex items-center space-x-2">
              <Checkbox
                id={style}
                checked={selectedStyles.includes(style)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedStyles([...selectedStyles, style])
                  } else {
                    setSelectedStyles(selectedStyles.filter((s) => s !== style))
                  }
                }}
              />
              <label htmlFor={style} className="text-sm">
                {style}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Material</h3>
        <div className="space-y-2">
          {materials.map((material) => (
            <div key={material} className="flex items-center space-x-2">
              <Checkbox
                id={material}
                checked={selectedMaterials.includes(material)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedMaterials([...selectedMaterials, material])
                  } else {
                    setSelectedMaterials(selectedMaterials.filter((m) => m !== material))
                  }
                }}
              />
              <label htmlFor={material} className="text-sm">
                {material}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Occasion</h3>
        <div className="space-y-2">
          {occasions.map((occasion) => (
            <div key={occasion} className="flex items-center space-x-2">
              <Checkbox
                id={occasion}
                checked={selectedOccasions.includes(occasion)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedOccasions([...selectedOccasions, occasion])
                  } else {
                    setSelectedOccasions(selectedOccasions.filter((o) => o !== occasion))
                  }
                }}
              />
              <label htmlFor={occasion} className="text-sm">
                {occasion}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-50 to-yellow-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              className="text-4xl lg:text-6xl font-bold gradient-text font-playfair mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {selectedCategory === "All" ? "All Collections" : selectedCategory}
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Anti-tarnish imitation jewelry designed for the modern influencer and content creator
            </motion.p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 space-y-6">
              <div className="premium-card p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </h2>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-semibold">
                    {selectedCategory === "All" ? "All Products" : selectedCategory}
                  </h2>
                  {isHydrated && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {filteredProducts.length} items
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>Refine your search to find the perfect jewelry piece.</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="flex border border-gray-200 rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-6"
                }
              >
                {displayedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
                  >
                    <ProductCard product={product} viewMode={viewMode} onQuickView={() => handleQuickView(product)} />
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {isHydrated && visibleProducts < filteredProducts.length && (
                <div className="text-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    size="lg"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50"
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-[900px] p-0">
          {quickViewProduct && (
            <ProductQuickView product={quickViewProduct} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
