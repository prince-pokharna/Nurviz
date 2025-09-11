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
    
    // Set secure HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/admin',
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
