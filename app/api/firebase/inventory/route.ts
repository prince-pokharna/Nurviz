import { NextRequest, NextResponse } from 'next/server'
import { FirebaseDatabase } from '@/lib/firebase-database'

export async function GET(request: NextRequest) {
  try {
    const inventory = await FirebaseDatabase.getInventory()
    
    return NextResponse.json({
      success: true,
      data: inventory,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch inventory',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    
    const productId = await FirebaseDatabase.addProduct(productData)
    
    return NextResponse.json({
      success: true,
      productId,
      message: 'Product added successfully'
    })
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
