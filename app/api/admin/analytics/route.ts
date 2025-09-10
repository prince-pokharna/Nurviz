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

// GET /api/admin/analytics - Get analytics data
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

    // Get basic analytics
    const analytics = await productManager.getProductAnalytics()
    const lowStockProducts = await productManager.getLowStockProducts()
    const products = await productManager.getAllProducts()

    // Calculate additional metrics
    const newProductsThisMonth = products.filter(product => {
      const addedDate = new Date(product.dateAdded)
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return addedDate >= thisMonth
    }).length

    const recentlyUpdated = products.filter(product => {
      const updatedDate = new Date(product.lastUpdated)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return updatedDate >= weekAgo
    }).length

    // Top categories by count
    const categoryStats = Object.entries(analytics.categoryBreakdown)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    // Price distribution
    const priceRanges = {
      'Under ₹500': products.filter(p => p.price < 500).length,
      '₹500 - ₹1000': products.filter(p => p.price >= 500 && p.price < 1000).length,
      '₹1000 - ₹2000': products.filter(p => p.price >= 1000 && p.price < 2000).length,
      '₹2000 - ₹5000': products.filter(p => p.price >= 2000 && p.price < 5000).length,
      'Above ₹5000': products.filter(p => p.price >= 5000).length,
    }

    // Stock status distribution
    const stockStatus = {
      inStock: analytics.inStockProducts,
      outOfStock: analytics.outOfStockProducts,
      lowStock: analytics.lowStockProducts,
    }

    // Material breakdown
    const materialBreakdown = products.reduce((acc, product) => {
      const material = product.material || 'Unknown'
      acc[material] = (acc[material] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentProducts = products.filter(p => 
      new Date(p.dateAdded) >= thirtyDaysAgo || new Date(p.lastUpdated) >= thirtyDaysAgo
    )

    // Sales insights (mock data for now - would come from orders)
    const salesInsights = {
      topSellingCategories: categoryStats.slice(0, 5),
      averageOrderValue: 1250,
      conversionRate: 2.5,
      popularPriceRange: '₹500 - ₹1000',
    }

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          ...analytics,
          newProductsThisMonth,
          recentlyUpdated,
        },
        categoryStats,
        priceRanges,
        stockStatus,
        materialBreakdown,
        lowStockProducts: lowStockProducts.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          stock: product.inventory.stock,
          threshold: product.inventory.lowStockThreshold,
          image: product.image,
        })),
        recentActivity: recentProducts.slice(0, 10).map(product => ({
          id: product.id,
          name: product.name,
          action: new Date(product.lastUpdated) > new Date(product.dateAdded) ? 'updated' : 'added',
          date: product.lastUpdated,
          category: product.category,
        })),
        salesInsights,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
