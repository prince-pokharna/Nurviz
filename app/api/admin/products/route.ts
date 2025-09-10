import { NextRequest, NextResponse } from 'next/server'
import { ProductManager, ProductFilters } from '@/lib/product-manager'
import { verifyToken } from '@/lib/admin-auth'
import { ADMIN_PERMISSIONS } from '@/lib/admin-config'

const productManager = new ProductManager()

// Middleware to verify admin authentication
async function verifyAdminAuth(request: NextRequest) {
  const cookieToken = request.cookies.get('admin-token')?.value
  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  
  const token = cookieToken || bearerToken
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}

// GET /api/admin/products - Get all products with filters
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await verifyAdminAuth(request)
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    const filters: ProductFilters = {
      category: searchParams.get('category') || undefined,
      inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'name',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
    }

    // Parse price range
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice && maxPrice) {
      filters.priceRange = [parseFloat(minPrice), parseFloat(maxPrice)]
    }

    const products = await productManager.searchProducts(filters)
    
    return NextResponse.json({
      success: true,
      products,
      total: products.length,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await verifyAdminAuth(request)
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const productData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'category', 'description', 'material', 'sku']
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Set default values
    const newProduct = {
      ...productData,
      image: productData.image || '/placeholder.jpg',
      images: productData.images || [productData.image || '/placeholder.jpg'],
      colors: productData.colors || [],
      sizes: productData.sizes || [],
      rating: productData.rating || 0,
      reviews: productData.reviews || 0,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      isNew: productData.isNew || false,
      isSale: productData.isSale || false,
      careInstructions: productData.careInstructions || 'Clean with jewelry cloth, store separately',
      brand: productData.brand || 'Nurvi Jewel',
      tags: productData.tags || '',
      inventory: {
        stock: productData.inventory?.stock || 0,
        lowStockThreshold: productData.inventory?.lowStockThreshold || 5,
        sizes: productData.inventory?.sizes || [],
      },
    }

    const product = await productManager.createProduct(newProduct)
    
    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully',
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
