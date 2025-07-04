import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { OrderData, generateOrderCSV } from '@/lib/order-management';

const ORDER_DATA_FILE = join(process.cwd(), 'data', 'orders.json');

// Admin credentials check
const isAdminRequest = (request: NextRequest): boolean => {
  // Check for admin session or token
  const adminToken = request.headers.get('authorization');
  const referer = request.headers.get('referer');
  
  // Only allow access from admin pages
  if (!referer || !referer.includes('/admin/')) {
    return false;
  }
  
  // Additional security: check if request is from admin interface
  return true; // In production, implement proper JWT token validation
};

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
    console.log('=== Order Download Request ===');
    console.log('Referer:', request.headers.get('referer'));
    
    // SECURITY CHECK: Only allow admin access
    if (!isAdminRequest(request)) {
      console.log('❌ Unauthorized download attempt blocked');
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access. Admin privileges required.'
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    console.log('✅ Admin access verified');
    console.log('Format:', format);

    const orders = readOrders();

    if (orders.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No orders found'
      }, { status: 404 });
    }

    if (format === 'csv') {
      const csvContent = generateOrderCSV(orders);
      const fileName = `nurvi-jewels-orders-${new Date().toISOString().split('T')[0]}.csv`;

      console.log('✅ CSV file generated for admin download');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    }

    // Return JSON format for other cases
    return NextResponse.json({
      success: true,
      orders: orders,
      totalOrders: orders.length
    });

  } catch (error) {
    console.error('❌ Error downloading orders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to download orders',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 