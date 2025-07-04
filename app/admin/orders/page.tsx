"use client"

import { useState, useEffect } from "react"
import { Package, Truck, CheckCircle, Clock, Search, Filter, Edit, Download, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { OrderData } from "@/lib/order-management"
import { useToast } from "@/hooks/use-toast"

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState<OrderData[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const { toast } = useToast()

  // Load orders on component mount
  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders/get')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders)
        setFilteredOrders(data.orders)
      } else {
        console.error('Failed to load orders:', data.error)
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading orders:', error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, orderStatus: string, trackingNumber?: string, notes?: string) => {
    try {
      const response = await fetch('/api/orders/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          orderStatus,
          trackingNumber,
          notes
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        })
        loadOrders() // Refresh orders
        setIsUpdateDialogOpen(false)
        setEditingOrder(null)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const downloadOrders = async () => {
    try {
      const response = await fetch('/api/orders/download?format=csv')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nurvi-jewels-orders-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: "Success",
          description: "Orders downloaded successfully",
        })
      } else {
        throw new Error('Download failed')
      }
    } catch (error) {
      console.error('Error downloading orders:', error)
      toast({
        title: "Error",
        description: "Failed to download orders",
        variant: "destructive",
      })
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
          order.customerName.toLowerCase().includes(search.toLowerCase()) ||
          order.customerPhone.includes(search) ||
          order.items.some((item) => item.name.toLowerCase().includes(search.toLowerCase())),
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((order) => order.orderStatus.toLowerCase() === status.toLowerCase())
    }

    setFilteredOrders(filtered)
  }

  const handleEditOrder = (order: OrderData) => {
    setEditingOrder(order)
    setIsUpdateDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin - Order Management</h1>
              <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
            </div>
            <Button onClick={downloadOrders} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Excel
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by Order ID, Customer Name, Phone, or Product..."
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
              <Card>
                <CardContent className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </CardContent>
              </Card>
            ) : filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No orders have been placed yet"}
                  </p>
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
                        <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
                        <p className="text-sm text-gray-600">Phone: {order.customerPhone}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(order.orderStatus)}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="ml-1 capitalize">{order.orderStatus}</span>
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Order Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className="font-semibold text-gray-900 capitalize">{order.paymentStatus}</span>
                          </div>
                          {order.trackingNumber && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tracking Number:</span>
                              <span className="font-mono text-sm font-semibold text-blue-600">{order.trackingNumber}</span>
                            </div>
                          )}
                          {order.estimatedDelivery && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Estimated Delivery:</span>
                              <span className="font-semibold text-gray-900">{order.estimatedDelivery}</span>
                            </div>
                          )}
                          <div className="pt-2 border-t">
                            <p className="text-gray-600 font-medium">Shipping Address:</p>
                            <p className="text-sm text-gray-800">
                              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                          </div>
                          {order.notes && (
                            <div className="pt-2">
                              <p className="text-gray-600 font-medium">Notes:</p>
                              <p className="text-sm text-gray-800">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Update Order Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderId">Order ID</Label>
                <Input 
                  id="orderId" 
                  value={editingOrder.orderId} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="orderStatus">Order Status</Label>
                <Select 
                  value={editingOrder.orderStatus} 
                  onValueChange={(value) => setEditingOrder({...editingOrder, orderStatus: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="trackingNumber">Tracking Number (Optional)</Label>
                <Input 
                  id="trackingNumber" 
                  value={editingOrder.trackingNumber || ''} 
                  onChange={(e) => setEditingOrder({...editingOrder, trackingNumber: e.target.value})}
                  placeholder="Enter tracking number"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  value={editingOrder.notes || ''} 
                  onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})}
                  placeholder="Add any notes about this order"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={() => updateOrderStatus(
                  editingOrder.orderId, 
                  editingOrder.orderStatus, 
                  editingOrder.trackingNumber,
                  editingOrder.notes
                )}>
                  <Save className="h-4 w-4 mr-2" />
                  Update Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
} 