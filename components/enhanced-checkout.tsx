"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Smartphone, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/contexts/cart-context"
import { openRazorpayCheckout, createRazorpayOrder } from "@/lib/razorpay"
import { sendOrderConfirmationSMS } from "@/lib/twilio"
import { useToast } from "@/hooks/use-toast"

export function EnhancedCheckout() {
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Create Razorpay order
      const orderData = await createRazorpayOrder(total)

      if (!orderData.success) {
        throw new Error("Failed to create order")
      }

      // Open Razorpay checkout
      await openRazorpayCheckout({
        amount: total,
        orderId: orderData.orderId,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        onSuccess: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Send SMS notification
              await sendOrderConfirmationSMS({
                customerPhone: customerDetails.phone,
                customerName: customerDetails.name,
                orderId: orderData.orderId,
                amount: total,
                items: items.map((item) => ({
                  name: item.name,
                  quantity: item.quantity,
                })),
              })

              // Clear cart and show success
              clearCart()
              toast({
                title: "Order Confirmed! 🎉",
                description: "You'll receive an SMS confirmation shortly.",
              })

              // Redirect to success page
              window.location.href = `/order-success?orderId=${orderData.orderId}`
            } else {
              throw new Error("Payment verification failed")
            }
          } catch (error) {
            console.error("Error processing order:", error)
            toast({
              title: "Order Processing Error",
              description: "Please contact support if payment was deducted.",
              variant: "destructive",
            })
          }
        },
        onFailure: (error) => {
          console.error("Payment failed:", error)
          toast({
            title: "Payment Failed",
            description: "Please try again or contact support.",
            variant: "destructive",
          })
        },
      })
    } catch (error) {
      console.error("Error initiating payment:", error)
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto mobile-padding py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Customer Details */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-amber-600" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={customerDetails.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={customerDetails.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={customerDetails.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    placeholder="400001"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Summary & Payment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Order Summary */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-amber-600" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border rounded-lg bg-amber-50">
                  <Shield className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="font-medium">Secure Payment via Razorpay</p>
                    <p className="text-sm text-gray-600">Pay securely with UPI, Cards, Net Banking & Wallets</p>
                  </div>
                </div>

                <Button
                  className="w-full luxury-gradient text-white py-6 text-lg font-semibold"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay ₹{total.toLocaleString()}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>SSL Encrypted & Secure</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
