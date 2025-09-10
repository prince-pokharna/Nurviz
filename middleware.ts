import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/admin-auth'

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip middleware for login page and API auth endpoints
    if (
      request.nextUrl.pathname === '/admin' ||
      request.nextUrl.pathname.startsWith('/api/admin/auth')
    ) {
      return NextResponse.next()
    }

    // Check for authentication token
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      // Clear invalid token
      const response = NextResponse.redirect(new URL('/admin', request.url))
      response.cookies.set('admin-token', '', { maxAge: 0 })
      return response
    }
    
    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-id', payload.userId)
    requestHeaders.set('x-admin-email', payload.email)
    requestHeaders.set('x-admin-role', payload.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/((?!api/auth).*)',
    '/api/admin/((?!auth).*)'
  ]
}
