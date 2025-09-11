import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { ADMIN_CONFIG, ADMIN_PERMISSIONS, type AdminPermission } from './admin-config'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'manager'
  permissions: AdminPermission[]
  loginTime: number
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12)
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

// Generate JWT token
export function generateToken(user: Omit<AdminUser, 'permissions' | 'loginTime'>): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  return jwt.sign(payload, ADMIN_CONFIG.JWT_SECRET, {
    expiresIn: ADMIN_CONFIG.JWT_EXPIRES_IN,
  })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, ADMIN_CONFIG.JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Get admin user by email and password
export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    console.log('🔐 Admin authentication attempt:', {
      email,
      expectedEmail: ADMIN_CONFIG.ADMIN_EMAIL,
      nodeEnv: process.env.NODE_ENV,
      passwordLength: password.length
    })

    // Check if email matches admin email
    if (email !== ADMIN_CONFIG.ADMIN_EMAIL) {
      console.log('❌ Email mismatch:', { provided: email, expected: ADMIN_CONFIG.ADMIN_EMAIL })
      return null
    }

    // For development, use simple password check
    // In production, use environment variables
    const isDevelopment = process.env.NODE_ENV !== 'production'
    let isValid = false
    
    console.log('🔍 Environment check:', { isDevelopment, nodeEnv: process.env.NODE_ENV })
    
    if (isDevelopment) {
      // Simple password check for development
      isValid = password === 'nurvi2024secure'
      console.log('🧪 Development password check:', { isValid, provided: password, expected: 'nurvi2024secure' })
    } else {
      // Use hashed password in production
      isValid = await verifyPassword(password, ADMIN_CONFIG.ADMIN_PASSWORD_HASH)
      console.log('🔒 Production password check:', { isValid })
    }
    
    if (!isValid) {
      console.log('❌ Password validation failed')
      return null
    }

    console.log('✅ Admin authentication successful')

    // Return admin user with full permissions
    return {
      id: 'admin-1',
      email: ADMIN_CONFIG.ADMIN_EMAIL,
      name: 'Admin User',
      role: 'super_admin',
      permissions: Object.values(ADMIN_PERMISSIONS),
      loginTime: Date.now(),
    }
  } catch (error) {
    console.error('❌ Authentication error:', error)
    return null
  }
}

// Check if user has specific permission
export function hasPermission(user: AdminUser | null, permission: AdminPermission): boolean {
  if (!user) return false
  return user.permissions.includes(permission)
}

// Check if session is still valid
export function isSessionValid(loginTime: number): boolean {
  const now = Date.now()
  return (now - loginTime) < ADMIN_CONFIG.SESSION_TIMEOUT
}

// Refresh token if needed
export function refreshTokenIfNeeded(user: AdminUser): string | null {
  if (!isSessionValid(user.loginTime)) {
    return null
  }
  
  // If session is still valid but token is close to expiry, generate new token
  return generateToken(user)
}
