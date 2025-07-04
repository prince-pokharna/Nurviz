"use client"

import { useState } from "react"
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { getProductsByCategory } from "@/lib/constants"

export default function NecklacesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 150000])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedLengths, setSelectedLengths] = useState<string[]>([])

  // Get necklaces from centralized inventory
  const necklaces = getProductsByCategory("Necklaces")

  const materials = ["Gold", "Silver", "Kundan", "Pearl", "Beads"]
  const styles = ["Temple", "Traditional", "Contemporary", "Bridal", "Party Wear"]
  const lengths = ["Choker", "Short", "Medium", "Long", "Extra Long"]

  const filteredNecklaces = necklaces.filter((necklace) => {
    if (necklace.price < priceRange[0] || necklace.price > priceRange[1]) return false
    
    // Filter by materials if selected
    if (selectedMaterials.length > 0) {
      const productMaterial = necklace.material || necklace.specifications?.Material || ""
      const hasMatchingMaterial = selectedMaterials.some(material => 
        productMaterial.toLowerCase().includes(material.toLowerCase())
      )
      if (!hasMatchingMaterial) return false
    }

    // Filter by styles if selected
    if (selectedStyles.length > 0) {
      const productStyle = necklace.style || necklace.specifications?.Style || ""
      const hasMatchingStyle = selectedStyles.some(style => 
        productStyle.toLowerCase().includes(style.toLowerCase())
      )
      if (!hasMatchingStyle) return false
    }

    return true
  })

  const sortedNecklaces = [...filteredNecklaces].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1
      default:
        return 0
    }
  })

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={150000}
            min={0}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Materials</h3>
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
        <h3 className="font-semibold mb-3">Styles</h3>
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
        <h3 className="font-semibold mb-3">Length</h3>
        <div className="space-y-2">
          {lengths.map((length) => (
            <div key={length} className="flex items-center space-x-2">
              <Checkbox
                id={length}
                checked={selectedLengths.includes(length)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedLengths([...selectedLengths, length])
                  } else {
                    setSelectedLengths(selectedLengths.filter((l) => l !== length))
                  }
                }}
              />
              <label htmlFor={length} className="text-sm">
                {length}
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
            <h1 className="text-4xl lg:text-6xl font-bold gradient-text font-playfair mb-4">Necklaces Collection</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our stunning collection of necklaces, from traditional temple jewelry to contemporary designs.
            </p>
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
                  <h2 className="text-2xl font-semibold">Necklaces</h2>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {sortedNecklaces.length} items
                  </Badge>
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
                        <SheetDescription>Refine your search to find the perfect necklace.</SheetDescription>
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
                {sortedNecklaces.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  Load More Necklaces
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
