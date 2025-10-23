"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react"

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Cancellation & Refund Policy</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <span>Cancellation Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-semibold">Within 1-2 Days of Order</p>
                  <p className="text-gray-600">Orders can be cancelled within 48 hours (2 days) of placing the order. Full refund will be processed.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <p className="font-semibold">After 2 Days</p>
                  <p className="text-gray-600">Orders cannot be cancelled or refunded after 48 hours from order placement as items may have already been dispatched or in processing.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>How to Cancel Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">If your order is within the 48-hour cancellation window:</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Contact our support team immediately</li>
                <li>Provide your Order ID and registered email</li>
                <li>Request cancellation</li>
                <li>Receive confirmation within 24 hours</li>
              </ol>
              
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-semibold text-amber-900">Contact Support:</p>
                <p className="text-amber-800">Email: support@nurvijewel.com</p>
                <p className="text-amber-800">Phone: +91 98765 43210</p>
                <p className="text-amber-800">Hours: Monday-Saturday, 10 AM - 6 PM IST</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Refund Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-gray-700">
                <p><strong>Eligible Cancellations:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Refund initiated within 24 hours of cancellation approval</li>
                  <li>Amount credited to original payment method</li>
                  <li>Processing time: 5-7 business days</li>
                  <li>100% refund (no deductions)</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="flex items-center space-x-2 text-blue-900">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold">Note:</span>
                </p>
                <p className="text-blue-800 mt-2">
                  Cancellations requested after 48 hours will not be processed. Please ensure you are certain about your purchase before the deadline.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exceptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">Cancellations may not be possible even within 48 hours if:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Order has already been shipped</li>
                <li>Product is a custom/personalized item</li>
                <li>Item is already in transit</li>
              </ul>
              
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">Need Help?</p>
                <p className="text-gray-700">
                  For any queries regarding cancellations or refunds, please contact our customer support team. We're here to help!
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/contact">
              <Button className="luxury-gradient text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Customer Support
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

