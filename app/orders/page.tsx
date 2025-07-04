"use client"

import { useState, useEffect } from "react"
import { Package, Truck, CheckCircle, Clock, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { OrderData } from "@/lib/order-management"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function MyOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState<OrderData[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
  }, [isAuthenticated, router])

  // Load user's orders only
  useEffect(() => {
    if (isAuthenticated && user) {
      loadMyOrders()
    }
  }, [isAuthenticated, user])

  const loadMyOrders = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      // Fetch orders for the current user only
      const response = await fetch(`/api/orders/get?email=${encodeURIComponent(user.email)}`)
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders)
        setFilteredOrders(data.orders)
      } else {
        console.error('Failed to load orders:', data.error)
        toast({
          title: "Error",
          description: "Failed to load your orders",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      toast({
        title: "Error",
        description: "Failed to load your orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />
      case "confirmed":
        return <Package className="h-4 w-4 text-purple-600" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-purple-100 text-purple-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterOrders(term, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterOrders(searchTerm, status)
  }

  const filterOrders = (search: string, status: string) => {
    let filtered = orders

    if (search) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(search.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(search.toLowerCase())),
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((order) => order.orderStatus.toLowerCase() === status.toLowerCase())
    }

    setFilteredOrders(filtered)
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Track your jewelry orders and delivery status</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search your orders by ID or product name..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={statusFilter} onValueChange={handleStatusFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-medium mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading your orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-6">
                    {orders.length === 0 
                      ? "You haven't placed any orders yet." 
                      : "No orders match your search criteria."}
                  </p>
                  <Button asChild>
                    <Link href="/collections">Start Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.orderId} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <CardTitle className="text-lg">{order.orderId}</CardTitle>
                        <p className="text-sm text-gray-600">Placed on {order.orderDate}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(order.orderStatus)}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="ml-1 capitalize">{order.orderStatus}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src="/placeholder.svg"
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-xl font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                        {order.trackingNumber && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Tracking Number</p>
                            <p className="font-mono text-sm font-semibold text-theme-medium">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {order.orderStatus === "shipped" && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">Your order is on the way!</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">Expected delivery: 7-10 working days</p>
                      </div>
                    )}
                    
                    {order.estimatedDelivery && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-amber-600" />
                          <span className="font-semibold text-amber-900">Estimated Delivery</span>
                        </div>
                        <p className="text-sm text-amber-700 mt-1">{order.estimatedDelivery}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
