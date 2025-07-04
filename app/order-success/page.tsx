"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Package, MessageCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function OrderSuccessPage() {
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setOrderId(urlParams.get("orderId") || "")
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center mobile-padding">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="premium-card text-center">
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-display font-bold text-gray-800 mb-4"
            >
              Order Confirmed! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-gray-600 mb-6"
            >
              Thank you for choosing Nurvi Jewel! Your order has been successfully placed.
            </motion.p>

            {orderId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-amber-50 p-4 rounded-lg mb-6"
              >
                <p className="text-sm text-gray-600 mb-2">Order ID</p>
                <p className="font-mono font-bold text-amber-600">{orderId}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span>SMS confirmation sent to your phone</span>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>Expected delivery: 7-10 working days</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mt-8 space-y-3"
            >
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/orders">
                  <Package className="w-4 h-4 mr-2" />
                  Track Your Order
                </Link>
              </Button>

              <Button 
                asChild 
                variant="outline" 
                className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all duration-300"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
