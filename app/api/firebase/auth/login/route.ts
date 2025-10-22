import { NextRequest, NextResponse } from 'next/server'
import { FirebaseAuthService, OTPService } from '@/lib/firebase-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Login user with Firebase Auth
    const result = await FirebaseAuthService.login(email, password)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          uid: result.user?.uid,
          email: result.user?.email,
          name: result.user?.displayName,
          emailVerified: result.user?.emailVerified
        }
      })
    } else {
      // If email not verified, send OTP
      if (result.error?.includes('verify your email')) {
        const otpResult = await OTPService.sendOTP(email, 'login')
        
        return NextResponse.json({
          success: false,
          error: result.error,
          otpSent: otpResult.success,
          requiresVerification: true
        }, { status: 401 })
      }
      
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
