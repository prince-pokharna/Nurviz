"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Shield, Package, Edit, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAdmin } from "@/contexts/admin-context"
import { useToast } from "@/hooks/use-toast"
import SimpleJewelryEditor from "@/components/admin/simple-jewelry-editor"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { login, isAuthenticated, logout } = useAdmin()
  const { toast } = useToast()
  const router = useRouter()

  // Load products when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
    }
  }, [isAuthenticated])

  const loadProducts = async () => {
    try {
      setLoadingProducts(true)
      const response = await fetch('/api/inventory')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.all || [])
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleAddNewJewelry = () => {
    const newProduct = {
      id: `new-${Date.now()}`,
      name: '',
      price: 0,
      originalPrice: 0,
      image: '',
      images: [],
      category: 'Rings',
      description: '',
      material: 'Gold Plated Brass',
      weight: 0,
      inStock: true,
      isNew: true,
      isSale: false,
      rating: 0,
      sku: '',
      inventory: {
        stock: 10,
        minimumStock: 5
      }
    };
    setSelectedProduct(newProduct);
    setIsCreating(true);
    setShowEditor(true);
  };

  const handleSaveProduct = (updatedProduct: any) => {
    if (isCreating) {
      // Add new product
      setProducts(prev => [...prev, updatedProduct]);
      toast({
        title: "✅ Added",
        description: `${updatedProduct.name} has been added successfully!`,
      });
    } else {
      // Update existing product
      setProducts(prev => 
        prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      toast({
        title: "✅ Updated",
        description: `${updatedProduct.name} has been updated successfully!`,
      });
    }
    setIsCreating(false);
  };

  // Show jewelry dashboard if authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">💎 Nurvi Jewel Admin</h1>
                <Badge className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white">
                  {products.length} Jewelry Items
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleAddNewJewelry}
                  className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Jewelry
                </Button>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">💎</span>
                <span>Jewelry Inventory - Click Any Item to Edit</span>
              </CardTitle>
              <CardDescription>
                All your jewelry stock categorized as customers see them. Click any jewelry to edit details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingProducts ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B4AFA7] mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading jewelry collection...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jewelry found</h3>
                  <p className="text-gray-500 mb-4">Start by adding your first jewelry piece</p>
                                      <Button
                      onClick={handleAddNewJewelry}
                      className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Jewelry
                    </Button>
                </div>
              ) : (
                <div>
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Total Jewelry</p>
                          <p className="text-xl font-bold text-blue-900">{products.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="text-sm text-green-600 font-medium">In Stock</p>
                          <p className="text-xl font-bold text-green-900">{products.filter(p => p.inStock).length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="h-6 w-6 text-orange-600" />
                        <div>
                          <p className="text-sm text-orange-600 font-medium">Low Stock</p>
                          <p className="text-xl font-bold text-orange-900">{products.filter(p => (p.inventory?.stock || 0) <= 5).length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="h-6 w-6 text-red-600" />
                        <div>
                          <p className="text-sm text-red-600 font-medium">Categories</p>
                          <p className="text-xl font-bold text-red-900">{[...new Set(products.map(p => p.category))].length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                                      {/* Category Breakdown */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Jewelry by Category - Click to Add New</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map(category => {
                          const categoryProducts = products.filter(p => p.category === category)
                          const categoryIcons = {
                            'Rings': '💍',
                            'Necklaces': '📿', 
                            'Earrings': '👂',
                            'Bracelets': '🔗'
                          }
                          return (
                            <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="text-center space-y-2">
                                  <div className="text-2xl">{categoryIcons[category as keyof typeof categoryIcons]}</div>
                                  <p className="text-sm text-gray-600">{category}</p>
                                  <p className="text-2xl font-bold text-gray-900">{categoryProducts.length}</p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const newProduct = {
                                        id: `new-${Date.now()}`,
                                        name: '',
                                        price: 0,
                                        originalPrice: 0,
                                        image: '',
                                        images: [],
                                        category: category,
                                        description: '',
                                        material: 'Gold Plated Brass',
                                        weight: 0,
                                        inStock: true,
                                        isNew: true,
                                        isSale: false,
                                        rating: 0,
                                        sku: '',
                                        inventory: {
                                          stock: 10,
                                          minimumStock: 5
                                        }
                                      };
                                      setSelectedProduct(newProduct);
                                      setIsCreating(true);
                                      setShowEditor(true);
                                    }}
                                    className="w-full"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add {category.slice(0, -1)}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>

                  {/* Jewelry Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border-2 hover:border-[#B4AFA7]/30 cursor-pointer group">
                        <div className="aspect-square bg-gray-100 relative">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            {product.inStock ? (
                              <Badge className="bg-green-100 text-green-800 text-xs">In Stock</Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                            )}
                          </div>
                          
                          {/* Edit Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowEditor(true);
                              }}
                              className="bg-white text-gray-900 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </Button>
                          </div>

                          {/* Special Badges */}
                          <div className="absolute top-2 left-2 flex flex-col space-y-1">
                            {product.isNew && (
                              <Badge className="bg-blue-500 text-white text-xs">NEW</Badge>
                            )}
                            {product.isSale && (
                              <Badge className="bg-red-500 text-white text-xs">SALE</Badge>
                            )}
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-gray-900">
                                  ₹{product.price?.toLocaleString()}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ₹{product.originalPrice?.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {product.rating && product.rating > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm">{product.rating}</span>
                                </div>
                              )}
                            </div>

                            <div className="text-sm text-gray-600">
                              Stock: {product.inventory?.stock || 0} units
                            </div>

                            <Button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowEditor(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit Jewelry
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Jewelry Editor */}
        <SimpleJewelryEditor
          product={selectedProduct}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setIsCreating(false);
          }}
          onSave={handleSaveProduct}
          isCreating={isCreating}
        />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('🔐 Attempting admin login:', { email, passwordLength: password.length })
      
      await login(email, password)
      
      console.log('✅ Admin login successful')
      toast({
        title: "Login Successful",
        description: "Welcome to Nurvi Jewel Admin Panel",
      })
      // Don't manually redirect - let useEffect handle it
    } catch (error) {
      console.error('❌ Login error:', error)
      
      let errorMessage = "Invalid email or password"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#B4AFA7] via-[#9E8E80] to-[#8A8786] p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#B4AFA7] to-[#8A8786] rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
            <CardDescription className="text-gray-600">Access Nurvi Jewel Admin Panel</CardDescription>
            
            {/* Development credentials helper */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">🔐 Admin Credentials</p>
              <p className="text-xs text-blue-600 mb-1"><strong>Email:</strong> owner@nurvijewel.com</p>
              <p className="text-xs text-blue-600"><strong>Password:</strong> nurvi2024secure</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@nurvijewel.com"
                required
                className="border-gray-300 focus:border-[#9E8E80] focus:ring-[#9E8E80]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="border-gray-300 focus:border-[#9E8E80] focus:ring-[#9E8E80] pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] hover:from-[#9E8E80] hover:to-[#8A8786] text-white font-medium py-2.5 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">🔐 Secure Admin Access</p>
            <p className="text-xs text-blue-600">Only authorized personnel can access this panel.</p>
            <p className="text-xs text-blue-600">Contact the owner for login credentials.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
