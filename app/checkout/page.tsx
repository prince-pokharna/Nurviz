"use client"

import type React from "react"

import { useState } from "react"

declare global {
  interface Window {
    Razorpay: any;
  }
}
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, Shield, Truck, CheckCircle, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("razorpay")

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  })

  const subtotal = state.total
  const shipping = subtotal > 50000 ? 0 : 500
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Step 1: Create order on server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total, // Amount in rupees
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Order creation failed');
      }

      const order = await response.json();
      
      if (!order.success) {
        const errorMsg = order.details || order.error || 'Failed to create order';
        console.error('Order creation failed:', errorMsg);
        throw new Error(errorMsg);
      }

      // Step 2: Initialize Razorpay checkout
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      
      if (!razorpayKeyId) {
        console.error('❌ Razorpay configuration missing');
        toast({
          title: "Payment Configuration Error",
          description: "Payment system is not configured. Please contact support.",
          variant: "destructive",
        });
        return;
      }
      
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Nurvi Jewels',
        description: 'Purchase from Nurvi Jewels',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Save order data to system
              try {
                const orderData = {
                  orderId: order.id,
                  customerName: `${formData.firstName} ${formData.lastName}`,
                  customerEmail: formData.email,
                  customerPhone: formData.phone,
                  totalAmount: total,
                  items: state.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                  })),
                  shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                  },
                  paymentId: response.razorpay_payment_id,
                  paymentStatus: 'completed'
                };

                await fetch("/api/orders/save", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(orderData),
                });

                console.log('✓ Order data saved successfully');
              } catch (saveError) {
                console.error("Order saving failed:", saveError);
                // Don't fail the entire flow if order saving fails
              }

              // Send SMS notification
              try {
                await fetch("/api/twilio/send-sms", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    to: formData.phone,
                    message: `Dear ${formData.firstName}, your order #${order.id} for ₹${total.toLocaleString()} has been confirmed! Thank you for shopping with Nurvi Jewels. Expected delivery: 7-10 working days. Track your order at nurvijewels.com/orders`,
                  }),
                })
                console.log('✓ SMS confirmation sent');
              } catch (smsError) {
                console.log("SMS sending failed:", smsError)
                // Don't fail the entire flow if SMS fails
              }

              clearCart()
              toast({
                title: "Payment successful! 🎉",
                description: "Order confirmed. You'll receive a confirmation shortly.",
              })
              router.push(`/order-success?orderId=${order.id}`)
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
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error('Razorpay SDK not loaded');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false);
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart before proceeding to checkout.</p>
            <Button onClick={() => router.push("/collections")} className="luxury-gradient text-white">
              Continue Shopping
            </Button>
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
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Checkout Form */}
              <div className="space-y-8">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Smartphone className="w-5 h-5 mr-2 text-amber-600" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Shipping Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input id="state" name="state" value={formData.state} onChange={handleInputChange} />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="400001"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="premium-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-amber-600" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg bg-amber-50">
                          <RadioGroupItem value="razorpay" id="razorpay" />
                          <Label htmlFor="razorpay" className="flex items-center space-x-2 cursor-pointer flex-1">
                            <Shield className="h-5 w-5 text-amber-600" />
                            <div>
                              <p className="font-medium">Secure Payment via Razorpay</p>
                              <p className="text-sm text-gray-600">Pay with UPI, Cards, Net Banking & Wallets</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="premium-card sticky top-24">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {state.items.map((item) => (
                        <div key={item.id} className="flex space-x-4">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                            {item.size && <p className="text-gray-600 text-xs">Size: {item.size}</p>}
                            {item.color && <p className="text-gray-600 text-xs">Color: {item.color}</p>}
                            <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}

                      <Separator />

                      <div className="space-y-2">
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
                        <Separator />
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total</span>
                          <span className="text-amber-600">₹{total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" required />
                          <Label htmlFor="terms" className="text-sm">
                            I agree to the{" "}
                            <a href="/terms" className="text-amber-600 hover:underline">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" className="text-amber-600 hover:underline">
                              Privacy Policy
                            </a>
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full luxury-gradient text-white py-6 text-lg font-semibold hover:shadow-xl transition-all duration-300"
                        >
                          {isProcessing ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                              Processing...
                            </div>
                          ) : (
                            <>
                              <CreditCard className="mr-2 h-5 w-5" />
                              Pay ₹{total.toLocaleString()}
                            </>
                          )}
                        </Button>

                        <div className="space-y-3">
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>SSL Encrypted & Secure</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <span>
                              {shipping === 0 ? "Free shipping on this order" : "Standard shipping: 3-5 business days"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
