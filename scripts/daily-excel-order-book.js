#!/usr/bin/env node

const ExcelJS = require('exceljs');
const cron = require('cron');
const fs = require('fs').promises;
const path = require('path');

console.log('📊 Starting Daily Excel Order Book System...');

// Configuration
const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');
const EXCEL_OUTPUT_DIR = path.join(__dirname, '..', 'order-books');
const DAILY_SCHEDULE = '0 0 * * *'; // Daily at midnight
const BACKUP_DAYS = 90; // Keep backups for 90 days

// Ensure output directory exists
async function ensureDirectories() {
  try {
    await fs.mkdir(EXCEL_OUTPUT_DIR, { recursive: true });
    console.log('✅ Order books directory ensured');
  } catch (error) {
    console.error('❌ Error creating directories:', error);
  }
}

// Main Excel generation function
async function generateDailyOrderBook() {
  try {
    console.log('📊 Generating daily Excel order book...');
    
    // Read orders data
    const ordersData = await readOrdersData();
    
    if (ordersData.length === 0) {
      console.log('ℹ️ No orders found to export');
      return;
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'Nurvi Jewel Admin System';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Create worksheets
    await createOrdersSummarySheet(workbook, ordersData);
    await createDetailedOrdersSheet(workbook, ordersData);
    await createDailyAnalyticsSheet(workbook, ordersData);
    await createCustomerAnalyticsSheet(workbook, ordersData);
    
    // Generate filename with date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename = `Nurvi-Jewel-Order-Book-${dateStr}.xlsx`;
    const filepath = path.join(EXCEL_OUTPUT_DIR, filename);
    
    // Save the workbook
    await workbook.xlsx.writeFile(filepath);
    
    console.log(`✅ Excel order book generated successfully!`);
    console.log(`📍 Location: ${filepath}`);
    console.log(`📊 Total orders: ${ordersData.length}`);
    console.log(`💰 Total revenue: ₹${ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toLocaleString()}`);
    
    // Also update the master order book (Book1.xlsx)
    await updateMasterOrderBook(workbook);
    
    // Clean up old files
    await cleanupOldFiles();
    
    return filepath;
  } catch (error) {
    console.error('❌ Error generating Excel order book:', error);
    throw error;
  }
}

// Read orders data from JSON file
async function readOrdersData() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(data);
    
    // Sort orders by creation date (newest first)
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.log('ℹ️ No orders file found or empty orders');
    return [];
  }
}

