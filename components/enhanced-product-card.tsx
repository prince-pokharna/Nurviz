"use client"

import { motion } from "framer-motion"
import { Heart, Eye, ShoppingCart, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isTrending?: boolean
  isOnSale?: boolean
  description: string
}

interface EnhancedProductCardProps {
  product: Product
}

export function EnhancedProductCard({ product }: EnhancedProductCardProps) {
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  const handleWishlistToggle = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      isNew: product.isNew,
      isSale: product.isOnSale,
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-theme-medium fill-current" : "text-gray-300"}`} />
    ))
  }

  const getBadge = () => {
    if (product.isNew) return <Badge className="badge-new">New</Badge>
    if (product.isTrending) return <Badge className="badge-trending">Trending</Badge>
    if (product.isOnSale) return <Badge className="badge-sale">Sale</Badge>
    return null
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -8 }}
        className="group"
      >
        <Card className="premium-card overflow-hidden">
          <div className="relative image-zoom">
            {getBadge()}

            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-64 object-cover" />

            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center space-x-2"
            >
              <Button size="sm" variant="secondary" className="glass-effect">
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className={`glass-effect ${isWishlisted(product.id) ? "text-red-500" : ""}`}
                onClick={handleWishlistToggle}
              >
                <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-current" : ""}`} />
              </Button>
              <Button size="sm" className="luxury-gradient text-white" onClick={handleAddToCart}>
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          <CardContent className="p-4">
            <div className="mb-2">
              <p className="text-sm text-theme-medium font-medium">{product.category}</p>
              <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
            </div>

            <div className="flex items-center mb-3">
              <div className="star-rating mr-2">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-500">({product.reviewCount})</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-theme-dark">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              {product.originalPrice && (
                <Badge variant="destructive" className="text-xs">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>


    </>
  )
}
