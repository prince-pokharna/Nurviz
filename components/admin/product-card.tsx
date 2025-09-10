"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { 
  Edit3, 
  Save, 
  X, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Upload,
  Star,
  Package,
  AlertTriangle,
  DollarSign,
  Tag,
  Palette,
  Ruler,
  ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Product } from '@/lib/product-manager'
import { useToast } from '@/hooks/use-toast'

interface ProductCardProps {
  product: Product
  onUpdate: (id: string, updates: Partial<Product>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onDuplicate: (id: string) => Promise<void>
  isSelected?: boolean
  onSelect?: (id: string, selected: boolean) => void
}

export default function ProductCard({ 
  product, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  isSelected = false,
  onSelect 
}: ProductCardProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, any>>({})
  const [isUpdating, setIsUpdating] = useState(false)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const startEditing = (field: string, currentValue: any) => {
    setIsEditing(field)
    setEditValues({ [field]: currentValue })
  }

  const cancelEditing = () => {
    setIsEditing(null)
    setEditValues({})
  }

  const saveField = async (field: string) => {
    if (!editValues[field] && editValues[field] !== 0 && editValues[field] !== false) {
      cancelEditing()
      return
    }

    setIsUpdating(true)
    try {
      await onUpdate(product.id, { [field]: editValues[field] })
      setIsEditing(null)
      setEditValues({})
      toast({
        title: "Updated successfully",
        description: `${field} has been updated`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // In a real implementation, you would upload to a file storage service
    // For now, we'll just show a placeholder
    toast({
      title: "Image upload",
      description: "Image upload functionality would be implemented here",
    })
  }

  const getStockStatus = () => {
    if (!product.inStock) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (product.inventory.stock <= product.inventory.lowStockThreshold) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' }
  }

  const stockStatus = getStockStatus()

  return (
    <TooltipProvider>
      <Card className={`relative group hover:shadow-lg transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        {/* Selection checkbox */}
        {onSelect && (
          <div className="absolute top-3 left-3 z-10">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(product.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={imageError ? '/placeholder.jpg' : product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
            
            {/* Image upload overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/90 hover:bg-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Change Image
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Status badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge className="bg-blue-500 text-white text-xs">NEW</Badge>
              )}
              {product.isSale && (
                <Badge className="bg-red-500 text-white text-xs">SALE</Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Product Name */}
          <div className="space-y-1">
            {isEditing === 'name' ? (
              <div className="flex gap-2">
                <Input
                  value={editValues.name || ''}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                  className="flex-1"
                  placeholder="Product name"
                />
                <Button
                  size="sm"
                  onClick={() => saveField('name')}
                  disabled={isUpdating}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelEditing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/field">
                <h3 
                  className="font-semibold text-lg cursor-pointer hover:text-blue-600 flex-1"
                  onClick={() => startEditing('name', product.name)}
                >
                  {product.name}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover/field:opacity-100 transition-opacity"
                  onClick={() => startEditing('name', product.name)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            {isEditing === 'price' ? (
              <div className="flex gap-2 flex-1">
                <Input
                  type="number"
                  value={editValues.price || ''}
                  onChange={(e) => setEditValues({ ...editValues, price: parseFloat(e.target.value) })}
                  className="flex-1"
                  placeholder="Price"
                />
                <Button
                  size="sm"
                  onClick={() => saveField('price')}
                  disabled={isUpdating}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelEditing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 group/field">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => startEditing('price', product.price)}>
                  <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover/field:opacity-100 transition-opacity"
                  onClick={() => startEditing('price', product.price)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
              <span className="text-sm text-gray-600">({product.inventory.stock} units)</span>
            </div>
            <Switch
              checked={product.inStock}
              onCheckedChange={(checked) => onUpdate(product.id, { inStock: checked })}
            />
          </div>

          {/* Category and Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <Badge variant="outline">{product.category}</Badge>
            </div>
            {product.tags && (
              <div className="flex flex-wrap gap-1">
                {product.tags.split('|').slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Colors and Sizes */}
          {(product.colors.length > 0 || product.sizes.length > 0) && (
            <div className="flex items-center gap-4">
              {product.colors.length > 0 && (
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-gray-500" />
                  <div className="flex gap-1">
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {product.sizes.length > 0 && (
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews} review{product.reviews !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          {/* Low stock warning */}
          {product.inventory.stock <= product.inventory.lowStockThreshold && product.inStock && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">Low stock warning</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicate(product.id)}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate product</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdate(product.id, { inStock: !product.inStock })}
                  className="flex-1"
                >
                  {product.inStock ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {product.inStock ? 'Hide product' : 'Show product'}
              </TooltipContent>
            </Tooltip>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{product.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(product.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
