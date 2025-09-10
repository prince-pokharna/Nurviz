import fs from 'fs/promises'
import path from 'path'

export interface SimpleProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  description: string
  material?: string
  colors?: string[]
  sizes?: string[]
  tags?: string
  inStock: boolean
  stock: number
  lowStockAlert: number
  lastUpdated: string
  sku?: string
  rating?: number
  reviews?: number
}

export class SimpleInventoryManager {
  private inventoryPath: string
  private backupDir: string

  constructor() {
    this.inventoryPath = path.join(process.cwd(), 'data', 'inventory.json')
    this.backupDir = path.join(process.cwd(), 'data', 'backups')
  }

  // Get all products from JSON file
  async getAllProducts(): Promise<SimpleProduct[]> {
    try {
      const data = await fs.readFile(this.inventoryPath, 'utf-8')
      const inventory = JSON.parse(data)
      const products = inventory.all || []
      
      // Ensure each product has stock fields
      return products.map((product: any) => ({
        ...product,
        stock: product.stock || 10, // Default stock
        lowStockAlert: product.lowStockAlert || 5,
        inStock: product.inStock !== undefined ? product.inStock : true,
        lastUpdated: product.lastUpdated || new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error reading inventory:', error)
      return []
    }
  }

  // Get single product
  async getProduct(id: string): Promise<SimpleProduct | null> {
    const products = await this.getAllProducts()
    return products.find(p => p.id === id) || null
  }

  // Update product stock (main function you'll use)
  async updateStock(id: string, newStock: number): Promise<boolean> {
    try {
      // Create backup first
      await this.createBackup()
      
      const data = await fs.readFile(this.inventoryPath, 'utf-8')
      const inventory = JSON.parse(data)
      const products = inventory.all || []
      
      // Find and update product
      const productIndex = products.findIndex((p: any) => p.id === id)
      if (productIndex === -1) return false
      
      // Update stock and related fields
      products[productIndex].stock = newStock
      products[productIndex].inStock = newStock > 0
      products[productIndex].lastUpdated = new Date().toISOString()
      
      // Save back to file
      inventory.all = products
      await fs.writeFile(this.inventoryPath, JSON.stringify(inventory, null, 2))
      
      return true
    } catch (error) {
      console.error('Error updating stock:', error)
      return false
    }
  }

  // Update product details
  async updateProduct(id: string, updates: Partial<SimpleProduct>): Promise<boolean> {
    try {
      // Create backup first
      await this.createBackup()
      
      const data = await fs.readFile(this.inventoryPath, 'utf-8')
      const inventory = JSON.parse(data)
      const products = inventory.all || []
      
      // Find and update product
      const productIndex = products.findIndex((p: any) => p.id === id)
      if (productIndex === -1) return false
      
      // Update product with new data
      products[productIndex] = {
        ...products[productIndex],
        ...updates,
        lastUpdated: new Date().toISOString()
      }
      
      // Save back to file
      inventory.all = products
      await fs.writeFile(this.inventoryPath, JSON.stringify(inventory, null, 2))
      
      return true
    } catch (error) {
      console.error('Error updating product:', error)
      return false
    }
  }

  // Bulk update stock for multiple products
  async bulkUpdateStock(updates: { id: string; stock: number }[]): Promise<boolean> {
    try {
      // Create backup first
      await this.createBackup()
      
      const data = await fs.readFile(this.inventoryPath, 'utf-8')
      const inventory = JSON.parse(data)
      const products = inventory.all || []
      
      // Update all products
      updates.forEach(update => {
        const productIndex = products.findIndex((p: any) => p.id === update.id)
        if (productIndex !== -1) {
          products[productIndex].stock = update.stock
          products[productIndex].inStock = update.stock > 0
          products[productIndex].lastUpdated = new Date().toISOString()
        }
      })
      
      // Save back to file
      inventory.all = products
      await fs.writeFile(this.inventoryPath, JSON.stringify(inventory, null, 2))
      
      return true
    } catch (error) {
      console.error('Error bulk updating stock:', error)
      return false
    }
  }

  // Get low stock products
  async getLowStockProducts(): Promise<SimpleProduct[]> {
    const products = await this.getAllProducts()
    return products.filter(product => 
      product.stock <= product.lowStockAlert && product.inStock
    )
  }

  // Get stock statistics
  async getStockStats() {
    const products = await this.getAllProducts()
    
    const totalProducts = products.length
    const inStock = products.filter(p => p.inStock && p.stock > 0).length
    const lowStock = products.filter(p => p.stock <= p.lowStockAlert && p.stock > 0).length
    const outOfStock = products.filter(p => p.stock === 0).length
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    
    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalValue
    }
  }

  // Create backup (automatic before changes)
  private async createBackup(): Promise<void> {
    try {
      // Ensure backup directory exists
      await fs.mkdir(this.backupDir, { recursive: true })
      
      // Create backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupPath = path.join(this.backupDir, `inventory-backup-${timestamp}.json`)
      
      // Copy current inventory to backup
      const currentData = await fs.readFile(this.inventoryPath, 'utf-8')
      await fs.writeFile(backupPath, currentData)
      
      // Keep only last 10 backups
      const backupFiles = await fs.readdir(this.backupDir)
      const inventoryBackups = backupFiles
        .filter(file => file.startsWith('inventory-backup-'))
        .sort()
        .reverse()
      
      if (inventoryBackups.length > 10) {
        for (const file of inventoryBackups.slice(10)) {
          await fs.unlink(path.join(this.backupDir, file))
        }
      }
    } catch (error) {
      console.error('Error creating backup:', error)
    }
  }

  // Manual backup download
  async createManualBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(this.backupDir, `manual-backup-${timestamp}.json`)
    
    const currentData = await fs.readFile(this.inventoryPath, 'utf-8')
    await fs.writeFile(backupPath, currentData)
    
    return backupPath
  }
}
