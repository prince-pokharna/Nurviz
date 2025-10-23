import { NextResponse } from 'next/server';

// This endpoint provides Razorpay public key at runtime
// Solves the issue where NEXT_PUBLIC_ vars aren't available after build
export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  
  if (!keyId) {
    return NextResponse.json({
      success: false,
      error: 'Razorpay not configured',
      keyId: null
    }, { status: 500 });
  }
  
  return NextResponse.json({
    success: true,
    keyId: keyId,
    configured: true
  });
}

