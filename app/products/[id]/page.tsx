"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Share2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"
// Removed import { getProductById } from "@/lib/constants"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { toast } = useToast()

  const [product, setProduct] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.id) {
        try {
          // Fetch from API instead of constants for consistency
          const response = await fetch('/api/inventory')
          if (response.ok) {
            const data = await response.json()
            const productData = data.all.find((p: any) => 
              p.id.toString() === params.id || p.product_id === params.id
            )
            
            if (productData) {
              setProduct(productData)
              setSelectedColor(productData.colors?.[0] || '')
              setSelectedSize(productData.sizes?.[0] || '')
            }
          }
        } catch (error) {
          console.error('Failed to fetch product:', error)
        }
      }
      setLoading(false)
    }
    
    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    // Check if size and color are available and required
    const sizeRequired = product.sizes && product.sizes.length > 0
    const colorRequired = product.colors && product.colors.length > 0
    
    if ((sizeRequired && !selectedSize) || (colorRequired && !selectedColor)) {
      toast({
        title: "Please select options",
        description: "Please select size and color before adding to cart",
        variant: "destructive",
      })
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
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
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-300 h-96 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-300 h-20 w-20 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-300 h-8 w-3/4 rounded"></div>
                <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
                <div className="bg-gray-300 h-4 w-full rounded"></div>
                <div className="bg-gray-300 h-4 w-full rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Button onClick={() => router.push("/collections")}>Back to Collections</Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <button onClick={() => router.push("/")} className="hover:text-amber-600">
              Home
            </button>
            <span>/</span>
            <button onClick={() => router.push("/collections")} className="hover:text-amber-600">
              Collections
            </button>
            <span>/</span>
            <button
              onClick={() => router.push(`/collections?category=${product.category}`)}
              className="hover:text-amber-600"
            >
              {product.category}
            </button>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-lg"
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                {product.isNew && <Badge className="absolute top-4 left-4 bg-green-500 text-white">New</Badge>}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                  onClick={() => toggleWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category
                  })}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted(product.id) ? "fill-current text-red-500" : "text-gray-600"}`} />
                </Button>
              </motion.div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedImage(0)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === 0 ? "border-amber-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <p className="text-amber-600 font-medium mb-2">{product.category}</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "text-amber-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">({product.reviews} reviews)</span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <Badge className="bg-red-500 text-white">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Options */}
              <div className="space-y-4">
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.colors.map((color: string) => (
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sizes.map((size: string) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  className="w-full luxury-gradient text-white py-6 text-lg font-semibold hover:shadow-xl transition-all duration-300"
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white"
                    onClick={() => toggleWishlist({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      category: product.category
                    })}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isWishlisted(product.id) ? "fill-current" : ""}`} />
                    {isWishlisted(product.id) ? "Wishlisted" : "Add to Wishlist"}
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders above ₹2000</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% secure checkout</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-gray-600">7-day return policy</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {(product.features || []).map((feature: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.material && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Material:</span>
                          <span className="text-gray-600">{product.material}</span>
                        </div>
                      )}
                      {product.weight && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Weight:</span>
                          <span className="text-gray-600">{product.weight}g</span>
                        </div>
                      )}
                      {product.gemstone && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Gemstone:</span>
                          <span className="text-gray-600">{product.gemstone}</span>
                        </div>
                      )}
                      {product.style && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Style:</span>
                          <span className="text-gray-600">{product.style}</span>
                        </div>
                      )}
                      {product.occasion && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">Occasion:</span>
                          <span className="text-gray-600">{product.occasion}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                    <div className="space-y-6">
                      {/* Review Summary */}
                      <div className="flex items-center space-x-6 pb-6 border-b">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-amber-600">{product.rating || 0}</div>
                          <div className="flex justify-center mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating || 0) ? "text-amber-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">{product.reviews || 0} reviews</div>
                        </div>
                        <div className="flex-1">
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((stars) => (
                              <div key={stars} className="flex items-center space-x-2">
                                <span className="text-sm w-8">{stars}★</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-amber-400 h-2 rounded-full"
                                    style={{
                                      width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 8 : 2}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">
                                  {stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 8 : 2}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Individual Reviews */}
                      <div className="space-y-6">
                        {[
                          {
                            name: "Priya Sharma",
                            rating: 5,
                            date: "2 weeks ago",
                            comment:
                              "Absolutely beautiful necklace! The craftsmanship is excellent and it looks exactly like the photos.",
                          },
                          {
                            name: "Anita Gupta",
                            rating: 4,
                            date: "1 month ago",
                            comment: "Good quality jewelry. Fast delivery and well packaged. Highly recommended!",
                          },
                        ].map((review, index) => (
                          <div key={index} className="border-b border-gray-100 pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                  <span className="text-amber-600 font-semibold">{review.name[0]}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{review.name}</p>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3 w-3 ${
                                            i < review.rating ? "text-amber-400 fill-current" : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-600">{review.date}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
