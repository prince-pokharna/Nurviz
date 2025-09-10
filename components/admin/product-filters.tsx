"use client"

import { useState, useEffect } from 'react'
import { Search, Filter, X, SlidersHorizontal, Package, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ProductFilters as IProductFilters } from '@/lib/product-manager'

interface ProductFiltersProps {
  filters: IProductFilters
  onFiltersChange: (filters: IProductFilters) => void
  totalProducts: number
  filteredCount: number
}

export default function ProductFilters({
  filters,
  onFiltersChange,
  totalProducts,
  filteredCount
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange || [0, 5000])
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchTerm || undefined })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleFilterChange = (key: keyof IProductFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setPriceRange([0, 5000])
    onFiltersChange({
      sortBy: 'name',
      sortOrder: 'asc'
    })
  }

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof IProductFilters]
    if (key === 'sortBy' || key === 'sortOrder') return false
    return value !== undefined && value !== ''
  }).length

  return (
    <Card className="mb-6">
      <CardContent className="p-4 space-y-4">
        {/* Search and Quick Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by name, SKU, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Rings">Rings</SelectItem>
              <SelectItem value="Necklaces">Necklaces</SelectItem>
              <SelectItem value="Earrings">Earrings</SelectItem>
              <SelectItem value="Bracelets">Bracelets</SelectItem>
              <SelectItem value="Anklets">Anklets</SelectItem>
            </SelectContent>
          </Select>

          {/* Stock Filter */}
          <Select
            value={filters.inStock === undefined ? 'all' : filters.inStock ? 'in-stock' : 'out-of-stock'}
            onValueChange={(value) => 
              handleFilterChange('inStock', value === 'all' ? undefined : value === 'in-stock')
            }
          >
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={`${filters.sortBy || 'name'}-${filters.sortOrder || 'asc'}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-')
              handleFilterChange('sortBy', sortBy as any)
              handleFilterChange('sortOrder', sortOrder as 'asc' | 'desc')
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low-High)</SelectItem>
              <SelectItem value="price-desc">Price (High-Low)</SelectItem>
              <SelectItem value="dateAdded-desc">Newest First</SelectItem>
              <SelectItem value="dateAdded-asc">Oldest First</SelectItem>
              <SelectItem value="stock-desc">Stock (High-Low)</SelectItem>
              <SelectItem value="stock-asc">Stock (Low-High)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Toggle */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {/* Price Range */}
            <div className="space-y-2">
              <Label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</Label>
              <Slider
                value={priceRange}
                onValueChange={(value) => {
                  setPriceRange(value as [number, number])
                  handleFilterChange('priceRange', value)
                }}
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>₹0</span>
                <span>₹10,000+</span>
              </div>
            </div>

            {/* Additional Filters can be added here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="new-products"
                  checked={false}
                  onCheckedChange={(checked) => {
                    // Add isNew filter logic here
                  }}
                />
                <Label htmlFor="new-products">New Products Only</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="sale-products"
                  checked={false}
                  onCheckedChange={(checked) => {
                    // Add isSale filter logic here
                  }}
                />
                <Label htmlFor="sale-products">Sale Products Only</Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Active Filters and Results */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">
              Showing {filteredCount} of {totalProducts} products
            </span>
            
            {/* Active Filter Badges */}
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {filters.category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('category', undefined)}
                />
              </Badge>
            )}
            
            {filters.inStock !== undefined && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.inStock ? 'In Stock' : 'Out of Stock'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFilterChange('inStock', undefined)}
                />
              </Badge>
            )}
            
            {filters.priceRange && (
              <Badge variant="secondary" className="flex items-center gap-1">
                ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    setPriceRange([0, 5000])
                    handleFilterChange('priceRange', undefined)
                  }}
                />
              </Badge>
            )}
            
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{filters.search}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    setSearchTerm('')
                    handleFilterChange('search', undefined)
                  }}
                />
              </Badge>
            )}
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
