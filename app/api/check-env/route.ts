import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    razorpay: {
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? '✓ Set' : '✗ Missing',
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? '✓ Set' : '✗ Missing',
      NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '✗ Missing',
      keyIdLength: process.env.RAZORPAY_KEY_ID?.length || 0,
      keySecretLength: process.env.RAZORPAY_KEY_SECRET?.length || 0,
    },
    cloudinary: {
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing',
      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? '✓ Set' : '✗ Missing',
    },
    admin: {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ? '✓ Set' : '✗ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✓ Set' : '✗ Missing',
    }
  });
}

