import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin, generateToken } from '@/lib/admin-auth'
import { ADMIN_CONFIG } from '@/lib/admin-config'

// Rate limiting store (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(ip: string): string {
  return `admin_login_${ip}`
}

function isRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip)
  const attempt = loginAttempts.get(key)
  
  if (!attempt) return false
  
  const now = Date.now()
  if (now > attempt.resetTime) {
    loginAttempts.delete(key)
    return false
  }
  
  return attempt.count >= 5 // Max 5 attempts per 15 minutes
}

function recordLoginAttempt(ip: string): void {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const resetTime = now + (15 * 60 * 1000) // 15 minutes
  
  const attempt = loginAttempts.get(key)
  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(key, { count: 1, resetTime })
  } else {
    loginAttempts.set(key, { count: attempt.count + 1, resetTime: attempt.resetTime })
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Log environment check for debugging
    console.log('Admin login attempt:', {
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasAdminPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      timestamp: new Date().toISOString()
    })
    
    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }
    
    const { email, password } = await request.json()
    
    // Validate input
    if (!email || !password) {
      recordLoginAttempt(ip)
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Authenticate admin
    const admin = await authenticateAdmin(email, password)
    if (!admin) {
      recordLoginAttempt(ip)
      console.log('Authentication failed for email:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = generateToken(admin)
    
    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
      },
      token,
    })
    
    // Set secure HTTP-only cookie with proper Vercel configuration
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
      // Don't set domain for Vercel - let it use the default
    })
    
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
