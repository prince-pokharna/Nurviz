import { NextRequest, NextResponse } from 'next/server'
import { FirebaseDatabase } from '@/lib/firebase-database'

export async function GET(request: NextRequest) {
  try {
    const orders = await FirebaseDatabase.getOrders()
    
    return NextResponse.json({
      success: true,
      data: orders,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    const orderId = await FirebaseDatabase.addOrder(orderData)
    
    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order saved successfully'
    })
  } catch (error) {
    console.error('Error saving order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
