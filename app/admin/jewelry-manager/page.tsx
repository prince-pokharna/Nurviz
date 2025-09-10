"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Package,
  Star,
  ShoppingBag,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdmin } from "@/contexts/admin-context"
import { useToast } from "@/hooks/use-toast"
import SimpleJewelryEditor from "@/components/admin/simple-jewelry-editor"

// Product data type definition
interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  material?: string;
  weight?: number;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  rating?: number;
  reviews?: number;
  sku?: string;
  inventory?: {
    stock: number;
    minimumStock: number;
  };
}

const JEWELRY_CATEGORIES = [
  { value: "Rings", label: "Rings", icon: "💍" },
  { value: "Necklaces", label: "Necklaces", icon: "📿" },
  { value: "Earrings", label: "Earrings", icon: "👂" },
  { value: "Bracelets", label: "Bracelets", icon: "🔗" },
  { value: "Anklets", label: "Anklets", icon: "🦶" },
  { value: "Sets", label: "Jewelry Sets", icon: "💎" },
  { value: "Accessories", label: "Accessories", icon: "✨" }
];

export default function JewelryManagerPage() {
  const { admin, isAuthenticated } = useAdmin()
  const { toast } = useToast()
  const router = useRouter()
  
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Rings")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
    loadProducts()
  }, [isAuthenticated, router])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/inventory', {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      setProducts(data.all || [])
    } catch (error) {
      console.error('Error loading products:', error)
      toast({
        title: "Error",
        description: "Failed to load jewelry products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = (category?: string) => {
    setSelectedProduct(null)
    setIsCreating(true)
    setSelectedCategory(category || "Rings")
    setShowEditor(true)
  }

  const handleEditProduct = (product: ProductData) => {
    setSelectedProduct(product)
    setIsCreating(false)
    setShowEditor(true)
  }

  const handleSaveProduct = async (productData: ProductData) => {
    try {
      setSaving(true)
      
      // If creating, set the category from selected category
      if (isCreating) {
        productData.category = selectedCategory
      }
      
      const response = await fetch('/api/admin/simple-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: isCreating ? 'add_product' : 'update_product',
          product: productData
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save product')
      }

      const result = await response.json()
      
      toast({
        title: "✅ Success",
        description: `${productData.name} ${isCreating ? 'added to' : 'updated in'} ${productData.category} successfully!`,
      })
      
      setShowEditor(false)
      setSelectedProduct(null)
      await loadProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (product: ProductData) => {
    if (!confirm(`Are you sure you want to delete "${product.name}" from ${product.category}?`)) {
      return
    }

    try {
      // For now, we'll show a message that delete functionality needs to be implemented
      toast({
        title: "⚠️ Feature Coming Soon",
        description: "Delete functionality will be implemented in the next update. Use the main admin panel for now.",
        variant: "destructive",
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "❌ Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "inStock" && product.inStock) ||
                         (statusFilter === "outOfStock" && !product.inStock) ||
                         (statusFilter === "lowStock" && (product.inventory?.stock || 0) <= (product.inventory?.minimumStock || 5)) ||
                         (statusFilter === "new" && product.isNew) ||
                         (statusFilter === "sale" && product.isSale)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Group products by category
  const productsByCategory = JEWELRY_CATEGORIES.reduce((acc, category) => {
    acc[category.value] = products.filter(p => p.category === category.value)
    return acc
  }, {} as Record<string, ProductData[]>)

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    lowStock: products.filter(p => (p.inventory?.stock || 0) <= (p.inventory?.minimumStock || 5)).length,
    outOfStock: products.filter(p => !p.inStock).length,
  }

  const getStatusBadge = (product: ProductData) => {
    if (!product.inStock) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if ((product.inventory?.stock || 0) <= (product.inventory?.minimumStock || 5)) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Low Stock</Badge>
    }
    return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">💎 Jewelry Manager</h1>
              <Badge className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white">
                {products.length} Total Items
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => handleCreateProduct()}
                className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Jewelry
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jewelry</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
                </div>
                <div className="p-3 rounded-full bg-orange-50">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
                <div className="p-3 rounded-full bg-red-50">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="all">All Jewelry</TabsTrigger>
            {JEWELRY_CATEGORIES.map(category => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.icon} {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Jewelry Tab */}
          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>All Jewelry Collection</CardTitle>
                    <CardDescription>Manage all your jewelry inventory in one place</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search jewelry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {JEWELRY_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="inStock">In Stock</SelectItem>
                      <SelectItem value="lowStock">Low Stock</SelectItem>
                      <SelectItem value="outOfStock">Out of Stock</SelectItem>
                      <SelectItem value="new">New Arrivals</SelectItem>
                      <SelectItem value="sale">On Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Products Table */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B4AFA7] mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading jewelry collection...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jewelry found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || categoryFilter !== "all" || statusFilter !== "all" 
                        ? "Try adjusting your filters" 
                        : "Start by adding your first jewelry piece"
                      }
                    </p>
                    <Button
                      onClick={() => handleCreateProduct()}
                      className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Jewelry
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Jewelry</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                  {product.image && (
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">₹{product.price.toLocaleString()}</div>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <div className="text-sm text-gray-500 line-through">
                                    ₹{product.originalPrice.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{product.inventory?.stock || 0} units</div>
                                <div className="text-gray-500">Min: {product.inventory?.minimumStock || 0}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(product)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm">{product.rating || 0}</span>
                                <span className="text-sm text-gray-500">({product.reviews || 0})</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditProduct(product)}
                                  title="Edit jewelry details"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(product)}
                                  className="text-red-600 hover:text-red-700"
                                  title="Delete jewelry"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category-specific tabs */}
          {JEWELRY_CATEGORIES.map(category => (
            <TabsContent key={category.value} value={category.value} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span className="text-2xl">{category.icon}</span>
                        <span>{category.label} Collection</span>
                      </CardTitle>
                      <CardDescription>
                        Manage your {category.label.toLowerCase()} inventory
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleCreateProduct(category.value)}
                      className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add {category.label.slice(0, -1)}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {productsByCategory[category.value]?.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="text-6xl mb-4 block">{category.icon}</span>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {category.label.toLowerCase()} yet
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Start building your {category.label.toLowerCase()} collection
                      </p>
                      <Button
                        onClick={() => handleCreateProduct(category.value)}
                        className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First {category.label.slice(0, -1)}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {productsByCategory[category.value]?.map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-square bg-gray-100 relative">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              {getStatusBadge(product)}
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-lg font-bold text-gray-900">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-sm text-gray-500 line-through ml-2">
                                      ₹{product.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm">{product.rating || 0}</span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600">
                                Stock: {product.inventory?.stock || 0} units
                              </div>
                              <div className="flex space-x-2 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                  className="flex-1"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Product Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle>
              {isCreating ? `Add New ${selectedCategory.slice(0, -1)}` : `Edit ${selectedProduct?.name}`}
            </DialogTitle>
            <DialogDescription>
              {isCreating 
                ? `Create a new ${selectedCategory.toLowerCase().slice(0, -1)} with all details and images`
                : 'Update jewelry information, pricing, and inventory details'
              }
            </DialogDescription>
          </DialogHeader>
          <SimpleJewelryEditor
            product={selectedProduct}
            isOpen={showEditor}
            onClose={() => setShowEditor(false)}
            onSave={handleSaveProduct}
            isCreating={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
