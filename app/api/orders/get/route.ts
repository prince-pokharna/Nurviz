import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { OrderData } from '@/lib/order-management';

const ORDER_DATA_FILE = join(process.cwd(), 'data', 'orders.json');

// Read existing orders
const readOrders = (): OrderData[] => {
  if (!existsSync(ORDER_DATA_FILE)) {
    return [];
  }
  try {
    const data = readFileSync(ORDER_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders file:', error);
    return [];
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const customerPhone = searchParams.get('phone');
    const customerEmail = searchParams.get('email');

    console.log('=== Getting Order Data ===');
    console.log('Order ID:', orderId);
    console.log('Customer Phone:', customerPhone);
    console.log('Customer Email:', customerEmail);

    const orders = readOrders();

    if (orderId) {
      // Get specific order by ID
      const order = orders.find(o => o.orderId === orderId);
      if (!order) {
        return NextResponse.json({
          success: false,
          error: 'Order not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        order: order
      });
    }

    if (customerPhone || customerEmail) {
      // Get orders by customer phone or email
      const customerOrders = orders.filter(o => 
        (customerPhone && o.customerPhone === customerPhone) ||
        (customerEmail && o.customerEmail === customerEmail)
      );

      return NextResponse.json({
        success: true,
        orders: customerOrders
      });
    }

    // Get all orders (for admin)
    return NextResponse.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('❌ Error getting orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get orders',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 