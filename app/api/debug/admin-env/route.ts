import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get environment information
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasAdminPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
      hasAdminName: !!process.env.ADMIN_NAME,
      hasJwtSecret: !!process.env.JWT_SECRET,
      adminEmail: process.env.ADMIN_EMAIL || 'NOT_SET',
      adminName: process.env.ADMIN_NAME || 'NOT_SET',
      passwordHashLength: process.env.ADMIN_PASSWORD_HASH?.length || 0,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
      passwordHashPrefix: process.env.ADMIN_PASSWORD_HASH?.substring(0, 10) || 'NOT_SET',
      jwtSecretPrefix: process.env.JWT_SECRET?.substring(0, 10) || 'NOT_SET',
    }

    // Check if all required variables are set
    const missingVars = []
    if (!process.env.ADMIN_EMAIL) missingVars.push('ADMIN_EMAIL')
    if (!process.env.ADMIN_PASSWORD_HASH) missingVars.push('ADMIN_PASSWORD_HASH')
    if (!process.env.ADMIN_NAME) missingVars.push('ADMIN_NAME')
    if (!process.env.JWT_SECRET) missingVars.push('JWT_SECRET')

    const status = missingVars.length === 0 ? 'READY' : 'MISSING_VARIABLES'

    return NextResponse.json({
      success: true,
      status,
      environment: envInfo,
      missingVariables: missingVars,
      message: missingVars.length === 0 
        ? 'All environment variables are properly configured' 
        : `Missing environment variables: ${missingVars.join(', ')}`,
      instructions: missingVars.length > 0 ? {
        step1: 'Go to Vercel Dashboard → Settings → Environment Variables',
        step2: 'Add the missing variables listed above',
        step3: 'Enable all variables for Production environment',
        step4: 'Redeploy your project',
        step5: 'Test admin login again'
      } : null,
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
