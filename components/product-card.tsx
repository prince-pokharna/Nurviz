"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { motion } from "framer-motion"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating?: number
  reviews?: number
  isNew?: boolean
  isSale?: boolean
}

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
  onQuickView?: () => void
}

export default function ProductCard({ product, viewMode = "grid", onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      isNew: product.isNew,
      isSale: product.isSale,
    })
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onQuickView) {
      onQuickView()
    }
  }

  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.id}`} className="block">
        <div className="premium-card p-6 rounded-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex space-x-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
              {product.isNew && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                  New
                </Badge>
              )}
              {product.isSale && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white">
                  Sale
                </Badge>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm text-luxury-600 font-medium">{product.category}</p>
                <h3 className="text-xl font-semibold text-luxury-900 group-hover:text-luxury-600 transition-colors">
                  {product.name}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0) ? "text-gold-500 fill-current" : "text-pearl-400"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-luxury-600">({product.reviews || 0})</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-luxury-900">₹{(product.price || 0).toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > 0 && (
                  <span className="text-lg text-luxury-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleAddToCart}
                  className="luxury-gradient text-white hover:shadow-lg transition-all duration-300 rounded-full"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlist}
                  className={`rounded-full border-2 ${
                    isWishlisted(product.id)
                      ? "text-rose-500 border-rose-500 bg-rose-50"
                      : "text-luxury-600 border-luxury-300 hover:bg-luxury-50"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted(product.id) ? "fill-current" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleQuickView}
                  className="rounded-full border-2 border-luxury-300 text-luxury-600 hover:bg-luxury-50"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="block group relative">
      <Link href={`/products/${product.id}`} className="block">
        <motion.div
          className="premium-card rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 space-y-2">
              {product.isNew && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">New</Badge>
              )}
              {product.isSale && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">Sale</Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-lg z-10"
              onClick={handleWishlist}
            >
              <Heart className={`h-4 w-4 ${isWishlisted(product.id) ? "fill-current text-rose-500" : "text-luxury-600"}`} />
            </Button>

            {/* Hover Actions */}
            <div
              className={`absolute inset-0 bg-luxury-900/20 flex items-center justify-center space-x-3 transition-opacity duration-500 z-10 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                onClick={handleAddToCart}
                className="luxury-gradient text-white transform hover:scale-105 transition-all duration-300 rounded-full shadow-lg"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
              <Button
                variant="secondary"
                className="bg-white/90 hover:bg-white transform hover:scale-105 transition-all duration-300 rounded-full shadow-lg text-luxury-700"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <p className="text-sm text-luxury-600 font-medium">{product.category}</p>
              <h3 className="text-lg font-semibold text-luxury-900 group-hover:text-luxury-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating || 0) ? "text-gold-500 fill-current" : "text-pearl-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-luxury-600">({product.reviews || 0})</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-luxury-900">₹{(product.price || 0).toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > 0 && (
                <span className="text-sm text-luxury-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  )
}
