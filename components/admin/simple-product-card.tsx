"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Edit3, Save, X, Package, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SimpleProduct } from '@/lib/simple-inventory'
import { useToast } from '@/hooks/use-toast'

interface SimpleProductCardProps {
  product: SimpleProduct
  onUpdate: (id: string, updates: Partial<SimpleProduct>) => Promise<void>
}

export default function SimpleProductCard({ product, onUpdate }: SimpleProductCardProps) {
  const [isEditingStock, setIsEditingStock] = useState(false)
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [stockValue, setStockValue] = useState(product.stock.toString())
  const [priceValue, setPriceValue] = useState(product.price.toString())
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    }
    if (product.stock <= product.lowStockAlert) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
    }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: CheckCircle }
  }

  const stockStatus = getStockStatus()

  const handleStockUpdate = async () => {
    const newStock = parseInt(stockValue)
    if (isNaN(newStock) || newStock < 0) {
      toast({
        title: "Invalid Stock",
        description: "Please enter a valid stock number",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      await onUpdate(product.id, { stock: newStock })
      setIsEditingStock(false)
      toast({
        title: "Stock Updated",
        description: `Stock updated to ${newStock} units`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update stock",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePriceUpdate = async () => {
    const newPrice = parseFloat(priceValue)
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      await onUpdate(product.id, { price: newPrice })
      setIsEditingPrice(false)
      toast({
        title: "Price Updated",
        description: `Price updated to ₹${newPrice}`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update price",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const cancelStockEdit = () => {
    setStockValue(product.stock.toString())
    setIsEditingStock(false)
  }

  const cancelPriceEdit = () => {
    setPriceValue(product.price.toString())
    setIsEditingPrice(false)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder.jpg'
            }}
          />
          
          {/* Stock Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={stockStatus.color}>
              <stockStatus.icon className="w-3 h-3 mr-1" />
              {stockStatus.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Product Name */}
        <div>
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
          {product.sku && (
            <p className="text-xs text-gray-400">SKU: {product.sku}</p>
          )}
        </div>

        {/* Price - Click to Edit */}
        <div className="space-y-2">
          {isEditingPrice ? (
            <div className="flex gap-2">
              <Input
                type="number"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                className="flex-1"
                placeholder="Price"
                disabled={isUpdating}
              />
              <Button
                size="sm"
                onClick={handlePriceUpdate}
                disabled={isUpdating}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={cancelPriceEdit}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div 
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => setIsEditingPrice(true)}
            >
              <span className="text-xl font-bold text-green-600">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
              <Edit3 className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>

        {/* Stock - Click to Edit */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Stock Level</span>
          </div>
          
          {isEditingStock ? (
            <div className="flex gap-2">
              <Input
                type="number"
                value={stockValue}
                onChange={(e) => setStockValue(e.target.value)}
                className="flex-1"
                placeholder="Stock quantity"
                disabled={isUpdating}
              />
              <Button
                size="sm"
                onClick={handleStockUpdate}
                disabled={isUpdating}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={cancelStockEdit}
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => setIsEditingStock(true)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{product.stock}</span>
                <span className="text-sm text-gray-600">units</span>
              </div>
              <Edit3 className="h-4 w-4 text-gray-400" />
            </div>
          )}
          
          {product.stock <= product.lowStockAlert && product.stock > 0 && (
            <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
              ⚠️ Low stock - Consider restocking
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              ❌ Out of stock - Update inventory
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          <p>Last updated: {new Date(product.lastUpdated).toLocaleDateString()}</p>
          {product.material && <p>Material: {product.material}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
