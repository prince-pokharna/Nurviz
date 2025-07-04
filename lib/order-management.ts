// Order Management System for Nurvi Jewels
// This handles order tracking and Excel data management

export interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingStatus {
  orderId: string;
  status: 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
  estimatedDelivery?: string;
}

// Create Excel-compatible data structure
export const createExcelOrderData = (orderData: OrderData) => {
  return {
    'Order ID': orderData.orderId,
    'Customer Name': orderData.customerName,
    'Customer Email': orderData.customerEmail,
    'Customer Phone': orderData.customerPhone,
    'Order Date': orderData.orderDate,
    'Total Amount (₹)': orderData.totalAmount,
    'Items': orderData.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', '),
    'Shipping Address': `${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}`,
    'Payment ID': orderData.paymentId || '',
    'Payment Status': orderData.paymentStatus,
    'Order Status': orderData.orderStatus,
    'Tracking Number': orderData.trackingNumber || '',
    'Estimated Delivery': orderData.estimatedDelivery || '',
    'Notes': orderData.notes || '',
    'Created At': orderData.createdAt,
    'Updated At': orderData.updatedAt,
  };
};

// Calculate estimated delivery date (7-10 working days)
export const calculateEstimatedDelivery = (orderDate: Date): string => {
  const deliveryDate = new Date(orderDate);
  let workingDays = 0;
  
  // Add 7-10 working days (using 8 as average)
  while (workingDays < 8) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const dayOfWeek = deliveryDate.getDay();
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }
  
  return deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generate CSV content for Excel
export const generateOrderCSV = (orders: OrderData[]): string => {
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

  const csvContent = [
    headers.join(','),
    ...orders.map(order => {
      const excelData = createExcelOrderData(order);
      return headers.map(header => {
        const value = excelData[header as keyof typeof excelData] || '';
        // Escape commas and quotes in CSV
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',');
    })
  ].join('\n');

  return csvContent;
};

// Status color mapping for UI
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'confirmed':
      return 'bg-purple-100 text-purple-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Status icon mapping for UI
export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'delivered':
      return 'CheckCircle';
    case 'shipped':
      return 'Truck';
    case 'confirmed':
      return 'Package';
    case 'processing':
      return 'Clock';
    case 'cancelled':
      return 'X';
    default:
      return 'Package';
  }
}; 