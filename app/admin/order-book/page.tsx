"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  Users, 
  Package,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAdmin } from '@/contexts/admin-context'
import { useToast } from '@/hooks/use-toast'

interface OrderBookStats {
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate: string | null;
  masterBookExists: boolean;
  masterBookLastModified: string | null;
}

interface SystemStatus {
  dailyUpdateEnabled: boolean;
  nextUpdate: string;
  backupRetention: string;
}

interface OrderBookFile {
  name: string;
  path: string;
  date: string;
}

export default function OrderBookPage() {
  const { isAuthenticated } = useAdmin()
  const { toast } = useToast()
  const router = useRouter()
  
  const [stats, setStats] = useState<OrderBookStats | null>(null)
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [files, setFiles] = useState<OrderBookFile[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin')
      return
    }
    loadOrderBookData()
  }, [isAuthenticated, router])

  const loadOrderBookData = async () => {
    try {
      setLoading(true)
      
      // Load statistics and system status
      const statsResponse = await fetch('/api/admin/order-book', {
        credentials: 'include'
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.statistics)
        setSystemStatus(statsData.systemStatus)
      }
      
      // Load available files
      const filesResponse = await fetch('/api/admin/order-book?action=list', {
        credentials: 'include'
      })
      
      if (filesResponse.ok) {
        const filesData = await filesResponse.json()
        setFiles(filesData.files || [])
      }
      
    } catch (error) {
      console.error('Error loading order book data:', error)
      toast({
        title: "Error",
        description: "Failed to load order book data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateOrderBook = async () => {
    try {
      setGenerating(true)
      
      const response = await fetch('/api/admin/order-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'generate_now' }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "✅ Success",
          description: "Excel order book generated successfully!",
        })
        
        // Reload data to show updated information
        await loadOrderBookData()
      } else {
        throw new Error(data.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Error generating order book:', error)
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to generate order book",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-IN')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">📊 Order Book Management</h1>
              <Badge className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white">
                Daily Auto-Updates
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={loadOrderBookData}
                variant="outline"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={generateOrderBook}
                disabled={generating}
                className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {generating ? 'Generating...' : 'Generate Now'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Status Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Automated System Active:</strong> Excel order books are automatically generated daily at midnight (IST). 
            The master file (Book1.xlsx) is updated with the latest data every day.
          </AlertDescription>
        </Alert>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B4AFA7] mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading order book data...</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(stats?.totalRevenue || 0)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-50">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Order</p>
                      <p className="text-sm font-bold text-gray-900">{formatDate(stats?.lastOrderDate)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-50">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Master Book</p>
                      <p className="text-sm font-bold text-gray-900">
                        {stats?.masterBookExists ? 'Updated' : 'Not Found'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(stats?.masterBookLastModified)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stats?.masterBookExists ? 'bg-green-50' : 'bg-red-50'}`}>
                      <FileSpreadsheet className={`h-6 w-6 ${stats?.masterBookExists ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">⚙️</span>
                  <span>System Configuration</span>
                </CardTitle>
                <CardDescription>
                  Automated order book generation settings and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Daily Updates</p>
                      <p className="text-sm text-gray-600">
                        {systemStatus?.dailyUpdateEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Next Update</p>
                      <p className="text-sm text-gray-600">{systemStatus?.nextUpdate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-100">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Backup Retention</p>
                      <p className="text-sm text-gray-600">{systemStatus?.backupRetention}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Order Books */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">📚</span>
                      <span>Available Order Books</span>
                    </CardTitle>
                    <CardDescription>
                      Download daily generated Excel order books
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {files.length} Files Available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-8">
                    <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Order Books Yet</h3>
                    <p className="text-gray-500 mb-4">
                      Generate your first order book to see it here
                    </p>
                    <Button
                      onClick={generateOrderBook}
                      disabled={generating}
                      className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Generate First Order Book
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {files.slice(0, 10).map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-green-100">
                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">Generated on {file.date}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // In a real implementation, you'd handle file download here
                            toast({
                              title: "Download Feature",
                              description: "File download functionality will be implemented in the next update",
                            })
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                    
                    {files.length > 10 && (
                      <div className="text-center pt-4">
                        <p className="text-sm text-gray-500">
                          Showing latest 10 files. Total: {files.length} files available.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
