"use client"

import { useState } from 'react'
import { 
  Trash2, 
  Eye, 
  EyeOff, 
  Tag, 
  DollarSign, 
  Package, 
  Download,
  CheckSquare,
  Square
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Product } from '@/lib/product-manager'
import { useToast } from '@/hooks/use-toast'

interface BulkActionsProps {
  selectedProducts: string[]
  products: Product[]
  onBulkUpdate: (productIds: string[], updates: Partial<Product>) => Promise<void>
  onBulkDelete: (productIds: string[]) => Promise<void>
  onSelectAll: () => void
  onClearSelection: () => void
}

export default function BulkActions({
  selectedProducts,
  products,
  onBulkUpdate,
  onBulkDelete,
  onSelectAll,
  onClearSelection
}: BulkActionsProps) {
  const [priceUpdateType, setPriceUpdateType] = useState<'percentage' | 'fixed'>('percentage')
  const [priceUpdateValue, setPriceUpdateValue] = useState('')
  const [categoryUpdate, setCategoryUpdate] = useState('')
  const [stockUpdate, setStockUpdate] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const selectedProductsData = products.filter(p => selectedProducts.includes(p.id))
  const allSelected = products.length > 0 && selectedProducts.length === products.length

  const handleBulkPriceUpdate = async () => {
    if (!priceUpdateValue || selectedProducts.length === 0) return

    setIsUpdating(true)
    try {
      const value = parseFloat(priceUpdateValue)
      const updates: Partial<Product> = {}

      if (priceUpdateType === 'percentage') {
        // Will be handled per product in the backend
        updates.price = value // This will be interpreted as percentage
      } else {
        updates.price = value
      }

      await onBulkUpdate(selectedProducts, updates)
      toast({
        title: "Prices updated",
        description: `Updated ${selectedProducts.length} products`,
      })
      setPriceUpdateValue('')
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update prices",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBulkCategoryUpdate = async () => {
    if (!categoryUpdate || selectedProducts.length === 0) return

    setIsUpdating(true)
    try {
      await onBulkUpdate(selectedProducts, { category: categoryUpdate })
      toast({
        title: "Categories updated",
        description: `Updated ${selectedProducts.length} products`,
      })
      setCategoryUpdate('')
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update categories",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBulkStockUpdate = async () => {
    if (!stockUpdate || selectedProducts.length === 0) return

    setIsUpdating(true)
    try {
      const stock = parseInt(stockUpdate)
      await onBulkUpdate(selectedProducts, { 
        inventory: { stock, lowStockThreshold: 5 }
      })
      toast({
        title: "Stock updated",
        description: `Updated ${selectedProducts.length} products`,
      })
      setStockUpdate('')
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update stock",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBulkVisibilityUpdate = async (inStock: boolean) => {
    setIsUpdating(true)
    try {
      await onBulkUpdate(selectedProducts, { inStock })
      toast({
        title: "Visibility updated",
        description: `${inStock ? 'Shown' : 'Hidden'} ${selectedProducts.length} products`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update visibility",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const exportSelectedProducts = () => {
    const csvContent = [
      ['ID', 'Name', 'Price', 'Category', 'Stock', 'SKU'],
      ...selectedProductsData.map(product => [
        product.id,
        product.name,
        product.price.toString(),
        product.category,
        product.inventory.stock.toString(),
        product.sku
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export completed",
      description: `Exported ${selectedProducts.length} products`,
    })
  }

  if (selectedProducts.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={allSelected ? onClearSelection : onSelectAll}
              >
                {allSelected ? <Square className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
                {allSelected ? 'Deselect All' : 'Select All'}
              </Button>
              <span className="text-sm text-gray-600">
                No products selected
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Bulk Actions
          </CardTitle>
          <Badge variant="secondary">
            {selectedProducts.length} selected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            disabled={allSelected}
          >
            Select All ({products.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkVisibilityUpdate(false)}
            disabled={isUpdating}
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Hide Selected
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkVisibilityUpdate(true)}
            disabled={isUpdating}
          >
            <Eye className="h-4 w-4 mr-2" />
            Show Selected
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportSelectedProducts}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Products</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedProducts.length} selected products? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onBulkDelete(selectedProducts)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete {selectedProducts.length} Products
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Separator />

        {/* Advanced Bulk Operations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price Update */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <DollarSign className="h-4 w-4 mr-2" />
                Update Prices
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Price Update</DialogTitle>
                <DialogDescription>
                  Update prices for {selectedProducts.length} selected products
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <RadioGroup value={priceUpdateType} onValueChange={setPriceUpdateType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage">Percentage change</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed price</Label>
                  </div>
                </RadioGroup>
                <Input
                  type="number"
                  placeholder={priceUpdateType === 'percentage' ? 'Enter percentage (e.g., 10 for +10%)' : 'Enter new price'}
                  value={priceUpdateValue}
                  onChange={(e) => setPriceUpdateValue(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={handleBulkPriceUpdate}
                  disabled={!priceUpdateValue || isUpdating}
                >
                  Update Prices
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Category Update */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Tag className="h-4 w-4 mr-2" />
                Update Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Category Update</DialogTitle>
                <DialogDescription>
                  Update category for {selectedProducts.length} selected products
                </DialogDescription>
              </DialogHeader>
              <Select value={categoryUpdate} onValueChange={setCategoryUpdate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rings">Rings</SelectItem>
                  <SelectItem value="Necklaces">Necklaces</SelectItem>
                  <SelectItem value="Earrings">Earrings</SelectItem>
                  <SelectItem value="Bracelets">Bracelets</SelectItem>
                  <SelectItem value="Anklets">Anklets</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button
                  onClick={handleBulkCategoryUpdate}
                  disabled={!categoryUpdate || isUpdating}
                >
                  Update Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Stock Update */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Package className="h-4 w-4 mr-2" />
                Update Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Stock Update</DialogTitle>
                <DialogDescription>
                  Update stock quantity for {selectedProducts.length} selected products
                </DialogDescription>
              </DialogHeader>
              <Input
                type="number"
                placeholder="Enter stock quantity"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(e.target.value)}
              />
              <DialogFooter>
                <Button
                  onClick={handleBulkStockUpdate}
                  disabled={!stockUpdate || isUpdating}
                >
                  Update Stock
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Selected Products Preview */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Selected Products:</h4>
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {selectedProductsData.slice(0, 10).map((product) => (
              <Badge key={product.id} variant="secondary" className="text-xs">
                {product.name}
              </Badge>
            ))}
            {selectedProducts.length > 10 && (
              <Badge variant="secondary" className="text-xs">
                +{selectedProducts.length - 10} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