// Create Orders Summary Sheet
async function createOrdersSummarySheet(workbook, orders) {
  const worksheet = workbook.addWorksheet('📊 Orders Summary', {
    tabColor: { argb: 'FF4472C4' }
  });
  
  // Set column widths
  worksheet.columns = [
    { header: 'Order ID', key: 'orderId', width: 20 },
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Customer Name', key: 'customerName', width: 25 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Total Amount', key: 'amount', width: 15 },
    { header: 'Payment Status', key: 'paymentStatus', width: 15 },
    { header: 'Order Status', key: 'orderStatus', width: 15 },
    { header: 'Items Count', key: 'itemsCount', width: 12 },
    { header: 'City', key: 'city', width: 15 },
    { header: 'State', key: 'state', width: 15 }
  ];
  
  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
  headerRow.alignment = { horizontal: 'center' };
  
  // Add data rows
  orders.forEach((order, index) => {
    const row = worksheet.addRow({
      orderId: order.orderId || '',
      date: formatDate(order.createdAt || order.orderDate),
      customerName: order.customerName || '',
      phone: order.customerPhone || '',
      amount: order.totalAmount || 0,
      paymentStatus: order.paymentStatus || 'pending',
      orderStatus: order.orderStatus || 'processing',
      itemsCount: order.items ? order.items.length : 0,
      city: order.shippingAddress?.city || '',
      state: order.shippingAddress?.state || ''
    });
    
    // Alternate row colors
    if (index % 2 === 1) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
    }
    
    // Format amount as currency
    row.getCell('amount').numFmt = '₹#,##0.00';
    
    // Color code payment status
    const paymentCell = row.getCell('paymentStatus');
    if (order.paymentStatus === 'completed') {
      paymentCell.font = { color: { argb: 'FF28A745' } };
    } else if (order.paymentStatus === 'failed') {
      paymentCell.font = { color: { argb: 'FFDC3545' } };
    }
    
    // Color code order status
    const orderCell = row.getCell('orderStatus');
    if (order.orderStatus === 'delivered') {
      orderCell.font = { color: { argb: 'FF28A745' } };
    } else if (order.orderStatus === 'cancelled') {
      orderCell.font = { color: { argb: 'FFDC3545' } };
    } else if (order.orderStatus === 'shipped') {
      orderCell.font = { color: { argb: 'FF007BFF' } };
    }
  });
  
  // Add borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });
  
  // Add summary statistics at the bottom
  const summaryStartRow = orders.length + 3;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const completedOrders = orders.filter(order => order.paymentStatus === 'completed').length;
  
  worksheet.addRow([]);
  worksheet.addRow(['📈 SUMMARY STATISTICS']);
  worksheet.addRow(['Total Orders:', orders.length]);
  worksheet.addRow(['Completed Orders:', completedOrders]);
  worksheet.addRow(['Total Revenue:', totalRevenue]);
  worksheet.addRow(['Average Order Value:', orders.length > 0 ? totalRevenue / orders.length : 0]);
  
  // Format summary section
  const summaryRange = worksheet.getCell(`A${summaryStartRow + 1}:B${summaryStartRow + 5}`);
  worksheet.getRow(summaryStartRow + 1).font = { bold: true, size: 12 };
  worksheet.getCell(`B${summaryStartRow + 4}`).numFmt = '₹#,##0.00';
  worksheet.getCell(`B${summaryStartRow + 5}`).numFmt = '₹#,##0.00';
}

// Create Detailed Orders Sheet
async function createDetailedOrdersSheet(workbook, orders) {
  const worksheet = workbook.addWorksheet('📋 Detailed Orders', {
    tabColor: { argb: 'FF28A745' }
  });
  
  // Set column widths
  worksheet.columns = [
    { header: 'Order ID', key: 'orderId', width: 20 },
    { header: 'Date & Time', key: 'datetime', width: 18 },
    { header: 'Customer Name', key: 'customerName', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Items Details', key: 'items', width: 40 },
    { header: 'Total Amount', key: 'amount', width: 15 },
    { header: 'Payment ID', key: 'paymentId', width: 25 },
    { header: 'Payment Status', key: 'paymentStatus', width: 15 },
    { header: 'Order Status', key: 'orderStatus', width: 15 },
    { header: 'Full Address', key: 'address', width: 50 },
    { header: 'Estimated Delivery', key: 'delivery', width: 18 },
    { header: 'Notes', key: 'notes', width: 30 }
  ];
  
  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF28A745' } };
  headerRow.alignment = { horizontal: 'center' };
  
  // Add data rows
  orders.forEach((order, index) => {
    const itemsDetails = order.items ? 
      order.items.map(item => `${item.name} (Qty: ${item.quantity}, ₹${item.price})`).join('\n') : 
      '';
    
    const fullAddress = order.shippingAddress ? 
      `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}` : 
      '';
    
    const row = worksheet.addRow({
      orderId: order.orderId || '',
      datetime: formatDateTime(order.createdAt),
      customerName: order.customerName || '',
      email: order.customerEmail || '',
      phone: order.customerPhone || '',
      items: itemsDetails,
      amount: order.totalAmount || 0,
      paymentId: order.paymentId || '',
      paymentStatus: order.paymentStatus || 'pending',
      orderStatus: order.orderStatus || 'processing',
      address: fullAddress,
      delivery: order.estimatedDelivery || '',
      notes: order.notes || ''
    });
    
    // Set row height for better readability
    row.height = 30;
    
    // Wrap text in items and address columns
    row.getCell('items').alignment = { wrapText: true, vertical: 'top' };
    row.getCell('address').alignment = { wrapText: true, vertical: 'top' };
    
    // Format amount as currency
    row.getCell('amount').numFmt = '₹#,##0.00';
    
    // Alternate row colors
    if (index % 2 === 1) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
    }
  });
  
  // Add borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });
}

