import { NextRequest, NextResponse } from 'next/server'
import { SimpleInventoryManager } from '@/lib/simple-inventory'
import { verifyToken } from '@/lib/admin-auth'

const inventory = new SimpleInventoryManager()

// Verify admin authentication
async function verifyAdminAuth(request: NextRequest) {
  const cookieToken = request.cookies.get('admin-token')?.value
  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  
  const token = cookieToken || bearerToken
  if (!token) return null
  
  return verifyToken(token)
}

// GET /api/admin/simple-products - Get all products
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await verifyAdminAuth(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const products = await inventory.getAllProducts()
    const stats = await inventory.getStockStats()
    const lowStockProducts = await inventory.getLowStockProducts()
    
    return NextResponse.json({
      success: true,
      products,
      stats,
      lowStockProducts,
      total: products.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/simple-products - Update product or stock
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await verifyAdminAuth(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, updates } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // If it's just a stock update, use the simple stock update method
    if (updates.stock !== undefined && Object.keys(updates).length === 1) {
      const success = await inventory.updateStock(id, updates.stock)
      if (!success) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
    } else {
      // Full product update
      const success = await inventory.updateProduct(id, updates)
      if (!success) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
    }

    // Get updated product
    const updatedProduct = await inventory.getProduct(id)
    
    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/simple-products/bulk - Bulk update stock
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await verifyAdminAuth(request)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { updates } = await request.json()
    
    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'Updates must be an array' }, { status: 400 })
    }

    const success = await inventory.bulkUpdateStock(updates)
    if (!success) {
      return NextResponse.json({ error: 'Bulk update failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} products`,
      updatedCount: updates.length
    })
  } catch (error) {
    console.error('Error in bulk update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
