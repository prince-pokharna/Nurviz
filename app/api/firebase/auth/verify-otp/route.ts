import { NextRequest, NextResponse } from 'next/server'
import { OTPService } from '@/lib/firebase-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()
    
    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      )
    }
    
    // Verify OTP
    const result = await OTPService.verifyOTP(email, otp)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'OTP verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
