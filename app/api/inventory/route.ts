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

// Helper function to transform product data for consistency
const transformProduct = (product: any): Product => {
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
    // FIXED: Properly map sizes and colors from the correct fields
    sizes: stringToArray(product.sizes || product.sizes_available || []),
    colors: stringToArray(product.colors || product.colors_available || []),
    style: product.style || "",
    occasion: product.occasion || "",
    features: stringToArray(product.features || []),
    rating: product.rating || 0,
    reviews: product.reviews || product.reviews_count || 0,
    inStock: product.inStock || product.in_stock === 1 || true,
    isNew: product.isNew || product.is_new === 1 || false,
    isSale: product.isSale || product.is_sale === 1 || (product.originalPrice && product.originalPrice > product.price),
    sku: product.sku || "",
    brand: product.brand || "Nurvi Jewel",
    collection: product.collection || "",
    tags: stringToArray(product.tags || product.collection || []),
    createdAt: product.createdAt || product.created_at || "",
    updatedAt: product.updatedAt || product.updated_at || ""
  }
}

export async function GET() {
  try {
    console.log('🔄 Fetching inventory data...');
    
    // Get inventory data
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

    // Transform all products to ensure consistency
    const transformedData = {
      all: inventory.all.map(transformProduct),
      featured: (inventory.featured || []).map(transformProduct),
      collections: (inventory.collections || []).map(transformProduct),
      categories: {
        necklaces: (inventory.categories?.necklaces || inventory.necklaces || []).map(transformProduct),
        rings: (inventory.categories?.rings || inventory.rings || []).map(transformProduct),
        earrings: (inventory.categories?.earrings || inventory.earrings || []).map(transformProduct),
        bracelets: (inventory.categories?.bracelets || inventory.bracelets || []).map(transformProduct),
        anklets: (inventory.categories?.anklets || inventory.anklets || []).map(transformProduct)
      },
      metadata: {
        lastUpdated: new Date().toISOString(),
        totalProducts: inventory.all?.length || 0,
        environment: process.env.VERCEL ? 'vercel' : 'local',
        cacheBreaker: Date.now()
      }
    };

    console.log(`✅ Successfully fetched ${transformedData.all.length} products`);
    console.log(`📊 Sample product sizes: ${transformedData.all[0]?.sizes?.join(', ') || 'None'}`);
    console.log(`📊 Sample product colors: ${transformedData.all[0]?.colors?.join(', ') || 'None'}`);
    console.log(`⏰ Inventory last updated: ${new Date().toISOString()}`);
    
    return NextResponse.json(transformedData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString()
      }
    });
    
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