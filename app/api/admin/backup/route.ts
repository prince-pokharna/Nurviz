import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/admin-auth'
import fs from 'fs/promises'
import path from 'path'

// Middleware to verify admin authentication
async function verifyAdminAuth(request: NextRequest) {
  const cookieToken = request.cookies.get('admin-token')?.value
  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  
  const token = cookieToken || bearerToken
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}

// GET /api/admin/backup - Create and download backup
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await verifyAdminAuth(request)
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const inventoryPath = path.join(process.cwd(), 'data', 'inventory.json')
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json')
    
    // Read current data
    const [inventoryData, ordersData] = await Promise.all([
      fs.readFile(inventoryPath, 'utf-8').catch(() => '{}'),
      fs.readFile(ordersPath, 'utf-8').catch(() => '[]'),
    ])

    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        inventory: JSON.parse(inventoryData),
        orders: JSON.parse(ordersData),
      },
      metadata: {
        createdBy: payload.email,
        totalProducts: JSON.parse(inventoryData).all?.length || 0,
        totalOrders: JSON.parse(ordersData).length || 0,
      }
    }

    // Save backup file
    const backupDir = path.join(process.cwd(), 'data', 'backups')
    await fs.mkdir(backupDir, { recursive: true })
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(backupDir, `backup-${timestamp}.json`)
    await fs.writeFile(backupPath, JSON.stringify(backup, null, 2))

    // Return backup as downloadable file
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="nurvi-jewel-backup-${timestamp}.json"`,
      },
    })
  } catch (error) {
    console.error('Error creating backup:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/backup - Restore from backup
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const payload = await verifyAdminAuth(request)
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const backup = await request.json()

    // Validate backup structure
    if (!backup.data || !backup.data.inventory) {
      return NextResponse.json(
        { error: 'Invalid backup format' },
        { status: 400 }
      )
    }

    const inventoryPath = path.join(process.cwd(), 'data', 'inventory.json')
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json')

    // Create current backup before restore
    const currentBackupDir = path.join(process.cwd(), 'data', 'backups')
    await fs.mkdir(currentBackupDir, { recursive: true })
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const currentBackupPath = path.join(currentBackupDir, `pre-restore-backup-${timestamp}.json`)
    
    const [currentInventory, currentOrders] = await Promise.all([
      fs.readFile(inventoryPath, 'utf-8').catch(() => '{}'),
      fs.readFile(ordersPath, 'utf-8').catch(() => '[]'),
    ])

    const currentBackup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        inventory: JSON.parse(currentInventory),
        orders: JSON.parse(currentOrders),
      },
      metadata: {
        createdBy: payload.email,
        reason: 'Pre-restore backup',
      }
    }

    await fs.writeFile(currentBackupPath, JSON.stringify(currentBackup, null, 2))

    // Restore from backup
    await Promise.all([
      fs.writeFile(inventoryPath, JSON.stringify(backup.data.inventory, null, 2)),
      backup.data.orders ? fs.writeFile(ordersPath, JSON.stringify(backup.data.orders, null, 2)) : Promise.resolve(),
    ])

    return NextResponse.json({
      success: true,
      message: 'Backup restored successfully',
      restoredProducts: backup.data.inventory.all?.length || 0,
      restoredOrders: backup.data.orders?.length || 0,
      backupTimestamp: backup.timestamp,
    })
  } catch (error) {
    console.error('Error restoring backup:', error)
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
