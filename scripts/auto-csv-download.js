#!/usr/bin/env node

const cron = require('cron');
const fs = require('fs');
const path = require('path');

console.log('🕐 Starting automatic CSV download scheduler...');

// Configuration
const DOWNLOAD_INTERVAL = '0 */4 * * *'; // Every 4 hours
const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');
const DOWNLOADS_DIR = path.join(__dirname, '..', 'downloads');

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// CSV download function
async function downloadOrdersCSV() {
  try {
    console.log('📊 Starting automatic CSV download...');
    
    // Check if orders file exists
    if (!fs.existsSync(ORDERS_FILE)) {
      console.log('❌ Orders file not found:', ORDERS_FILE);
      return;
    }

    // Read orders data
    const ordersData = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    
    if (!ordersData || ordersData.length === 0) {
      console.log('ℹ️ No orders found to export');
      return;
    }

    // Create CSV content
    const csvContent = createCSVContent(ordersData);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `nurvi-jewels-orders-${timestamp}.csv`;
    const filepath = path.join(DOWNLOADS_DIR, filename);
    
    // Write CSV file
    fs.writeFileSync(filepath, csvContent, 'utf8');
    
    console.log(`✅ CSV downloaded successfully: ${filename}`);
    console.log(`📍 Location: ${filepath}`);
    console.log(`📊 Orders exported: ${ordersData.length}`);
    
    // Clean up old CSV files (keep only last 30 days)
    cleanupOldFiles();
    
  } catch (error) {
    console.error('❌ Error downloading CSV:', error);
  }
}

function createCSVContent(orders) {
  // CSV Headers
  const headers = [
    'Order ID',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Order Date',
    'Total Amount (₹)',
    'Items',
    'Shipping Address',
    'Payment ID',
    'Payment Status',
    'Order Status',
    'Tracking Number',
    'Estimated Delivery',
    'Notes',
    'Created At',
    'Updated At'
  ];

  // Create CSV rows
  const rows = orders.map(order => [
    `"${order.orderId || ''}"`,
    `"${order.customerName || ''}"`,
    `"${order.customerEmail || ''}"`,
    `"${order.customerPhone || ''}"`,
    `"${order.orderDate || ''}"`,
    `"${order.totalAmount || ''}"`,
    `"${order.items ? order.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ') : ''}"`,
    `"${order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}` : ''}"`,
    `"${order.paymentId || ''}"`,
    `"${order.paymentStatus || ''}"`,
    `"${order.orderStatus || ''}"`,
    `"${order.trackingNumber || ''}"`,
    `"${order.estimatedDelivery || ''}"`,
    `"${order.notes || ''}"`,
    `"${order.createdAt || ''}"`,
    `"${order.updatedAt || ''}"`
  ]);

  // Combine headers and rows
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

function cleanupOldFiles() {
  try {
    const files = fs.readdirSync(DOWNLOADS_DIR);
    const csvFiles = files.filter(file => file.startsWith('nurvi-jewels-orders-') && file.endsWith('.csv'));
    
    // Keep only files from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    csvFiles.forEach(file => {
      const filepath = path.join(DOWNLOADS_DIR, file);
      const stats = fs.statSync(filepath);
      
      if (stats.mtime < thirtyDaysAgo) {
        fs.unlinkSync(filepath);
        console.log(`🗑️ Cleaned up old file: ${file}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error cleaning up old files:', error);
  }
}

// Set up cron job
const job = new cron.CronJob(DOWNLOAD_INTERVAL, downloadOrdersCSV, null, true, 'Asia/Kolkata');

console.log('✅ Automatic CSV download scheduler started!');
console.log(`⏰ Schedule: Every 4 hours`);
console.log(`📂 Download location: ${DOWNLOADS_DIR}`);
console.log('🔄 Scheduler is running...');

// Also run immediately on startup
downloadOrdersCSV();

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n⏹️ Stopping automatic CSV scheduler...');
  job.stop();
  process.exit(0);
});

// Export for use as module
module.exports = { downloadOrdersCSV }; 