import { NextResponse } from 'next/server'
import { getInventory } from '@/lib/database'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
      },
      paths: {
        cwd: process.cwd(),
        inventoryPath: path.join(process.cwd(), 'data', 'inventory.json'),
        ordersPath: path.join(process.cwd(), 'data', 'orders.json')
      }
    }

    // Check if data directory exists
    try {
      const dataDir = path.join(process.cwd(), 'data')
      const dataDirExists = fs.existsSync(dataDir)
      debugInfo.dataDirectory = {
        exists: dataDirExists,
        path: dataDir
      }

      if (dataDirExists) {
        const files = fs.readdirSync(dataDir)
        debugInfo.dataDirectory.files = files
      }
    } catch (error) {
      debugInfo.dataDirectory = { error: error.message }
    }

    // Check if inventory file exists and get its stats
    try {
      const inventoryPath = path.join(process.cwd(), 'data', 'inventory.json')
      const inventoryExists = fs.existsSync(inventoryPath)
      debugInfo.inventoryFile = {
        exists: inventoryExists,
        path: inventoryPath
      }

      if (inventoryExists) {
        const stats = fs.statSync(inventoryPath)
        debugInfo.inventoryFile.size = stats.size
        debugInfo.inventoryFile.lastModified = stats.mtime.toISOString()
        
        // Read first few characters to verify content
        const content = fs.readFileSync(inventoryPath, 'utf8')
        debugInfo.inventoryFile.contentPreview = content.substring(0, 100) + '...'
        
        // Parse and count products
        try {
          const parsed = JSON.parse(content)
          debugInfo.inventoryFile.structure = {
            isArray: Array.isArray(parsed),
            hasAll: !!parsed.all,
            allCount: parsed.all?.length || 0,
            featuredCount: parsed.featured?.length || 0,
            totalKeys: Object.keys(parsed).length
          }
        } catch (parseError) {
          debugInfo.inventoryFile.parseError = parseError.message
        }
      }
    } catch (error) {
      debugInfo.inventoryFile = { error: error.message }
    }

    // Test the getInventory function
    try {
      console.log('🔍 Testing getInventory function...')
      const inventory = await getInventory()
      debugInfo.getInventoryResult = {
        success: true,
        totalProducts: inventory?.all?.length || 0,
        featuredProducts: inventory?.featured?.length || 0,
        hasCategories: !!inventory?.categories,
        firstProductName: inventory?.all?.[0]?.name || 'None',
        firstProductColors: inventory?.all?.[0]?.colors || [],
        firstProductSizes: inventory?.all?.[0]?.sizes || []
      }
    } catch (error) {
      debugInfo.getInventoryResult = {
        success: false,
        error: error.message
      }
    }

    // Add deployment info
    debugInfo.deployment = {
      isVercel: !!process.env.VERCEL,
      buildTime: process.env.VERCEL_BUILD_TIME || 'unknown',
      region: process.env.VERCEL_REGION || 'unknown'
    }

    return NextResponse.json(debugInfo, { 
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
} 