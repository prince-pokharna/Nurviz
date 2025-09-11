import bcrypt from 'bcryptjs'

// Admin configuration interface
export interface AdminConfig {
  email: string
  passwordHash: string
  name: string
  role: string
  permissions: string[]
}

// Function to hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Function to verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Function to generate admin configuration
export async function generateAdminConfig(email: string, password: string, name: string = 'Admin'): Promise<AdminConfig> {
  const passwordHash = await hashPassword(password)
  
  return {
    email: email.toLowerCase().trim(),
    passwordHash,
    name,
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_products', 'view_analytics']
  }
}

// Default admin configuration (will be overridden by environment variables)
export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  email: 'owner@nurvijewel.com',
  passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2u', // 'nurvi2024secure'
  name: 'Nurvi Jewel Owner',
  role: 'admin',
  permissions: ['read', 'write', 'delete', 'manage_users', 'manage_products', 'view_analytics']
}

// Get admin configuration from environment or use default
export function getAdminConfig(): AdminConfig {
  // Check if custom admin credentials are set in environment
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH) {
    return {
      email: process.env.ADMIN_EMAIL.toLowerCase().trim(),
      passwordHash: process.env.ADMIN_PASSWORD_HASH,
      name: process.env.ADMIN_NAME || 'Admin',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_products', 'view_analytics']
    }
  }
  
  // Fallback to default configuration
  return DEFAULT_ADMIN_CONFIG
}
