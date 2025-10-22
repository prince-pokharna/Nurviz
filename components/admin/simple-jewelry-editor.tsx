"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

const JEWELRY_CATEGORIES = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Anklets', 'Sets', 'Accessories'];

interface SimpleJewelryEditorProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  isCreating?: boolean;
}

export default function SimpleJewelryEditor({ 
  product, 
  isOpen, 
  onClose, 
  onSave,
  isCreating = false 
}: SimpleJewelryEditorProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(product || {});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (files: FileList) => {
    try {
      setUploading(true);
      
      // Validate files before upload
      const validFiles = Array.from(files).filter(file => {
        // Check if it's an image
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File",
            description: `${file.name} is not an image file`,
            variant: "destructive",
          });
          return false;
        }
        
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast({
            title: "File Too Large",
            description: `${file.name} exceeds 10MB limit`,
            variant: "destructive",
          });
          return false;
        }
        
        return true;
      });

      if (validFiles.length === 0) {
        toast({
          title: "No Valid Files",
          description: "Please select valid image files (JPG, PNG, GIF, WebP)",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }
      
      // Create form data for upload
      const uploadFormData = new FormData();
      validFiles.forEach(file => {
        uploadFormData.append('files', file);
      });
      
      const category = (formData.category || 'general').toLowerCase();
      uploadFormData.append('category', category);

      console.log(`Uploading ${validFiles.length} file(s) to category: ${category}`);

      // Try Cloudinary first, fallback to regular upload
      let response;
      try {
        response = await fetch('/api/admin/upload-cloudinary', {
          method: 'POST',
          credentials: 'include',
          body: uploadFormData,
        });
        
        // If Cloudinary fails, try regular upload
        if (!response.ok) {
          console.log('Cloudinary upload failed, trying regular upload...');
          response = await fetch('/api/admin/upload', {
            method: 'POST',
            credentials: 'include',
            body: uploadFormData,
          });
        }
      } catch (cloudinaryError) {
        console.log('Cloudinary not available, using regular upload');
        response = await fetch('/api/admin/upload', {
          method: 'POST',
          credentials: 'include',
          body: uploadFormData,
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.files && result.files.length > 0) {
        // Update form data with uploaded image URLs
        const currentImages = formData.images || [];
        const newImages = [...currentImages, ...result.files];
        
        setFormData((prev: any) => ({
          ...prev,
          images: newImages,
          image: newImages[0] || prev.image // Set first image as main image
        }));

        toast({
          title: "✅ Images Uploaded",
          description: `${result.count} image(s) uploaded successfully!`,
        });
      } else {
        throw new Error(result.error || result.details || 'Upload failed - no files returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "❌ Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = formData.images || [];
    const newImages = currentImages.filter((_: any, i: number) => i !== index);
    setFormData((prev: any) => ({
      ...prev,
      images: newImages,
      image: newImages[0] || '' // Update main image
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!formData.name?.trim()) {
        toast({
          title: "❌ Error",
          description: "Jewelry name is required",
          variant: "destructive",
        });
        return;
      }

      if (!formData.price || formData.price <= 0) {
        toast({
          title: "❌ Error", 
          description: "Valid price is required",
          variant: "destructive",
        });
        return;
      }

      // Prepare the updated product data
      const updatedProduct = {
        ...formData,
        lastUpdated: new Date().toISOString(),
        dateAdded: formData.dateAdded || new Date().toISOString(),
        brand: formData.brand || 'Nurvi Jewel'
      };

      // Generate ID if creating new product
      if (isCreating && (!updatedProduct.id || updatedProduct.id.startsWith('new-'))) {
        const timestamp = Date.now();
        const category = updatedProduct.category?.toLowerCase() || 'jewelry';
        updatedProduct.id = `${category}-${timestamp}`;
      }

      // Try Firebase product save first (works on Vercel), fallback to simple-update
      let response;
      try {
        response = await fetch('/api/admin/products-save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            action: isCreating ? 'add_product' : 'update_product',
            product: updatedProduct
          }),
        });
        
        // If Firebase route doesn't exist or fails, try simple-update
        if (!response.ok && response.status === 404) {
          console.log('Firebase route not found, trying simple-update...');
          response = await fetch('/api/admin/simple-update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              action: isCreating ? 'add_product' : 'update_product',
              product: updatedProduct
            }),
          });
        }
      } catch (fetchError) {
        console.log('Primary save failed, trying fallback...');
        response = await fetch('/api/admin/simple-update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            action: isCreating ? 'add_product' : 'update_product',
            product: updatedProduct
          }),
        });
      }

      if (response.ok) {
        toast({
          title: "✅ Success",
          description: `${formData.name} ${isCreating ? 'added' : 'updated'} successfully! Changes are live on website.`,
        });
        onSave(updatedProduct);
        onClose();
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to ${isCreating ? 'add' : 'update'} product`);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? 'Add New Jewelry' : `Edit ${product?.name}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] space-y-6 p-1">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Jewelry Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Royal Statement Gold Ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 2500"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 3500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  placeholder="Detailed description of the jewelry piece..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category || 'Rings'}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {JEWELRY_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.material || ''}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    placeholder="e.g., Gold Plated Brass, Sterling Silver, 14K Gold"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="weight">Weight (grams)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 15"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images (Upload 4-5 Images)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Upload Images</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleImageUpload(e.target.files);
                      }
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Select Images'}
                  </Button>
                </div>
              </div>

              {/* Current Images */}
              {formData.images && formData.images.length > 0 && (
                <div>
                  <Label>Current Images ({formData.images.length})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {formData.images.map((image: string, index: number) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Current Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.inventory?.stock || ''}
                    onChange={(e) => handleInputChange('inventory', {
                      ...formData.inventory,
                      stock: parseInt(e.target.value) || 0
                    })}
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <Label htmlFor="minimumStock">Minimum Stock Alert</Label>
                  <Input
                    id="minimumStock"
                    type="number"
                    min="0"
                    value={formData.inventory?.minimumStock || ''}
                    onChange={(e) => handleInputChange('inventory', {
                      ...formData.inventory,
                      minimumStock: parseInt(e.target.value) || 0
                    })}
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku || ''}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="e.g., RG001"
                  />
                </div>
                <div>
                  <Label htmlFor="collection">Collection</Label>
                  <Input
                    id="collection"
                    value={formData.collection || ''}
                    onChange={(e) => handleInputChange('collection', e.target.value)}
                    placeholder="e.g., Royal Collection"
                  />
                </div>
              </div>

              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={formData.inStock !== false}
                    onCheckedChange={(checked) => handleInputChange('inStock', checked)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isNew"
                    checked={formData.isNew === true}
                    onCheckedChange={(checked) => handleInputChange('isNew', checked)}
                  />
                  <Label htmlFor="isNew">New Arrival</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isSale"
                    checked={formData.isSale === true}
                    onCheckedChange={(checked) => handleInputChange('isSale', checked)}
                  />
                  <Label htmlFor="isSale">On Sale</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews & Rating (Visible to Customers)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating || ''}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 4.8"
                  />
                </div>
                <div>
                  <Label htmlFor="reviews">Reviews Count</Label>
                  <Input
                    id="reviews"
                    type="number"
                    min="0"
                    value={formData.reviews || ''}
                    onChange={(e) => handleInputChange('reviews', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 25"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customerReviews">Customer Review Text</Label>
                <Textarea
                  id="customerReviews"
                  value={formData.customerReviews || ''}
                  onChange={(e) => handleInputChange('customerReviews', e.target.value)}
                  rows={4}
                  placeholder="Enter customer review text that will be displayed on the product page..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  This review text will be shown to customers on the product page
                </p>
              </div>

              <div>
                <Label htmlFor="reviewerName">Reviewer Name</Label>
                <Input
                  id="reviewerName"
                  value={formData.reviewerName || ''}
                  onChange={(e) => handleInputChange('reviewerName', e.target.value)}
                  placeholder="e.g., Sarah J., Verified Customer"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-[#B4AFA7] to-[#8A8786] text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}