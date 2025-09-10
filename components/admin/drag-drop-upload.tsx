"use client"

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

interface FileUpload {
  id: string
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  url?: string
}

interface DragDropUploadProps {
  onUploadComplete: (urls: string[]) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  existingImages?: string[]
}

export default function DragDropUpload({
  onUploadComplete,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  existingImages = []
}: DragDropUploadProps) {
  const [uploads, setUploads] = useState<FileUpload[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use ${acceptedTypes.join(', ')}.`
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB.`
    }

    return null
  }

  const createFileUpload = (file: File): FileUpload => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }
  }

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const totalFiles = uploads.length + existingImages.length + fileArray.length

    if (totalFiles > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed. You can upload ${maxFiles - uploads.length - existingImages.length} more files.`,
        variant: "destructive",
      })
      return
    }

    const newUploads: FileUpload[] = []
    const errors: string[] = []

    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        newUploads.push(createFileUpload(file))
      }
    })

    if (errors.length > 0) {
      toast({
        title: "Some files were rejected",
        description: errors.join('\n'),
        variant: "destructive",
      })
    }

    if (newUploads.length > 0) {
      setUploads(prev => [...prev, ...newUploads])
    }
  }, [uploads.length, existingImages.length, maxFiles, toast])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFiles])

  const removeUpload = (id: string) => {
    setUploads(prev => {
      const upload = prev.find(u => u.id === id)
      if (upload && upload.preview) {
        URL.revokeObjectURL(upload.preview)
      }
      return prev.filter(u => u.id !== id)
    })
  }

  const simulateUpload = async (upload: FileUpload): Promise<string> => {
    // Simulate upload progress
    const updateProgress = (progress: number) => {
      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { ...u, progress, status: 'uploading' } : u
      ))
    }

    // Simulate upload with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      updateProgress(i)
    }

    // In a real implementation, you would upload to your storage service here
    // For now, we'll just return a placeholder URL
    const mockUrl = `/images/products/uploaded/${upload.file.name}`
    
    setUploads(prev => prev.map(u => 
      u.id === upload.id 
        ? { ...u, status: 'success', progress: 100, url: mockUrl }
        : u
    ))

    return mockUrl
  }

  const uploadAll = async () => {
    const pendingUploads = uploads.filter(u => u.status === 'pending')
    if (pendingUploads.length === 0) return

    setIsUploading(true)

    try {
      const uploadPromises = pendingUploads.map(upload => simulateUpload(upload))
      const urls = await Promise.all(uploadPromises)
      
      onUploadComplete(urls)
      
      toast({
        title: "Upload completed",
        description: `Successfully uploaded ${urls.length} files`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Some files failed to upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const retryUpload = async (id: string) => {
    const upload = uploads.find(u => u.id === id)
    if (!upload) return

    try {
      const url = await simulateUpload(upload)
      onUploadComplete([url])
    } catch (error) {
      setUploads(prev => prev.map(u => 
        u.id === id ? { ...u, status: 'error', error: 'Upload failed' } : u
      ))
    }
  }

  const pendingCount = uploads.filter(u => u.status === 'pending').length
  const successCount = uploads.filter(u => u.status === 'success').length
  const errorCount = uploads.filter(u => u.status === 'error').length

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <Upload className={`h-12 w-12 mx-auto mb-4 ${
            isDragOver ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop images here or click to browse
          </h3>
          <p className="text-gray-600 mb-4">
            Support for {acceptedTypes.join(', ')} up to {maxFileSize}MB each
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {existingImages.length + uploads.length} / {maxFiles} files
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={existingImages.length + uploads.length >= maxFiles}
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Upload Status */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Files to upload</h4>
              <div className="flex gap-1">
                {pendingCount > 0 && (
                  <Badge variant="secondary">{pendingCount} pending</Badge>
                )}
                {successCount > 0 && (
                  <Badge className="bg-green-100 text-green-800">{successCount} uploaded</Badge>
                )}
                {errorCount > 0 && (
                  <Badge variant="destructive">{errorCount} failed</Badge>
                )}
              </div>
            </div>
            {pendingCount > 0 && (
              <Button
                onClick={uploadAll}
                disabled={isUploading}
                size="sm"
              >
                Upload All ({pendingCount})
              </Button>
            )}
          </div>

          {/* File List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploads.map((upload) => (
              <Card key={upload.id} className="relative">
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-2 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={upload.preview}
                      alt={upload.file.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeUpload(upload.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium truncate" title={upload.file.name}>
                      {upload.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    
                    {upload.status === 'uploading' && (
                      <div className="space-y-1">
                        <Progress value={upload.progress} className="h-2" />
                        <p className="text-xs text-gray-500">{upload.progress}%</p>
                      </div>
                    )}
                    
                    {upload.status === 'success' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Uploaded</span>
                      </div>
                    )}
                    
                    {upload.status === 'error' && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs">Failed</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryUpload(upload.id)}
                          className="w-full"
                        >
                          Retry
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Current Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {existingImages.map((image, index) => (
              <div key={index} className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Image Upload Tips:</strong>
          <ul className="mt-2 list-disc list-inside text-sm space-y-1">
            <li>Use high-quality images with good lighting</li>
            <li>Recommended resolution: 1000x1000 pixels or higher</li>
            <li>First image will be used as the main product image</li>
            <li>Images will be automatically optimized for web</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
