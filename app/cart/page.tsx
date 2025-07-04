"use client"

import { useState } from "react"
import { Minus, Plus, X, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const router = useRouter()

  const subtotal = state.total
  const shipping = subtotal > 50000 ? 0 : 500 // Free shipping over ₹50,000
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + shipping + tax - discount

  const handleApplyPromo = () => {
    if (promoCode === "WELCOME10") {
      setDiscount(Math.round(subtotal * 0.1))
    } else if (promoCode === "SAVE500") {
      setDiscount(500)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center space-y-6">
              <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto" />
              <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
              <p className="text-xl text-gray-600">Looks like you haven't added any items to your cart yet.</p>
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Cart Items ({state.itemCount})</span>
                    <Button variant="ghost" onClick={clearCart} className="text-red-600 hover:text-red-700">
                      Clear All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-amber-600 font-bold text-xl">₹{item.price.toLocaleString()}</p>
                        {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                        {item.customization && <p className="text-sm text-gray-500">Custom: {item.customization}</p>}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>Promo Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button onClick={handleApplyPromo} variant="outline">
                      Apply
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Available codes:</p>
                    <p>• WELCOME10 - 10% off</p>
                    <p>• SAVE500 - ₹500 off</p>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button
                onClick={() => router.push("/checkout")}
                size="lg"
                className="w-full luxury-gradient text-white hover:shadow-xl transition-all duration-300"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Checkout
              </Button>

              {/* Security Info */}
              <div className="text-center text-sm text-gray-600">
                <p>🔒 Secure checkout with 256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
