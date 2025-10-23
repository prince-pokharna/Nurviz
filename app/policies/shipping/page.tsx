"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, MapPin, Clock } from "lucide-react"

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Shipping & Delivery Policy</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-amber-600" />
                <span>Shipping Charges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Standard Delivery (All India)</span>
                  <span className="text-xl font-bold text-amber-600">₹90</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Flat shipping charge of ₹90 applies to all orders across India, regardless of order value.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <span>Delivery Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
                  <p className="text-gray-600">1-2 business days</p>
                  <p className="text-sm text-gray-500 mt-1">Order verification and packaging</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Time</h3>
                  <p className="text-gray-600">5-9 business days</p>
                  <p className="text-sm text-gray-500 mt-1">After dispatch from our facility</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-900">Total Time:</p>
                <p className="text-blue-800">Expected delivery within 5-9 business days from order placement</p>
                <p className="text-sm text-blue-700 mt-2">
                  * Business days exclude Sundays and public holidays
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-amber-600" />
                <span>Shipping Coverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">We currently ship to all serviceable locations across India.</p>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Serviceable Areas:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>All major cities and metro areas</li>
                  <li>Tier 2 and Tier 3 cities</li>
                  <li>Most rural areas with courier access</li>
                </ul>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                PIN code verification is done at checkout to confirm delivery availability in your area.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-amber-600" />
                <span>Order Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">Once your order is dispatched:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>You'll receive a confirmation email with tracking details</li>
                <li>SMS notification with courier partner information</li>
                <li>Track your order status in real-time</li>
                <li>Delivery updates via SMS/Email</li>
              </ul>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-semibold text-amber-900">Need Help Tracking?</p>
                <p className="text-amber-800 mt-1">
                  Contact our support team with your Order ID for assistance.
                </p>
                <p className="text-amber-800">Email: support@nurvijewel.com</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Delivery times may vary during peak seasons or festivals</li>
                <li>Remote locations may take additional 1-2 days</li>
                <li>Accurate address and contact details ensure timely delivery</li>
                <li>Someone must be available to receive the package</li>
                <li>Signature may be required upon delivery</li>
              </ul>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-green-900">Safe Packaging:</p>
                <p className="text-green-800">
                  All jewelry items are carefully packaged in secure boxes to ensure they reach you in perfect condition.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

