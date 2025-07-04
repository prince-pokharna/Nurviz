"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Heart, ShoppingBag, Star, Plus, Minus, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  rating: number
  reviews: number
  isNew?: boolean
  isSale?: boolean
  description: string
  inStock: boolean
  sizes?: string[]
  colors?: string[]
}

interface ProductQuickViewProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
      color: selectedColor,
    })

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: `/products/${product.id}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`)
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard",
      })
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 h-full">
          {/* Images */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="h-full">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {product.isNew && (
                  <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">New</Badge>
                )}
                {product.isSale && <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">Sale</Badge>}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-luxury-500" : "border-white/50"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <p className="text-sm text-luxury-600 font-medium mb-2">{product.category}</p>
                <h2 className="text-2xl font-bold text-luxury-900 mb-4">{product.name}</h2>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "text-gold-500 fill-current" : "text-pearl-400"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-luxury-600">({product.reviews} reviews)</span>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl font-bold text-luxury-900">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-luxury-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <Badge className="bg-red-500 text-white">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </>
                  )}
                </div>

                <p className="text-luxury-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-luxury-700 mb-2">Color</label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-luxury-700 mb-2">Size</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-luxury-700 mb-2">Quantity</label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full luxury-gradient text-white hover:shadow-lg transition-all duration-300"
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-luxury-300 text-luxury-700 hover:bg-luxury-50"
                    onClick={() => toggleWishlist({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      image: product.images[0],
                      category: product.category,
                      isNew: product.isNew,
                      isSale: product.isSale,
                    })}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isWishlisted(product.id) ? "fill-current text-rose-500" : ""}`} />
                    {isWishlisted(product.id) ? "Wishlisted" : "Add to Wishlist"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-luxury-300 text-luxury-700 hover:bg-luxury-50"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-luxury-200">
                <div className="text-center">
                  <div className="text-sm font-medium text-luxury-900">Free Shipping</div>
                  <div className="text-xs text-luxury-600">On orders above ₹2000</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-luxury-900">Easy Returns</div>
                  <div className="text-xs text-luxury-600">7-day return policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductQuickView
