import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get environment information
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasAdminPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
      hasAdminName: !!process.env.ADMIN_NAME,
      hasJwtSecret: !!process.env.JWT_SECRET,
      adminEmail: process.env.ADMIN_EMAIL || 'NOT_SET',
      adminName: process.env.ADMIN_NAME || 'NOT_SET',
      passwordHashLength: process.env.ADMIN_PASSWORD_HASH?.length || 0,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
    }

    return NextResponse.json({
      success: true,
      environment: envInfo,
      message: 'Environment variables check complete',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check environment variables',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
