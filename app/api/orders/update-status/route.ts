import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync } from 'fs';
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

// Save orders to file
const saveOrders = (orders: OrderData[]) => {
  try {
    writeFileSync(ORDER_DATA_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving orders file:', error);
    throw error;
  }
};

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      orderStatus,
      trackingNumber,
      notes
    } = body;

    console.log('=== Updating Order Status ===');
    console.log('Order ID:', orderId);
    console.log('New Status:', orderStatus);
    console.log('Tracking Number:', trackingNumber);

    if (!orderId || !orderStatus) {
      return NextResponse.json({
        success: false,
        error: 'Order ID and status are required'
      }, { status: 400 });
    }

    const orders = readOrders();
    const orderIndex = orders.findIndex(order => order.orderId === orderId);

    if (orderIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 });
    }

    // Update order data
    orders[orderIndex] = {
      ...orders[orderIndex],
      orderStatus,
      trackingNumber: trackingNumber || orders[orderIndex].trackingNumber,
      notes: notes || orders[orderIndex].notes,
      updatedAt: new Date().toISOString(),
    };

    // Save updated orders
    saveOrders(orders);

    console.log('✅ Order status updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: orders[orderIndex]
    });

  } catch (error) {
    console.error('❌ Error updating order status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update order status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 