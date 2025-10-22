import { NextRequest, NextResponse } from 'next/server'
import { FirebaseAuthService, OTPService } from '@/lib/firebase-auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }
    
    // Register user with Firebase Auth
    const result = await FirebaseAuthService.register(email, password, name)
    
    if (result.success) {
      // Send OTP for additional verification
      const otpResult = await OTPService.sendOTP(email, 'registration', name)
      
      return NextResponse.json({
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        user: {
          uid: result.user?.uid,
          email: result.user?.email,
          name: result.user?.displayName
        },
        otpSent: otpResult.success
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Registration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
