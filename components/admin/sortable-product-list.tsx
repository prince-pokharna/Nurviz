"use client"

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { GripVertical, Eye, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Product } from '@/lib/product-manager'
import { useToast } from '@/hooks/use-toast'

interface SortableProductListProps {
  products: Product[]
  onReorder: (reorderedProducts: Product[]) => Promise<void>
  onUpdate: (id: string, updates: Partial<Product>) => Promise<void>
  onEdit: (product: Product) => void
  onDelete: (id: string) => Promise<void>
}

export default function SortableProductList({
  products,
  onReorder,
  onUpdate,
  onEdit,
  onDelete
}: SortableProductListProps) {
  const [items, setItems] = useState(products)
  const [isReordering, setIsReordering] = useState(false)
  const { toast } = useToast()

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destIndex = result.destination.index

    if (sourceIndex === destIndex) return

    // Create new array with reordered items
    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(sourceIndex, 1)
    newItems.splice(destIndex, 0, reorderedItem)

    // Update local state immediately for smooth UX
    setItems(newItems)

    try {
      setIsReordering(true)
      await onReorder(newItems)
      toast({
        title: "Products reordered",
        description: "Product order has been updated successfully",
      })
    } catch (error) {
      // Revert on error
      setItems(items)
      toast({
        title: "Reorder failed",
        description: "Failed to update product order",
        variant: "destructive",
      })
    } finally {
      setIsReordering(false)
    }
  }

  const getStockStatus = (product: Product) => {
    if (!product.inStock) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (product.inventory.stock <= product.inventory.lowStockThreshold) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="products">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-3 ${
              snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-2' : ''
            }`}
          >
            {items.map((product, index) => {
              const stockStatus = getStockStatus(product)
              
              return (
                <Draggable
                  key={product.id}
                  draggableId={product.id}
                  index={index}
                  isDragDisabled={isReordering}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-all duration-200 ${
                        snapshot.isDragging 
                          ? 'shadow-lg rotate-3 bg-white' 
                          : 'hover:shadow-md'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </div>

                          {/* Product Image */}
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/placeholder.jpg'
                              }}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 truncate">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-1">
                                  SKU: {product.sku} | {product.category}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg font-bold text-green-600">
                                    ₹{product.price}
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{product.originalPrice}
                                    </span>
                                  )}
                                  <Badge className={stockStatus.color}>
                                    {stockStatus.label}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600">
                                    Stock: {product.inventory.stock} units
                                  </span>
                                  {product.colors.length > 0 && (
                                    <span className="text-sm text-gray-600">
                                      Colors: {product.colors.length}
                                    </span>
                                  )}
                                  {product.sizes.length > 0 && (
                                    <span className="text-sm text-gray-600">
                                      Sizes: {product.sizes.length}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 ml-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">Visible</span>
                                  <Switch
                                    checked={product.inStock}
                                    onCheckedChange={(checked) => 
                                      onUpdate(product.id, { inStock: checked })
                                    }
                                    size="sm"
                                  />
                                </div>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onEdit(product)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onDelete(product.id)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Product Details */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                              Added: {new Date(product.dateAdded).toLocaleDateString()}
                            </span>
                            <span>
                              Updated: {new Date(product.lastUpdated).toLocaleDateString()}
                            </span>
                            {product.rating > 0 && (
                              <span>
                                Rating: {product.rating}/5 ({product.reviews} reviews)
                              </span>
                            )}
                          </div>
                          
                          {product.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {product.tags.split('|').slice(0, 5).map((tag, tagIndex) => (
                                <Badge
                                  key={tagIndex}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

// Note: This component requires react-beautiful-dnd
// Add to package.json: "react-beautiful-dnd": "^13.1.1"
// Add types: "@types/react-beautiful-dnd": "^13.1.8"
