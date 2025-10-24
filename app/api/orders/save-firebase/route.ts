import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBA6avdbz89WJokX-jQRkp7jg6-kAfetBg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nurvi-jewel.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nurvi-jewel",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nurvi-jewel.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1069462383251",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1069462383251:web:633a8c30a52b673af9fb66",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig, 'orders-app') : getApps()[0];
const db = getFirestore(app);

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    console.log('💾 Saving order to Firebase:', {
      orderId: orderData.orderId,
      customer: orderData.customerName,
      amount: orderData.totalAmount
    });

    // Calculate estimated delivery (5-9 business days)
    const orderDate = new Date();
    const estimatedDelivery = calculateDelivery(orderDate, 7); // 7 days average

    // Prepare order data for Firebase
    const firebaseOrderData = {
      order_id: orderData.orderId || `ORD-${Date.now()}`,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      total_amount: orderData.totalAmount,
      items: orderData.items || [],
      shipping_address: orderData.shippingAddress || {},
      payment_id: orderData.paymentId,
      payment_status: orderData.paymentStatus || 'completed',
      order_status: 'processing',
      order_date: new Date().toISOString(),
      estimated_delivery: estimatedDelivery,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      cancellation_deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    };

    // Save to Firebase
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, firebaseOrderData);

    console.log('✅ Order saved to Firebase with ID:', docRef.id);

    // Send order confirmation email (async, don't wait)
    try {
      const emailData = {
        to: orderData.customerEmail,
        customerName: orderData.customerName,
        orderId: orderData.orderId || `ORD-${Date.now()}`,
        totalAmount: orderData.totalAmount,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        estimatedDelivery: estimatedDelivery,
        orderDate: new Date().toLocaleDateString('en-IN')
      };

      fetch(`${request.nextUrl.origin}/api/send-order-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      }).then(res => {
        if (res.ok) {
          console.log('✅ Order confirmation email sent');
        } else {
          console.warn('⚠️ Email sending failed (non-critical)');
        }
      }).catch(err => console.warn('Email error:', err));
    } catch (emailError) {
      console.warn('Email sending failed (non-critical):', emailError);
    }

    // Also trigger Excel update (async, don't wait)
    try {
      fetch('/api/admin/order-book?action=generate', { method: 'GET' }).catch(console.error);
    } catch (excelError) {
      console.warn('Excel generation failed (non-critical):', excelError);
    }

    return NextResponse.json({
      success: true,
      order: {
        ...firebaseOrderData,
        id: docRef.id,
        firebaseId: docRef.id
      }
    });

  } catch (error) {
    console.error('❌ Error saving order to Firebase:', error);

    // Fallback: Try local save
    try {
      const fallbackResponse = await fetch(`${request.nextUrl.origin}/api/orders/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      
      if (fallbackResponse.ok) {
        const result = await fallbackResponse.json();
        return NextResponse.json(result);
      }
    } catch (fallbackError) {
      console.error('Fallback save also failed:', fallbackError);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Calculate delivery date (5-9 business days, average 7)
function calculateDelivery(orderDate: Date, businessDays: number): string {
  const deliveryDate = new Date(orderDate);
  let daysAdded = 0;

  while (daysAdded < businessDays) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const dayOfWeek = deliveryDate.getDay();
    
    // Skip weekends
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  return deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

