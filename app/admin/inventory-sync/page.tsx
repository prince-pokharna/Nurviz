"use client"

import { useState } from 'react'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import Header from '@/components/header'
import Footer from '@/components/footer'

interface SyncResult {
  success: boolean
  message: string
  data?: {
    totalRows: number
    validProducts: number
    errors: number
    categories: string[]
    lastUpdated: string
  }
  products?: any[]
  errors?: string[]
}

export default function InventorySyncPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
        selectedFile.type !== 'application/vnd.ms-excel') {
      toast({
        title: "Invalid file type",
        description: "Please select an Excel file (.xlsx or .xls)",
        variant: "destructive"
      })
      return
    }

    setFile(selectedFile)
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('excel-file', file)

      const response = await fetch('/api/admin/sync-inventory', {
        method: 'POST',
        headers: {
          'x-admin-auth': process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'admin123'
        },
        body: formData
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
        toast({
          title: "Sync successful! 🎉",
          description: `Updated ${data.data.validProducts} products successfully.`
        })
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    // Create a link to download the template
    const link = document.createElement('a')
    link.href = '/Stock-Management-Inventory.xlsx'
    link.download = 'Stock-Management-Inventory-Template.xlsx'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Sync</h1>
            <p className="text-gray-600">Upload your Excel file to update product inventory</p>
          </div>

          {/* Template Download */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download Template
              </CardTitle>
              <CardDescription>
                Download the Excel template with the correct column format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadTemplate} variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Excel File
              </CardTitle>
              <CardDescription>
                Upload your Stock-Management-Inventory.xlsx file to sync products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your Excel file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports .xlsx and .xls files
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </label>
              </div>

              {file && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">{file.name}</p>
                        <p className="text-sm text-blue-700">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Sync Inventory
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  Sync Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.success && result.data && (
                  <div className="space-y-6">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        {result.message}
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {result.data.totalRows}
                        </div>
                        <div className="text-sm text-blue-800">Total Rows</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {result.data.validProducts}
                        </div>
                        <div className="text-sm text-green-800">Valid Products</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {result.data.errors}
                        </div>
                        <div className="text-sm text-red-800">Errors</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {result.data.categories.length}
                        </div>
                        <div className="text-sm text-purple-800">Categories</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Categories:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.data.categories.map((category, index) => (
                          <Badge key={index} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">
                        Last updated: {new Date(result.data.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {result.errors && result.errors.length > 0 && (
                  <div className="mt-6">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Found {result.errors.length} errors in your data:
                      </AlertDescription>
                    </Alert>
                    <div className="mt-4 max-h-48 overflow-y-auto">
                      {result.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-600 mb-1">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium">Download Template</p>
                  <p className="text-sm text-gray-600">
                    Get the Excel template with the correct column format
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium">Update Your Data</p>
                  <p className="text-sm text-gray-600">
                    Edit stock quantities, prices, and product details in the Excel file
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium">Upload & Sync</p>
                  <p className="text-sm text-gray-600">
                    Upload your updated Excel file and click "Sync Inventory"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <div>
                  <p className="font-medium">Check Results</p>
                  <p className="text-sm text-gray-600">
                    Review the sync results and fix any errors if needed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
} 