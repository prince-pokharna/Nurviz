import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBA6avdbz89WJokX-jQRkp7jg6-kAfetBg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nurvi-jewel.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nurvi-jewel",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nurvi-jewel.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1069462383251",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1069462383251:web:633a8c30a52b673af9fb66",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig, 'orders-get-app') : getApps()[0];
const db = getFirestore(app);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    console.log('📦 Fetching orders for:', email || 'all');

    const ordersRef = collection(db, 'orders');
    let ordersQuery;

    if (email) {
      // Get orders for specific customer
      ordersQuery = query(
        ordersRef,
        where('customer_email', '==', email),
        orderBy('created_at', 'desc')
      );
    } else {
      // Get all orders (admin)
      ordersQuery = query(ordersRef, orderBy('created_at', 'desc'));
    }

    const snapshot = await getDocs(ordersQuery);
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Map Firebase fields to app format
      orderId: doc.data().order_id,
      customerName: doc.data().customer_name,
      customerEmail: doc.data().customer_email,
      customerPhone: doc.data().customer_phone,
      totalAmount: doc.data().total_amount,
      paymentStatus: doc.data().payment_status,
      orderStatus: doc.data().order_status,
      orderDate: doc.data().order_date,
      estimatedDelivery: doc.data().estimated_delivery,
      createdAt: doc.data().created_at,
      shippingAddress: doc.data().shipping_address,
    }));

    console.log(`✅ Found ${orders.length} orders`);

    return NextResponse.json({
      success: true,
      orders: orders,
      count: orders.length
    });

  } catch (error) {
    console.error('❌ Error fetching orders:', error);

    // Fallback to local JSON file
    try {
      const fs = require('fs');
      const path = require('path');
      const ordersFile = path.join(process.cwd(), 'data', 'orders.json');
      
      if (fs.existsSync(ordersFile)) {
        const data = fs.readFileSync(ordersFile, 'utf8');
        const allOrders = JSON.parse(data);
        
        const filtered = email 
          ? allOrders.filter((o: any) => o.customerEmail === email)
          : allOrders;

        return NextResponse.json({
          success: true,
          orders: filtered,
          count: filtered.length,
          source: 'local-fallback'
        });
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        orders: []
      },
      { status: 500 }
    );
  }
}
