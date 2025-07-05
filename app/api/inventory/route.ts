import { NextResponse } from 'next/server'
import { getInventory } from '@/lib/database'

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
const transformProduct = (product: any): Product => {
  // TEMPORARY WORKAROUND: The Excel file has colors and sizes in wrong columns
  // Swap the data to fix the display issue
  const correctColors = stringToArray(product.length_size || product.sizes_available || product.size)
  const correctSizes = stringToArray(product.colors_available || product.sizes || product.colors)
  
  return {
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
    sizes: correctSizes,
    colors: correctColors,
    style: product.style || "",
    occasion: product.occasion || "",
    features: stringToArray(product.features || product.occasion),
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
  }
}

export async function GET() {
  try {
    console.log('🔄 Fetching inventory data...');
    
    // Use the fallback database system
    const inventory = await getInventory();
    
    if (!inventory || !inventory.all) {
      console.log('⚠️  No inventory data found, returning empty arrays');
      return NextResponse.json({
        all: [],
        featured: [],
        collections: [],
        categories: {
          necklaces: [],
          rings: [],
          earrings: [],
          bracelets: [],
          anklets: []
        }
      });
    }

    console.log(`✅ Successfully fetched ${inventory.all.length} products`);
    return NextResponse.json(inventory);
    
  } catch (error) {
    console.error('❌ Error fetching inventory:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch inventory',
        all: [],
        featured: [],
        collections: [],
        categories: {
          necklaces: [],
          rings: [],
          earrings: [],
          bracelets: [],
          anklets: []
        }
      },
      { status: 500 }
    );
  }
} 