// Admin configuration and environment variables
export const ADMIN_CONFIG = {
  // Default admin credentials (replace with environment variables in production)
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'owner@nurvijewel.com',
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || '$2b$10$8K8vJdXsLzqGQJ9zNxX0V.5yQZqG8qZvGqKqG8qZvGqKqG8qZvGq', // nurvi2024secure
  JWT_SECRET: process.env.JWT_SECRET || 'nurvi_jewel_super_secret_key_2024_admin_dashboard_secure_token',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Upload configuration
  UPLOAD_SECRET: process.env.UPLOAD_SECRET || 'nurvi_upload_secret_key_2024',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  
  // Rate limiting
  ADMIN_RATE_LIMIT: parseInt(process.env.ADMIN_RATE_LIMIT || '100'),
  
  // Security settings
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  CSRF_SECRET: process.env.CSRF_SECRET || 'nurvi_csrf_protection_2024',
}

export const ADMIN_PERMISSIONS = {
  VIEW_CUSTOMERS: 'view_customers',
  EDIT_CUSTOMERS: 'edit_customers',
  DELETE_CUSTOMERS: 'delete_customers',
  VIEW_ORDERS: 'view_orders',
  EDIT_ORDERS: 'edit_orders',
  DELETE_ORDERS: 'delete_orders',
  VIEW_PRODUCTS: 'view_products',
  EDIT_PRODUCTS: 'edit_products',
  DELETE_PRODUCTS: 'delete_products',
  MANAGE_INVENTORY: 'manage_inventory',
  BULK_OPERATIONS: 'bulk_operations',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
  BACKUP_DATA: 'backup_data',
  RESTORE_DATA: 'restore_data',
} as const

export type AdminPermission = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS]
