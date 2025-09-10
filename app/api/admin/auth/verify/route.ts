import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, isSessionValid } from '@/lib/admin-auth'
import { ADMIN_PERMISSIONS } from '@/lib/admin-config'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const cookieToken = request.cookies.get('admin-token')?.value
    const authHeader = request.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    const token = cookieToken || bearerToken
    
    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      )
    }
    
    // Verify JWT token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    // Return admin info (in production, fetch from database)
    const admin = {
      id: payload.userId,
      email: payload.email,
      name: 'Admin User',
      role: payload.role as 'super_admin' | 'admin' | 'manager',
      permissions: Object.values(ADMIN_PERMISSIONS),
      loginTime: (payload.iat || 0) * 1000, // Convert to milliseconds
    }
    
    // Check if session is still valid
    if (!isSessionValid(admin.loginTime)) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      admin,
    })
  } catch (error) {
    console.error('Admin verification error:', error)
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
