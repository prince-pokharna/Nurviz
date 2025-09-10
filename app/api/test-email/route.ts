import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check email configuration
    const hasEmailConfig = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_FROM);
    
    return NextResponse.json({
      success: true,
      emailConfigured: hasEmailConfig,
      developmentMode: !hasEmailConfig,
      environment: process.env.NODE_ENV || 'development',
      message: hasEmailConfig 
        ? 'Email is properly configured' 
        : 'Email not configured - running in development mode',
      instructions: hasEmailConfig 
        ? 'Email verification will work normally'
        : 'Check browser console for OTP codes during testing'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check email configuration',
      developmentMode: true
    }, { status: 500 });
  }
}
