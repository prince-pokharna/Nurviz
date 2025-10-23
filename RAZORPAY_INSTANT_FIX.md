import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ? '✓ Set (hidden)' : '✗ Missing',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? '✓ Set (hidden)' : '✗ Missing',
    publicRazorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '✗ Missing',
    nodeEnv: process.env.NODE_ENV,
    allRazorpayVars: {
      RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET,
      NEXT_PUBLIC_RAZORPAY_KEY_ID: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    }
  });
}

