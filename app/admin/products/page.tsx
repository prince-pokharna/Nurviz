"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Grid3X3, List, RefreshCw, AlertTriangle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAdmin } from '@/contexts/admin-context'
import { useToast } from '@/hooks/use-toast'
import { ADMIN_PERMISSIONS } from '@/lib/admin-config'
import { Product, ProductFilters } from '@/lib/product-manager'
import ProductCard from '@/components/admin/product-card'
import BulkActions from '@/components/admin/bulk-actions'
import ProductFiltersComponent from '@/components/admin/product-filters'

export default function AdminProductsPage() {
  const { isAuthenticated, hasPermission } = useAdmin()
  const { toast } = useToast()
  const router = useRouter()
  
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: 'name',
    sortOrder: 'asc'
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  // Load products
  useEffect(() => {
    loadProducts()
  }, [])

  // Apply filters when they change
  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/products', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        toast({
          title: "Error loading products",
          description: "Failed to load products",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error loading products",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(p => 
        p.category.toLowerCase() === filters.category!.toLowerCase()
      )
    }

    // Apply stock filter
    if (filters.inStock !== undefined) {
      filtered = filtered.filter(p => p.inStock === filters.inStock)
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      filtered = filtered.filter(p => p.price >= min && p.price <= max)
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.toLowerCase().includes(searchTerm) ||
        p.sku.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aVal: any, bVal: any

        switch (filters.sortBy) {
          case 'name':
            aVal = a.name.toLowerCase()
            bVal = b.name.toLowerCase()
            break
          case 'price':
            aVal = a.price
            bVal = b.price
            break
          case 'dateAdded':
            aVal = new Date(a.dateAdded).getTime()
            bVal = new Date(b.dateAdded).getTime()
            break
          case 'stock':
            aVal = a.inventory.stock
            bVal = b.inventory.stock
            break
          default:
            return 0
        }

        if (aVal < bVal) return filters.sortOrder === 'desc' ? 1 : -1
        if (aVal > bVal) return filters.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }

    setFilteredProducts(filtered)
  }

  const handleProductUpdate = async (id: string, updates: Partial<Product>) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(prev => prev.map(p => p.id === id ? data.product : p))
        toast({
          title: "Product updated",
          description: "Product has been updated successfully",
        })
      } else {
        throw new Error('Update failed')
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const handleProductDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id))
        setSelectedProducts(prev => prev.filter(pid => pid !== id))
        toast({
          title: "Product deleted",
          description: "Product has been deleted successfully",
        })
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleProductDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}/duplicate`, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(prev => [...prev, data.product])
        toast({
          title: "Product duplicated",
          description: "Product has been duplicated successfully",
        })
      } else {
        throw new Error('Duplicate failed')
      }
    } catch (error) {
      toast({
        title: "Duplicate failed",
        description: "Failed to duplicate product",
        variant: "destructive",
      })
    }
  }

  const handleBulkUpdate = async (productIds: string[], updates: Partial<Product>) => {
    try {
      const response = await fetch('/api/admin/products/bulk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productIds,
          updates,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(prev => prev.map(p => {
          const updated = data.products.find((up: Product) => up.id === p.id)
          return updated || p
        }))
        setSelectedProducts([])
        toast({
          title: "Bulk update completed",
          description: `Updated ${productIds.length} products`,
        })
      } else {
        throw new Error('Bulk update failed')
      }
    } catch (error) {
      toast({
        title: "Bulk update failed",
        description: "Failed to update products",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = async (productIds: string[]) => {
    try {
      const response = await fetch('/api/admin/products/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productIds }),
      })

      if (response.ok) {
        setProducts(prev => prev.filter(p => !productIds.includes(p.id)))
        setSelectedProducts([])
        toast({
          title: "Bulk delete completed",
          description: `Deleted ${productIds.length} products`,
        })
      } else {
        throw new Error('Bulk delete failed')
      }
    } catch (error) {
      toast({
        title: "Bulk delete failed",
        description: "Failed to delete products",
        variant: "destructive",
      })
    }
  }

  const handleSelectProduct = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts(prev => [...prev, id])
    } else {
      setSelectedProducts(prev => prev.filter(pid => pid !== id))
    }
  }

  const handleSelectAll = () => {
    setSelectedProducts(filteredProducts.map(p => p.id))
  }

  const handleClearSelection = () => {
    setSelectedProducts([])
  }

  if (!isAuthenticated) {
    return null
  }

  if (!hasPermission(ADMIN_PERMISSIONS.VIEW_PRODUCTS)) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to view products.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const lowStockProducts = products.filter(p => 
    p.inventory.stock <= p.inventory.lowStockThreshold && p.inStock
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              <Badge className="bg-blue-100 text-blue-800">
                {products.length} Products
              </Badge>
              {lowStockProducts.length > 0 && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  {lowStockProducts.length} Low Stock
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={loadProducts}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
              {hasPermission(ADMIN_PERMISSIONS.EDIT_PRODUCTS) && (
                <Button className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low on stock.
              <Button variant="link" className="p-0 ml-2 text-yellow-800 underline">
                View low stock products
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <ProductFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          totalProducts={products.length}
          filteredCount={filteredProducts.length}
        />

        {/* Bulk Actions */}
        {hasPermission(ADMIN_PERMISSIONS.EDIT_PRODUCTS) && (
          <BulkActions
            selectedProducts={selectedProducts}
            products={filteredProducts}
            onBulkUpdate={handleBulkUpdate}
            onBulkDelete={handleBulkDelete}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
          />
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="aspect-square bg-gray-200 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p>Try adjusting your filters or add some products to get started.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onUpdate={handleProductUpdate}
                onDelete={handleProductDelete}
                onDuplicate={handleProductDuplicate}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={hasPermission(ADMIN_PERMISSIONS.EDIT_PRODUCTS) ? handleSelectProduct : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
