import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'generate') {
      // Manually trigger Excel generation via child process
      console.log('📊 Manually triggering Excel order book generation...');
      
      try {
        const { stdout, stderr } = await execAsync(`node "${path.join(process.cwd(), 'scripts', 'daily-excel-order-book.js')}"`);
        
        if (stderr) {
          console.error('Script stderr:', stderr);
        }
        
        return NextResponse.json({
          success: true,
          message: 'Excel order book generated successfully',
          output: stdout
        });
      } catch (error) {
        throw new Error(`Excel generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (action === 'list') {
      // List available order book files
      const orderBooksDir = path.join(process.cwd(), 'order-books');
      
      try {
        const files = await fs.readdir(orderBooksDir);
        const excelFiles = files
          .filter(file => file.endsWith('.xlsx'))
          .map(file => {
            const filePath = path.join(orderBooksDir, file);
            return {
              name: file,
              path: filePath,
              date: file.includes('Order-Book-') ? file.split('Order-Book-')[1].replace('.xlsx', '') : 'Unknown'
            };
          })
          .sort((a, b) => b.date.localeCompare(a.date));

        return NextResponse.json({
          success: true,
          files: excelFiles,
          count: excelFiles.length
        });
      } catch (error) {
        return NextResponse.json({
          success: true,
          files: [],
          count: 0,
          message: 'No order books directory found yet'
        });
      }
    }

    // Default: Return order book status
    const ordersFile = path.join(process.cwd(), 'data', 'orders.json');
    
    let ordersCount = 0;
    let totalRevenue = 0;
    let lastOrderDate = null;

    try {
      const ordersData = await fs.readFile(ordersFile, 'utf8');
      const orders = JSON.parse(ordersData);
      
      ordersCount = orders.length;
      totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
      
      if (orders.length > 0) {
        const sortedOrders = orders.sort((a: any, b: any) => 
          new Date(b.createdAt || b.orderDate).getTime() - new Date(a.createdAt || a.orderDate).getTime()
        );
        lastOrderDate = sortedOrders[0].createdAt || sortedOrders[0].orderDate;
      }
    } catch (error) {
      console.log('No orders file found');
    }

    // Check if master order book exists
    const masterOrderBook = path.join(process.cwd(), 'Book1.xlsx');
    let masterBookExists = false;
    let masterBookLastModified = null;

    try {
      const stats = await fs.stat(masterOrderBook);
      masterBookExists = true;
      masterBookLastModified = stats.mtime.toISOString();
    } catch (error) {
      // File doesn't exist
    }

    return NextResponse.json({
      success: true,
      statistics: {
        totalOrders: ordersCount,
        totalRevenue: totalRevenue,
        lastOrderDate: lastOrderDate,
        masterBookExists: masterBookExists,
        masterBookLastModified: masterBookLastModified
      },
      systemStatus: {
        dailyUpdateEnabled: true,
        nextUpdate: 'Daily at 00:00 IST',
        backupRetention: '90 days'
      }
    });

  } catch (error) {
    console.error('❌ Error in order book API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process order book request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'generate_now') {
      // Force generate Excel order book immediately
      console.log('🔄 Force generating Excel order book...');
      
      const scriptPath = path.join(process.cwd(), 'scripts', 'daily-excel-order-book.js');
      
      // Use child process to run the script
      const { stdout, stderr } = await execAsync(`node "${scriptPath}"`);
      
      if (stderr) {
        console.error('Script stderr:', stderr);
      }
      
      console.log('Script output:', stdout);
      
      return NextResponse.json({
        success: true,
        message: 'Excel order book generation initiated',
        output: stdout
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Error in POST order book API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute order book action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