// Create Daily Analytics Sheet
async function createDailyAnalyticsSheet(workbook, orders) {
  const worksheet = workbook.addWorksheet('📈 Analytics', {
    tabColor: { argb: 'FFFF6B35' }
  });
  
  // Group orders by date
  const ordersByDate = {};
  const ordersByStatus = {};
  const ordersByState = {};
  
  orders.forEach(order => {
    const date = formatDate(order.createdAt || order.orderDate);
    const status = order.orderStatus || 'processing';
    const state = order.shippingAddress?.state || 'Unknown';
    
    // By date
    if (!ordersByDate[date]) {
      ordersByDate[date] = { count: 0, revenue: 0 };
    }
    ordersByDate[date].count++;
    ordersByDate[date].revenue += order.totalAmount || 0;
    
    // By status
    if (!ordersByStatus[status]) {
      ordersByStatus[status] = { count: 0, revenue: 0 };
    }
    ordersByStatus[status].count++;
    ordersByStatus[status].revenue += order.totalAmount || 0;
    
    // By state
    if (!ordersByState[state]) {
      ordersByState[state] = { count: 0, revenue: 0 };
    }
    ordersByState[state].count++;
    ordersByState[state].revenue += order.totalAmount || 0;
  });
  
  // Add daily statistics
  worksheet.addRow(['📅 DAILY STATISTICS']);
  worksheet.addRow(['Date', 'Orders', 'Revenue']);
  
  Object.entries(ordersByDate)
    .sort(([a], [b]) => new Date(b) - new Date(a))
    .slice(0, 30) // Last 30 days
    .forEach(([date, data]) => {
      const row = worksheet.addRow([date, data.count, data.revenue]);
      row.getCell(3).numFmt = '₹#,##0.00';
    });
  
  // Add spacing
  worksheet.addRow([]);
  worksheet.addRow([]);
  
  // Add status statistics
  worksheet.addRow(['📊 ORDER STATUS BREAKDOWN']);
  worksheet.addRow(['Status', 'Count', 'Revenue']);
  
  Object.entries(ordersByStatus).forEach(([status, data]) => {
    const row = worksheet.addRow([status.toUpperCase(), data.count, data.revenue]);
    row.getCell(3).numFmt = '₹#,##0.00';
  });
  
  // Add spacing
  worksheet.addRow([]);
  worksheet.addRow([]);
  
  // Add state-wise statistics
  worksheet.addRow(['🗺️ STATE-WISE ORDERS']);
  worksheet.addRow(['State', 'Orders', 'Revenue']);
  
  Object.entries(ordersByState)
    .sort(([,a], [,b]) => b.count - a.count)
    .forEach(([state, data]) => {
      const row = worksheet.addRow([state, data.count, data.revenue]);
      row.getCell(3).numFmt = '₹#,##0.00';
    });
  
  // Format headers
  [1, 6, 11].forEach(rowNum => {
    const headerRow = worksheet.getRow(rowNum);
    headerRow.font = { bold: true, size: 12, color: { argb: 'FF4472C4' } };
  });
  
  // Set column widths
  worksheet.columns = [
    { width: 20 },
    { width: 15 },
    { width: 20 }
  ];
}

