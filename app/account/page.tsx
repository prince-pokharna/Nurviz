"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Edit, Save, X, Package, Heart, Settings, Bell, Shield, CreditCard, Eye, EyeOff, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { OrderData } from "@/lib/order-management"
import Link from "next/link"

interface PaymentMethod {
  id: string
  type: 'card' | 'upi' | 'bank'
  name: string
  details: string
  isDefault: boolean
}

export default function AccountPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  
  // Profile form data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+91-",
    address: ""
  })

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    recommendations: false
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true,
    marketing: false
  })

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      details: '**** **** **** 4242',
      isDefault: true
    }
  ])

  const [showAddPayment, setShowAddPayment] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card',
    name: '',
    details: ''
  })

  useEffect(() => {
    fetchUserOrders()
  }, [user])

  const fetchUserOrders = async () => {
    if (!user?.email) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/orders/get?email=${encodeURIComponent(user.email)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders)
        } else {
          setOrders([])
        }
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      // For now, just simulate saving (in a real app, you'd call an API)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "+91-",
      address: ""
    })
    setIsEditing(false)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setEmailNotifications(prev => ({ ...prev, [key]: value }))
    toast({
      title: "Notification settings updated",
      description: `${key} notifications ${value ? 'enabled' : 'disabled'}.`,
    })
  }

  const handlePrivacyChange = (key: string, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }))
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved.",
    })
  }

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.name || !newPaymentMethod.details) {
      toast({
        title: "Error",
        description: "Please fill in all payment method details.",
        variant: "destructive",
      })
      return
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newPaymentMethod.type as 'card' | 'upi' | 'bank',
      name: newPaymentMethod.name,
      details: newPaymentMethod.details,
      isDefault: paymentMethods.length === 0
    }

    setPaymentMethods(prev => [...prev, newMethod])
    setNewPaymentMethod({ type: 'card', name: '', details: '' })
    setShowAddPayment(false)
    
    toast({
      title: "Payment method added",
      description: "Your new payment method has been saved.",
    })
  }

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id))
    toast({
      title: "Payment method removed",
      description: "The payment method has been deleted.",
    })
  }

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({ 
        ...method, 
        isDefault: method.id === id 
      }))
    )
    toast({
      title: "Default payment updated",
      description: "Your default payment method has been changed.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="premium-card p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
              <p className="text-gray-600 mb-6">You need to be logged in to view your account.</p>
              <Link href="/auth">
                <Button className="luxury-button">Log In</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your profile, orders, and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="premium-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="luxury-button flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="flex items-center gap-3">
                        <User className="luxury-icon h-5 w-5" />
                        {isEditing ? (
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="input-luxury"
                          />
                        ) : (
                          <span className="text-gray-900 font-medium">{formData.name}</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex items-center gap-3">
                        <Mail className="luxury-icon h-5 w-5" />
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="input-luxury"
                          />
                        ) : (
                          <span className="text-gray-900 font-medium">{formData.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex items-center gap-3">
                        <Phone className="luxury-icon h-5 w-5" />
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="input-luxury"
                          />
                        ) : (
                          <span className="text-gray-900 font-medium">{formData.phone}</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="flex items-center gap-3">
                        <MapPin className="luxury-icon h-5 w-5" />
                        {isEditing ? (
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="input-luxury"
                          />
                        ) : (
                          <span className="text-gray-900 font-medium">{formData.address}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="premium-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/orders">
                    <Button variant="outline">View All Orders</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">Start shopping to see your orders here.</p>
                      <Link href="/collections">
                        <Button className="luxury-button">Start Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.orderId} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-semibold">{order.orderId}</p>
                              <p className="text-sm text-gray-600">{order.orderDate}</p>
                            </div>
                            <Badge className={getStatusColor(order.orderStatus)}>{order.orderStatus}</Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{formatPrice(order.totalAmount)}</p>
                            <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-4">Save items you love to your wishlist.</p>
                    <Link href="/collections">
                      <Button className="luxury-button">Browse Products</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                {/* Email Notifications */}
                <Card className="premium-card">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 luxury-icon" />
                      <CardTitle>Email Notifications</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Order Updates</Label>
                        <p className="text-sm text-gray-600">Receive updates about your orders</p>
                      </div>
                      <Switch
                        checked={emailNotifications.orderUpdates}
                        onCheckedChange={(value) => handleNotificationChange('orderUpdates', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Promotions & Offers</Label>
                        <p className="text-sm text-gray-600">Get notified about sales and special offers</p>
                      </div>
                      <Switch
                        checked={emailNotifications.promotions}
                        onCheckedChange={(value) => handleNotificationChange('promotions', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Newsletter</Label>
                        <p className="text-sm text-gray-600">Weekly newsletter with latest collections</p>
                      </div>
                      <Switch
                        checked={emailNotifications.newsletter}
                        onCheckedChange={(value) => handleNotificationChange('newsletter', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Product Recommendations</Label>
                        <p className="text-sm text-gray-600">Personalized product suggestions</p>
                      </div>
                      <Switch
                        checked={emailNotifications.recommendations}
                        onCheckedChange={(value) => handleNotificationChange('recommendations', value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card className="premium-card">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 luxury-icon" />
                      <CardTitle>Privacy Settings</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Profile Visibility</Label>
                        <p className="text-sm text-gray-600">Control who can see your profile</p>
                      </div>
                      <Select
                        value={privacySettings.profileVisibility}
                        onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Data Sharing</Label>
                        <p className="text-sm text-gray-600">Share data with partners for better experience</p>
                      </div>
                      <Switch
                        checked={privacySettings.dataSharing}
                        onCheckedChange={(value) => handlePrivacyChange('dataSharing', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Analytics</Label>
                        <p className="text-sm text-gray-600">Help us improve by sharing usage data</p>
                      </div>
                      <Switch
                        checked={privacySettings.analytics}
                        onCheckedChange={(value) => handlePrivacyChange('analytics', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Marketing Communications</Label>
                        <p className="text-sm text-gray-600">Receive personalized marketing messages</p>
                      </div>
                      <Switch
                        checked={privacySettings.marketing}
                        onCheckedChange={(value) => handlePrivacyChange('marketing', value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="premium-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 luxury-icon" />
                        <CardTitle>Payment Methods</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddPayment(true)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Method
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {paymentMethods.length === 0 ? (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No payment methods</h3>
                        <p className="text-gray-600 mb-4">Add a payment method for faster checkout.</p>
                        <Button onClick={() => setShowAddPayment(true)} className="luxury-button">
                          Add Payment Method
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5 luxury-icon" />
                              <div>
                                <p className="font-medium">{method.name}</p>
                                <p className="text-sm text-gray-600">{method.details}</p>
                              </div>
                              {method.isDefault && (
                                <Badge className="badge-luxury-premium">Default</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {!method.isDefault && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSetDefaultPayment(method.id)}
                                >
                                  Set Default
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePaymentMethod(method.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {showAddPayment && (
                          <div className="border rounded-lg p-4 bg-gray-50">
                            <h4 className="font-semibold mb-4">Add New Payment Method</h4>
                            <div className="space-y-4">
                              <div>
                                <Label>Payment Type</Label>
                                <Select
                                  value={newPaymentMethod.type}
                                  onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, type: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                                    <SelectItem value="upi">UPI</SelectItem>
                                    <SelectItem value="bank">Bank Account</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Display Name</Label>
                                <Input
                                  placeholder="e.g., Personal Visa Card"
                                  value={newPaymentMethod.name}
                                  onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, name: e.target.value }))}
                                  className="input-luxury"
                                />
                              </div>
                              <div>
                                <Label>Details</Label>
                                <Input
                                  placeholder="e.g., **** **** **** 1234"
                                  value={newPaymentMethod.details}
                                  onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, details: e.target.value }))}
                                  className="input-luxury"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={handleAddPaymentMethod} className="luxury-button">
                                  Add Method
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setShowAddPayment(false)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
