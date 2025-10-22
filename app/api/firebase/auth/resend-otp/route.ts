import { NextRequest, NextResponse } from 'next/server'
import { OTPService } from '@/lib/firebase-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, type = 'login' } = await request.json()
    
    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }
    
    // Send OTP
    const result = await OTPService.sendOTP(email, type)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send OTP',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