// Create Customer Analytics Sheet
async function createCustomerAnalyticsSheet(workbook, orders) {
  const worksheet = workbook.addWorksheet('👥 Customers', {
    tabColor: { argb: 'FF9B59B6' }
  });
  
  // Group orders by customer
  const customerStats = {};
  
  orders.forEach(order => {
    const email = order.customerEmail;
    if (!email) return;
    
    if (!customerStats[email]) {
      customerStats[email] = {
        name: order.customerName,
        phone: order.customerPhone,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: order.createdAt,
        city: order.shippingAddress?.city,
        state: order.shippingAddress?.state
      };
    }
    
    customerStats[email].totalOrders++;
    customerStats[email].totalSpent += order.totalAmount || 0;
    
    // Update last order date if this order is more recent
    if (new Date(order.createdAt) > new Date(customerStats[email].lastOrderDate)) {
      customerStats[email].lastOrderDate = order.createdAt;
    }
  });
  
  // Set headers
  worksheet.columns = [
    { header: 'Customer Name', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Total Orders', key: 'orders', width: 12 },
    { header: 'Total Spent', key: 'spent', width: 15 },
    { header: 'Average Order', key: 'average', width: 15 },
    { header: 'Last Order', key: 'lastOrder', width: 18 },
    { header: 'City', key: 'city', width: 15 },
    { header: 'State', key: 'state', width: 15 }
  ];
  
  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF9B59B6' } };
  headerRow.alignment = { horizontal: 'center' };
  
  // Add customer data
  Object.entries(customerStats)
    .sort(([,a], [,b]) => b.totalSpent - a.totalSpent)
    .forEach(([email, customer], index) => {
      const row = worksheet.addRow({
        name: customer.name,
        email: email,
        phone: customer.phone,
        orders: customer.totalOrders,
        spent: customer.totalSpent,
        average: customer.totalSpent / customer.totalOrders,
        lastOrder: formatDate(customer.lastOrderDate),
        city: customer.city,
        state: customer.state
      });
      
      // Format currency columns
      row.getCell('spent').numFmt = '₹#,##0.00';
      row.getCell('average').numFmt = '₹#,##0.00';
      
      // Alternate row colors
      if (index % 2 === 1) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
      }
    });
  
  // Add borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });
}

// Update the master order book (Book1.xlsx)
async function updateMasterOrderBook(workbook) {
  try {
    const masterFilePath = path.join(__dirname, '..', 'Book1.xlsx');
    
    // Copy the workbook to master file
    await workbook.xlsx.writeFile(masterFilePath);
    console.log('✅ Master order book (Book1.xlsx) updated successfully');
  } catch (error) {
    console.error('❌ Error updating master order book:', error);
  }
}

// Clean up old Excel files
async function cleanupOldFiles() {
  try {
    const files = await fs.readdir(EXCEL_OUTPUT_DIR);
    const excelFiles = files.filter(file => file.startsWith('Nurvi-Jewel-Order-Book-') && file.endsWith('.xlsx'));
    
    // Keep only files from last BACKUP_DAYS
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - BACKUP_DAYS);
    
    for (const file of excelFiles) {
      const filepath = path.join(EXCEL_OUTPUT_DIR, file);
      const stats = await fs.stat(filepath);
      
      if (stats.mtime < cutoffDate) {
        await fs.unlink(filepath);
        console.log(`🗑️ Cleaned up old file: ${file}`);
      }
    }
  } catch (error) {
    console.error('❌ Error cleaning up old files:', error);
  }
}

// Utility functions
function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN');
}

function formatDateTime(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-IN');
}

// Set up cron job for daily updates
const dailyJob = new cron.CronJob(DAILY_SCHEDULE, generateDailyOrderBook, null, true, 'Asia/Kolkata');

// Initialize system
async function initialize() {
  await ensureDirectories();
  console.log('✅ Daily Excel Order Book System initialized!');
  console.log(`⏰ Schedule: Daily at midnight (IST)`);
  console.log(`📂 Output location: ${EXCEL_OUTPUT_DIR}`);
  console.log('🔄 System is running...');
  
  // Generate initial order book
  await generateDailyOrderBook();
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⏹️ Stopping Daily Excel Order Book System...');
  dailyJob.stop();
  process.exit(0);
});

// Export functions for external use
module.exports = {
  generateDailyOrderBook,
  initialize
};

// Run if called directly
if (require.main === module) {
  initialize().catch(console.error);
}
