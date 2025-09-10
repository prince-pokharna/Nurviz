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

// POST /api/admin/products/[id]/duplicate - Duplicate product
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const payload = await verifyAdminAuth(request)
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const duplicatedProduct = await productManager.duplicateProduct(params.id)
    
    if (!duplicatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product: duplicatedProduct,
      message: 'Product duplicated successfully',
    })
  } catch (error) {
    console.error('Error duplicating product:', error)
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
