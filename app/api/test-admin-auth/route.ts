import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/admin-auth';
import { ADMIN_CONFIG } from '@/lib/admin-config';

export async function GET(request: NextRequest) {
  try {
    // Test admin authentication
    const testEmail = 'owner@nurvijewel.com';
    const testPassword = 'nurvi2024secure';
    
    console.log('🧪 Testing admin authentication...');
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      ADMIN_EMAIL: ADMIN_CONFIG.ADMIN_EMAIL,
      isDevelopment: process.env.NODE_ENV !== 'production'
    });
    
    const admin = await authenticateAdmin(testEmail, testPassword);
    
    return NextResponse.json({
      success: true,
      testResult: {
        email: testEmail,
        password: testPassword,
        adminFound: !!admin,
        adminEmail: admin?.email,
        environment: process.env.NODE_ENV,
        expectedEmail: ADMIN_CONFIG.ADMIN_EMAIL,
        isDevelopment: process.env.NODE_ENV !== 'production'
      },
      message: admin ? 'Admin authentication working' : 'Admin authentication failed'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}
