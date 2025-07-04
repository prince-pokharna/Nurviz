"use client"

import { motion } from "framer-motion"
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    onOpenChange(false)
    router.push("/checkout")
  }

  const handleViewCart = () => {
    onOpenChange(false)
    router.push("/cart")
  }

  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-theme-medium" />
              <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
              {state.itemCount > 0 && <Badge className="luxury-gradient text-white">{state.itemCount}</Badge>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some beautiful jewelry to get started!</p>
                <Link href="/collections" onClick={() => onOpenChange(false)}>
                  <Button className="luxury-gradient text-white">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                      <p className="text-theme-medium font-semibold">₹{item.price.toLocaleString()}</p>
                      {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                      {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-theme-medium text-theme-dark hover:bg-theme-light/10"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-theme-medium text-theme-dark hover:bg-theme-light/10"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {state.items.length > 1 && (
                  <Button
                    variant="ghost"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={clearCart}
                  >
                    Clear All Items
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{state.total > 50000 ? "Free" : "₹500"}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    ₹{(state.total + (state.total > 50000 ? 0 : 500)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full luxury-gradient text-white hover:shadow-lg transition-all duration-300"
                >
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleViewCart}
                  className="w-full border-theme-medium text-theme-dark hover:bg-theme-light/10"
                >
                  View Cart
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">🔒 Secure checkout with 256-bit SSL encryption</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CartDrawer
