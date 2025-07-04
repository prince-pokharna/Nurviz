import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  description: string
  material?: string
  gemstone?: string
  weight?: number
  sizes: string[]
  colors: string[]
  style?: string
  occasion?: string
  features: string[]
  rating: number
  reviews: number
  inStock: boolean
  isNew: boolean
  isSale: boolean
  sku?: string
  brand?: string
  collection?: string
  tags: string[]
  createdAt?: string
  updatedAt?: string
}

// Helper function to safely convert string to array
const stringToArray = (str: any): string[] => {
  if (Array.isArray(str)) return str
  if (typeof str === 'string' && str.trim()) {
    return str.split('|').map(item => item.trim()).filter(item => item)
  }
  return []
}

// Helper function to transform product data
const transformProduct = (product: any): Product => ({
  id: product.id,
  name: product.name,
  category: product.category,
  price: product.price || 0,
  originalPrice: product.originalPrice || product.original_price || 0,
  image: product.image || product.main_image || "/placeholder.svg",
  description: product.description || "",
  material: product.material || "",
  gemstone: product.gemstone || "",
  weight: product.weight || product.weight_grams || 0,
  sizes: stringToArray(product.size || product.sizes || product.sizes_available || product.length_size),
  colors: stringToArray(product.colors || product.colors_available),
  style: product.style || "",
  occasion: product.style || "",
  features: stringToArray(product.occasion || product.features), // Fix: features are in occasion field
  rating: product.rating || 0,
  reviews: product.reviews || product.reviews_count || 0,
  inStock: product.inStock || product.in_stock === 1 || true,
  isNew: product.isNew || product.is_new === 1 || false,
  isSale: product.isSale || product.is_sale === 1 || (product.originalPrice && product.originalPrice > product.price),
  sku: product.sku || "",
  brand: product.brand || "Nurvi Jewel",
  collection: product.collection || "",
  tags: stringToArray(product.tags || product.collection),
  createdAt: product.createdAt || product.created_at || "",
  updatedAt: product.updatedAt || product.updated_at || ""
})

export async function GET() {
  try {
    // Try to load from JSON file first
    const inventoryPath = path.join(process.cwd(), 'data', 'inventory.json')
    
    if (fs.existsSync(inventoryPath)) {
      const rawData = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'))
      
      // Transform all products to ensure proper data structure
      const transformedProducts = rawData.all.map(transformProduct)
      
             // Group products by category
       const data = {
         all: transformedProducts,
         featured: transformedProducts.filter((p: Product) => p.isNew || p.isSale).slice(0, 6),
         rings: transformedProducts.filter((p: Product) => p.category.toLowerCase().includes('ring')),
         necklaces: transformedProducts.filter((p: Product) => p.category.toLowerCase().includes('necklace')),
         earrings: transformedProducts.filter((p: Product) => p.category.toLowerCase().includes('earring')),
         bracelets: transformedProducts.filter((p: Product) => p.category.toLowerCase().includes('bracelet')),
         anklets: transformedProducts.filter((p: Product) => p.category.toLowerCase().includes('anklet')),
         collections: transformedProducts,
         onSale: transformedProducts.filter((p: Product) => p.isSale),
         newArrivals: transformedProducts.filter((p: Product) => p.isNew),
         inStock: transformedProducts.filter((p: Product) => p.inStock)
       }
      
      return NextResponse.json(data)
    }
    
    // If JSON doesn't exist, create empty structure
    const emptyData = {
      all: [],
      featured: [],
      rings: [],
      necklaces: [],
      earrings: [],
      bracelets: [],
      anklets: [],
      collections: [],
      onSale: [],
      newArrivals: [],
      inStock: []
    }
    
    return NextResponse.json(emptyData)
  } catch (error) {
    console.error('Error loading inventory:', error)
    
    // Fallback to empty data if anything fails
    const emptyData = {
      all: [],
      featured: [],
      rings: [],
      necklaces: [],
      earrings: [],
      bracelets: [],
      anklets: [],
      collections: [],
      onSale: [],
      newArrivals: [],
      inStock: []
    }
    return NextResponse.json(emptyData)
  }
} 