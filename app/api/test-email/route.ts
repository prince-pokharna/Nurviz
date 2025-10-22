import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check email configuration
    const emailConfig = {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      hasEmailFrom: !!process.env.EMAIL_FROM,
      hasEmailHost: !!process.env.EMAIL_HOST,
      hasEmailPort: !!process.env.EMAIL_PORT,
      hasEmailSecure: !!process.env.EMAIL_SECURE,
      emailUser: process.env.EMAIL_USER || 'NOT_SET',
      emailFrom: process.env.EMAIL_FROM || 'NOT_SET',
      emailHost: process.env.EMAIL_HOST || 'NOT_SET',
      emailPort: process.env.EMAIL_PORT || 'NOT_SET',
      emailSecure: process.env.EMAIL_SECURE || 'NOT_SET',
    }

    // Check if all required variables are set
    const missingVars = []
    if (!process.env.EMAIL_USER) missingVars.push('EMAIL_USER')
    if (!process.env.EMAIL_PASS) missingVars.push('EMAIL_PASS')
    if (!process.env.EMAIL_FROM) missingVars.push('EMAIL_FROM')

    const isConfigured = missingVars.length === 0
    const status = isConfigured ? 'CONFIGURED' : 'MISSING_VARIABLES'

    return NextResponse.json({
      success: true,
      status,
      configured: isConfigured,
      emailConfig,
      missingVariables: missingVars,
      message: isConfigured 
        ? 'Email is properly configured and ready to send emails' 
        : `Missing email variables: ${missingVars.join(', ')}`,
      instructions: missingVars.length > 0 ? {
        step1: 'Go to Vercel Dashboard → Settings → Environment Variables',
        step2: 'Add the missing email variables',
        step3: 'For Gmail: Enable 2FA and generate App Password',
        step4: 'Set EMAIL_USER, EMAIL_PASS, EMAIL_FROM',
        step5: 'Redeploy your project'
      } : {
        step1: 'Email is ready! Test by creating a new account',
        step2: 'Check your email for OTP verification code',
        step3: 'All authentication emails will work properly'
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check email configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, testType = 'otp' } = await request.json()
    
    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address required' },
        { status: 400 }
      )
    }

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email not configured',
          message: 'Please set up email credentials first'
        },
        { status: 500 }
      )
    }

    // Generate test OTP
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Send test email
    const response = await fetch(`${request.nextUrl.origin}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        otp: testOTP,
        type: testType,
        name: 'Test User'
      })
    })

    const result = await response.json()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        otp: testOTP,
        email: to,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send test email',
        details: result.error
      }, { status: 500 })
    }
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}