"use client"

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface DragDropUploaderProps {
  onFilesUploaded: (filePaths: string[]) => void;
  category?: string;
  maxFiles?: number;
  existingImages?: string[];
  className?: string;
}

export default function DragDropUploader({
  onFilesUploaded,
  category = 'general',
  maxFiles = 10,
  existingImages = [],
  className = ''
}: DragDropUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(existingImages);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload only image files",
        variant: "destructive",
      });
      return;
    }

    if (uploadedFiles.length + imageFiles.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    setPreviewFiles(prev => [...prev, ...imageFiles]);
  };

  const uploadFiles = async () => {
    if (previewFiles.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      previewFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('category', category);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const newUploadedFiles = [...uploadedFiles, ...result.files];
        setUploadedFiles(newUploadedFiles);
        setPreviewFiles([]);
        onFilesUploaded(newUploadedFiles);
        
        toast({
          title: "Upload Successful",
          description: result.message,
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removePreviewFile = (index: number) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (index: number) => {
    const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newUploadedFiles);
    onFilesUploaded(newUploadedFiles);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drag & Drop Area */}
      <Card 
        className={`relative border-2 border-dashed p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`p-4 rounded-full ${
              dragActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <Upload className="h-8 w-8" />
            </div>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {dragActive ? 'Drop files here' : 'Drag & drop images here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or <button 
                type="button"
                onClick={onButtonClick}
                className="text-primary hover:text-primary/80 font-medium"
              >
                browse files
              </button>
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>Maximum {maxFiles} files • JPG, PNG, GIF up to 10MB each</p>
          </div>
        </div>
      </Card>

      {/* Preview Files (Not Uploaded Yet) */}
      {previewFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Ready to Upload ({previewFiles.length})</h4>
            <Button 
              onClick={uploadFiles}
              disabled={uploading}
              className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white"
            >
              {uploading ? 'Uploading...' : 'Upload All'}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {previewFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePreviewFile(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate" title={file.name}>
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <h4 className="font-medium text-gray-900">Uploaded Images ({uploadedFiles.length})</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploadedFiles.map((filePath, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={filePath}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeUploadedFile(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 right-2 p-1 bg-green-500 text-white rounded-full">
                  <Check className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
