"use client"

import { useState, useEffect } from 'react'
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  BarChart3,
  PieChart,
  Activity,
  Eye,
  ShoppingCart,
  Users
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

interface AnalyticsData {
  overview: {
    totalProducts: number
    inStockProducts: number
    outOfStockProducts: number
    lowStockProducts: number
    averagePrice: number
    totalInventoryValue: number
    newProductsThisMonth: number
    recentlyUpdated: number
  }
  categoryStats: { category: string; count: number }[]
  priceRanges: Record<string, number>
  stockStatus: {
    inStock: number
    outOfStock: number
    lowStock: number
  }
  materialBreakdown: Record<string, number>
  lowStockProducts: {
    id: string
    name: string
    category: string
    stock: number
    threshold: number
    image: string
  }[]
  recentActivity: {
    id: string
    name: string
    action: 'added' | 'updated'
    date: string
    category: string
  }[]
  salesInsights: {
    topSellingCategories: { category: string; count: number }[]
    averageOrderValue: number
    conversionRate: number
    popularPriceRange: string
  }
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/analytics', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      } else {
        toast({
          title: "Error loading analytics",
          description: "Failed to load analytics data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error loading analytics",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load analytics data. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    )
  }

  const overviewStats = [
    {
      title: 'Total Products',
      value: analytics.overview.totalProducts.toLocaleString(),
      change: `+${analytics.overview.newProductsThisMonth} this month`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'In Stock',
      value: analytics.overview.inStockProducts.toLocaleString(),
      change: `${((analytics.overview.inStockProducts / analytics.overview.totalProducts) * 100).toFixed(1)}% of total`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Inventory Value',
      value: `₹${(analytics.overview.totalInventoryValue / 1000).toFixed(0)}K`,
      change: `Avg: ₹${analytics.overview.averagePrice.toFixed(0)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Low Stock Alerts',
      value: analytics.overview.lowStockProducts.toString(),
      change: 'Need attention',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Stock Alert */}
      {analytics.lowStockProducts.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <span>
                {analytics.lowStockProducts.length} products are running low on stock
              </span>
              <Button variant="outline" size="sm" className="ml-4">
                View Details
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Products by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.categoryStats.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-blue-${(index + 1) * 100} to-purple-${(index + 1) * 100}`} />
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{category.count}</span>
                        <Badge variant="secondary">
                          {((category.count / analytics.overview.totalProducts) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stock Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Stock Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>In Stock</span>
                      <span>{analytics.stockStatus.inStock} products</span>
                    </div>
                    <Progress 
                      value={(analytics.stockStatus.inStock / analytics.overview.totalProducts) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Low Stock</span>
                      <span>{analytics.stockStatus.lowStock} products</span>
                    </div>
                    <Progress 
                      value={(analytics.stockStatus.lowStock / analytics.overview.totalProducts) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Out of Stock</span>
                      <span>{analytics.stockStatus.outOfStock} products</span>
                    </div>
                    <Progress 
                      value={(analytics.stockStatus.outOfStock / analytics.overview.totalProducts) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={activity.action === 'added' ? 'default' : 'secondary'}>
                        {activity.action}
                      </Badge>
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-gray-600">{activity.category}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Price Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.priceRanges).map(([range, count]) => (
                    <div key={range} className="flex items-center justify-between">
                      <span className="font-medium">{range}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ 
                              width: `${(count / analytics.overview.totalProducts) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Material Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(analytics.materialBreakdown)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([material, count]) => (
                    <div key={material} className="flex items-center justify-between">
                      <span className="text-sm">{material}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          {/* Low Stock Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Low Stock Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.lowStockProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products with low stock</p>
              ) : (
                <div className="space-y-3">
                  {analytics.lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.jpg'
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">
                          {product.stock} left
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          Threshold: {product.threshold}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">₹{analytics.salesInsights.averageOrderValue}</p>
                <p className="text-sm text-gray-600">Avg Order Value</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.salesInsights.conversionRate}%</p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.salesInsights.popularPriceRange}</p>
                <p className="text-sm text-gray-600">Popular Range</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.overview.recentlyUpdated}</p>
                <p className="text-sm text-gray-600">Recent Updates</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.salesInsights.topSellingCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{category.category}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ 
                            width: `${(category.count / analytics.overview.totalProducts) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                    <span className="font-bold">{category.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
