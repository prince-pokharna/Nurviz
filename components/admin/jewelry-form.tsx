"use client"

import { useState, useEffect } from 'react'
import { Plus, X, Gem, Palette, Ruler, Package, DollarSign, Tag, FileText, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Product, ProductSize } from '@/lib/product-manager'
import DragDropUpload from './drag-drop-upload'
import { useToast } from '@/hooks/use-toast'

interface JewelryFormProps {
  product?: Product
  onSave: (productData: Partial<Product>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const JEWELRY_CATEGORIES = [
  'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Anklets'
]

const MATERIALS = [
  'Gold Plated', 'Silver Plated', 'Rose Gold Plated', 'Brass', 'Copper',
  'Stainless Steel', 'Alloy', '925 Silver', '14K Gold', '18K Gold'
]

const STONE_TYPES = [
  'Cubic Zirconia', 'Crystal', 'Pearl', 'Diamond', 'Ruby', 'Emerald',
  'Sapphire', 'Amethyst', 'Topaz', 'Garnet', 'Opal', 'Turquoise'
]

const RING_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12']
const NECKLACE_LENGTHS = ['14"', '16"', '18"', '20"', '22"', '24"', '26"', '28"']
const BRACELET_SIZES = ['6"', '6.5"', '7"', '7.5"', '8"', '8.5"', '9"']
const EARRING_TYPES = ['Stud', 'Drop', 'Hoop', 'Chandelier', 'Huggie']

export default function JewelryForm({ product, onSave, onCancel, isLoading = false }: JewelryFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    category: 'Rings',
    description: '',
    material: 'Gold Plated',
    colors: [],
    sizes: [],
    tags: '',
    careInstructions: 'Clean with jewelry cloth, store separately',
    brand: 'Nurvi Jewel',
    collection: '',
    inStock: true,
    isNew: false,
    isSale: false,
    inventory: {
      stock: 0,
      lowStockThreshold: 5,
      sizes: []
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    },
    ...product
  })

