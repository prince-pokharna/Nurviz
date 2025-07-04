"use client"

import { useState } from "react"
import { Heart, ShoppingBag, X, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { addItem } = useCart()
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { toast } = useToast()

  const addToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    })
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center space-y-6">
              <Heart className="h-24 w-24 text-gray-300 mx-auto" />
              <h1 className="text-3xl font-bold text-gray-900">Your wishlist is empty</h1>
              <p className="text-xl text-gray-600">Save items you love to your wishlist and shop them later.</p>
              <Link href="/collections">
                <Button size="lg" className="luxury-gradient text-white">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <Badge variant="secondary" className="bg-theme-light text-theme-dark">
                {items.length} items
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={clearWishlist} className="text-red-600 hover:text-red-700">
                Clear All
              </Button>

              {/* View Mode */}
              <div className="flex border border-gray-200 rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"
            }
          >
            {items.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-0">
                  {viewMode === "grid" ? (
                    <>
                      <div className="relative overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 space-y-2">
                          {item.isNew && <Badge className="bg-green-500 text-white shadow-lg">New</Badge>}
                          {item.isSale && <Badge className="bg-red-500 text-white shadow-lg">Sale</Badge>}
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>

                        {/* Quick Actions */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            onClick={() => addToCart(item)}
                            className="luxury-gradient text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="text-sm text-theme-medium font-medium">{item.category}</div>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.name}</h3>

                        <div className="flex items-center justify-between">
                          <div className="space-x-2">
                            <span className="text-xl font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {item.isSale && item.originalPrice && (
                            <Badge variant="destructive" className="text-xs">
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex space-x-6 p-6">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {item.isNew && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">New</Badge>
                        )}
                        {item.isSale && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">Sale</Badge>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-sm text-theme-medium font-medium">{item.category}</p>
                          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                          {item.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button onClick={() => addToCart(item)} className="luxury-gradient text-white">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-12">
            <Link href="/collections">
              <Button
                variant="outline"
                size="lg"
                className="border-theme-medium text-theme-medium hover:bg-theme-light"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
