import { NextRequest, NextResponse } from 'next/server'
import { ProductManager } from '@/lib/product-manager'
import { verifyToken } from '@/lib/admin-auth'

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

// PUT /api/admin/products/bulk - Bulk update products
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await verifyAdminAuth(request)
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productIds, updates } = await request.json()
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      )
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Updates are required' },
        { status: 400 }
      )
    }

    // Handle special cases for bulk updates
    const bulkUpdates = productIds.map(id => {
      let productUpdates = { ...updates }

      // Handle percentage price updates
      if (updates.price && typeof updates.price === 'number' && updates.priceUpdateType === 'percentage') {
        // This would require getting the current product to calculate new price
        // For now, we'll handle this in the frontend or add a special endpoint
        delete productUpdates.priceUpdateType
      }

      return {
        id,
        data: productUpdates
      }
    })

    const updatedProducts = await productManager.bulkUpdateProducts(bulkUpdates)
    
    return NextResponse.json({
      success: true,
      products: updatedProducts,
      message: `Updated ${updatedProducts.length} products`,
    })
  } catch (error) {
    console.error('Error in bulk update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/bulk - Bulk delete products
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await verifyAdminAuth(request)
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productIds } = await request.json()
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      )
    }

    // Delete products one by one (could be optimized)
    const deletePromises = productIds.map(id => productManager.deleteProduct(id))
    const results = await Promise.all(deletePromises)
    
    const successCount = results.filter(Boolean).length
    
    return NextResponse.json({
      success: true,
      deletedCount: successCount,
      message: `Deleted ${successCount} products`,
    })
  } catch (error) {
    console.error('Error in bulk delete:', error)
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
      'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
