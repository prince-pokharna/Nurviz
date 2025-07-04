import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  console.log('=== Create Order API Called ===');
  
  try {
    // Log environment variables for debugging
    console.log('Environment check:');
    console.log('- RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? '✓ Set' : '✗ Missing');
    console.log('- RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✓ Set' : '✗ Missing');
    console.log('- NODE_ENV:', process.env.NODE_ENV);

    const body = await request.json();
    console.log('Request body:', body);
    
    const { amount, currency = 'INR' } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return NextResponse.json({ 
        success: false,
        error: 'Invalid amount',
        details: `Amount received: ${amount}`
      }, { status: 400 });
    }

    console.log('✓ Amount validation passed:', amount);

    // Check credentials
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('❌ Missing Razorpay credentials');
      console.log('- Key ID present:', !!keyId);
      console.log('- Key Secret present:', !!keySecret);
      
      return NextResponse.json({ 
        success: false,
        error: 'Payment gateway configuration error',
        details: 'Missing API credentials. Please check your .env.local file.'
      }, { status: 500 });
    }

    console.log('✓ Credentials validation passed');

    // Initialize Razorpay
    console.log('Initializing Razorpay...');
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    console.log('Creating order with options:', options);

    const order = await razorpay.orders.create(options);
    
    console.log('✅ Order created successfully:', {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status
    });
    
    return NextResponse.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('❌ Error in create-order API:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 