  const [currentColor, setCurrentColor] = useState('')
  const [currentSize, setCurrentSize] = useState('')
  const [currentTag, setCurrentTag] = useState('')
  const [stoneType, setStoneType] = useState('')
  const [priceType, setPriceType] = useState<'retail' | 'wholesale'>('retail')
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      setFormData({ ...product })
    }
  }, [product])

  const updateFormData = (field: keyof Product, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addColor = () => {
    if (!currentColor.trim()) return
    
    const colors = formData.colors || []
    if (!colors.includes(currentColor)) {
      updateFormData('colors', [...colors, currentColor])
    }
    setCurrentColor('')
  }

  const removeColor = (color: string) => {
    const colors = formData.colors || []
    updateFormData('colors', colors.filter(c => c !== color))
  }

  const addSize = () => {
    if (!currentSize.trim()) return
    
    const sizes = formData.sizes || []
    if (!sizes.includes(currentSize)) {
      updateFormData('sizes', [...sizes, currentSize])
      
      // Also add to inventory sizes
      const inventorySizes = formData.inventory?.sizes || []
      const newInventorySize: ProductSize = {
        name: currentSize,
        available: true,
        stock: 0
      }
      updateFormData('inventory', {
        ...formData.inventory,
        sizes: [...inventorySizes, newInventorySize]
      })
    }
    setCurrentSize('')
  }

  const removeSize = (size: string) => {
    const sizes = formData.sizes || []
    updateFormData('sizes', sizes.filter(s => s !== size))
    
    // Also remove from inventory sizes
    const inventorySizes = formData.inventory?.sizes || []
    updateFormData('inventory', {
      ...formData.inventory,
      sizes: inventorySizes.filter(s => s.name !== size)
    })
  }

  const updateSizeStock = (sizeName: string, stock: number) => {
    const inventorySizes = formData.inventory?.sizes || []
    const updatedSizes = inventorySizes.map(s => 
      s.name === sizeName ? { ...s, stock } : s
    )
    updateFormData('inventory', {
      ...formData.inventory,
      sizes: updatedSizes
    })
  }

  const addTag = () => {
    if (!currentTag.trim()) return
    
    const tags = formData.tags ? formData.tags.split('|') : []
    if (!tags.includes(currentTag)) {
      updateFormData('tags', [...tags, currentTag].join('|'))
    }
    setCurrentTag('')
  }

  const removeTag = (tag: string) => {
    const tags = formData.tags ? formData.tags.split('|') : []
    updateFormData('tags', tags.filter(t => t !== tag).join('|'))
  }

  const getSizeOptions = () => {
    switch (formData.category) {
      case 'Rings':
        return RING_SIZES
      case 'Necklaces':
        return NECKLACE_LENGTHS
      case 'Bracelets':
      case 'Anklets':
        return BRACELET_SIZES
      case 'Earrings':
        return EARRING_TYPES
      default:
        return []
    }
  }

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.price || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Valid price is required",
        variant: "destructive",
      })
      return
    }

    // Generate SKU if not provided
    if (!formData.sku) {
      const category = formData.category?.substring(0, 3).toUpperCase() || 'PRD'
      const timestamp = Date.now().toString().slice(-6)
      formData.sku = `${category}-${timestamp}`
    }

    // Auto-generate SEO fields if not provided
    if (!formData.seo?.metaTitle) {
      formData.seo = {
        ...formData.seo,
        metaTitle: `${formData.name} - ${formData.category} | Nurvi Jewel`,
        metaDescription: formData.description?.substring(0, 160) || `Beautiful ${formData.category?.toLowerCase()} from Nurvi Jewel collection`,
        keywords: [
          formData.name?.toLowerCase(),
          formData.category?.toLowerCase(),
          formData.material?.toLowerCase(),
          'jewelry',
          'artificial jewelry',
          'fashion jewelry'
        ].filter(Boolean).join(', ')
      }
    }

    await onSave(formData)
  }

  const handleImageUpload = (urls: string[]) => {
    const currentImages = formData.images || []
    const newImages = [...currentImages, ...urls]
    updateFormData('images', newImages)
    
    // Set first image as main image if not set
    if (!formData.image && newImages.length > 0) {
      updateFormData('image', newImages[0])
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku || ''}
                    onChange={(e) => updateFormData('sku', e.target.value)}
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(value) => updateFormData('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {JEWELRY_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collection">Collection</Label>
                  <Input
                    id="collection"
                    value={formData.collection || ''}
                    onChange={(e) => updateFormData('collection', e.target.value)}
                    placeholder="e.g., Summer Collection 2024"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe the product..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={formData.inStock || false}
                    onCheckedChange={(checked) => updateFormData('inStock', checked)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isNew"
                    checked={formData.isNew || false}
                    onCheckedChange={(checked) => updateFormData('isNew', checked)}
                  />
                  <Label htmlFor="isNew">New Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isSale"
                    checked={formData.isSale || false}
                    onCheckedChange={(checked) => updateFormData('isSale', checked)}
                  />
                  <Label htmlFor="isSale">On Sale</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jewelry Details */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={priceType} onValueChange={setPriceType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="retail" id="retail" />
                    <Label htmlFor="retail">Retail Price</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wholesale" id="wholesale" />
                    <Label htmlFor="wholesale">Wholesale Price</Label>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="price">Current Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => updateFormData('price', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => updateFormData('originalPrice', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Material & Stones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  Material & Stones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material *</Label>
                  <Select
                    value={formData.material || ''}
                    onValueChange={(value) => updateFormData('material', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIALS.map((material) => (
                        <SelectItem key={material} value={material}>
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stoneType">Stone Type</Label>
                  <Select value={stoneType} onValueChange={setStoneType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stone type" />
                    </SelectTrigger>
                    <SelectContent>
                      {STONE_TYPES.map((stone) => (
                        <SelectItem key={stone} value={stone}>
                          {stone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (grams)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight || ''}
                    onChange={(e) => updateFormData('weight', parseFloat(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    placeholder="Enter color name"
                    onKeyPress={(e) => e.key === 'Enter' && addColor()}
                  />
                  <Button onClick={addColor} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.colors || []).map((color, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {color}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeColor(color)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sizes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Sizes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select value={currentSize} onValueChange={setCurrentSize}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSizeOptions().map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addSize} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.sizes || []).map((size, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {size}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSize(size)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Enter tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(formData.tags ? formData.tags.split('|') : []).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Care Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Care Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.careInstructions || ''}
                onChange={(e) => updateFormData('careInstructions', e.target.value)}
                placeholder="Care instructions for the jewelry..."
                rows={3}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropUpload
                onUploadComplete={handleImageUpload}
                existingImages={formData.images || []}
                maxFiles={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Total Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.inventory?.stock || ''}
                    onChange={(e) => updateFormData('inventory', {
                      ...formData.inventory,
                      stock: parseInt(e.target.value)
                    })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={formData.inventory?.lowStockThreshold || ''}
                    onChange={(e) => updateFormData('inventory', {
                      ...formData.inventory,
                      lowStockThreshold: parseInt(e.target.value)
                    })}
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Size-specific inventory */}
              {(formData.inventory?.sizes || []).length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <h4 className="font-medium">Stock by Size</h4>
                  <div className="space-y-2">
                    {(formData.inventory?.sizes || []).map((sizeData, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        <Badge variant="outline">{sizeData.name}</Badge>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Stock:</Label>
                          <Input
                            type="number"
                            value={sizeData.stock}
                            onChange={(e) => updateSizeStock(sizeData.name, parseInt(e.target.value))}
                            className="w-20"
                          />
                        </div>
                        <Switch
                          checked={sizeData.available}
                          onCheckedChange={(checked) => {
                            const inventorySizes = formData.inventory?.sizes || []
                            const updatedSizes = inventorySizes.map(s => 
                              s.name === sizeData.name ? { ...s, available: checked } : s
                            )
                            updateFormData('inventory', {
                              ...formData.inventory,
                              sizes: updatedSizes
                            })
                          }}
                        />
                        <Label className="text-sm">Available</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.seo?.metaTitle || ''}
                  onChange={(e) => updateFormData('seo', {
                    ...formData.seo,
                    metaTitle: e.target.value
                  })}
                  placeholder="SEO title for search engines"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.seo?.metaDescription || ''}
                  onChange={(e) => updateFormData('seo', {
                    ...formData.seo,
                    metaDescription: e.target.value
                  })}
                  placeholder="SEO description for search engines"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.seo?.keywords || ''}
                  onChange={(e) => updateFormData('seo', {
                    ...formData.seo,
                    keywords: e.target.value
                  })}
                  placeholder="SEO keywords separated by commas"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
