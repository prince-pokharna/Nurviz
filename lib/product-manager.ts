import fs from 'fs/promises'
import path from 'path'

export interface ProductSize {
  name: string
  available: boolean
  stock: number
}

export interface ProductVariant {
  id: string
  name: string
  color?: string
  material?: string
  price?: number
  images?: string[]
  stock: number
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  category: string
  section?: string
  description: string
  material: string
  weight?: number
  size?: string
  colors: string[]
  sizes: string[]
  variants?: ProductVariant[]
  style?: string
  occasion?: string
  features?: string
  rating: number
  reviews: number
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
  careInstructions: string
  sku: string
  brand: string
  collection?: string
  tags: string
  dateAdded: string
  lastUpdated: string
  inventory: {
    stock: number
    lowStockThreshold: number
    sizes?: ProductSize[]
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string
  }
  priceHistory?: {
    date: string
    price: number
    reason?: string
  }[]
}

export interface ProductFilters {
  category?: string
  inStock?: boolean
  priceRange?: [number, number]
  search?: string
  sortBy?: 'name' | 'price' | 'dateAdded' | 'stock'
  sortOrder?: 'asc' | 'desc'
}

export class ProductManager {
  private inventoryPath: string

  constructor() {
    this.inventoryPath = path.join(process.cwd(), 'data', 'inventory.json')
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const data = await fs.readFile(this.inventoryPath, 'utf-8')
      const inventory = JSON.parse(data)
      const products = inventory.all || []
      
      // Ensure all products have inventory structure
      return products.map((product: any) => ({
        ...product,
        inventory: product.inventory || {
          stock: product.stock || 10, // Default stock
          lowStockThreshold: 5,
          sizes: product.sizes ? product.sizes.map((size: string) => ({
            name: size,
            available: true,
            stock: 5
          })) : []
        }
      }))
    } catch (error) {
      console.error('Error reading inventory:', error)
      return []
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getAllProducts()
    return products.find(product => product.id === id) || null
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getAllProducts()
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    )
  }

  async searchProducts(filters: ProductFilters): Promise<Product[]> {
    let products = await this.getAllProducts()

    // Apply filters
    if (filters.category) {
      products = products.filter(p => 
        p.category.toLowerCase() === filters.category!.toLowerCase()
      )
    }

    if (filters.inStock !== undefined) {
      products = products.filter(p => p.inStock === filters.inStock)
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      products = products.filter(p => p.price >= min && p.price <= max)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.tags.toLowerCase().includes(searchTerm) ||
        p.sku.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sorting
    if (filters.sortBy) {
      products.sort((a, b) => {
        let aVal: any, bVal: any

        switch (filters.sortBy) {
          case 'name':
            aVal = a.name.toLowerCase()
            bVal = b.name.toLowerCase()
            break
          case 'price':
            aVal = a.price
            bVal = b.price
            break
          case 'dateAdded':
            aVal = new Date(a.dateAdded).getTime()
            bVal = new Date(b.dateAdded).getTime()
            break
          case 'stock':
            aVal = a.inventory.stock
            bVal = b.inventory.stock
            break
          default:
            return 0
        }

        if (aVal < bVal) return filters.sortOrder === 'desc' ? 1 : -1
        if (aVal > bVal) return filters.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }

    return products
  }

  async createProduct(productData: Omit<Product, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<Product> {
    const products = await this.getAllProducts()
    
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    products.push(newProduct)
    await this.saveProducts(products)
    return newProduct
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await this.getAllProducts()
    const index = products.findIndex(p => p.id === id)
    
    if (index === -1) return null

    const updatedProduct = {
      ...products[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
    }

    // Track price changes
    if (updates.price && updates.price !== products[index].price) {
      if (!updatedProduct.priceHistory) {
        updatedProduct.priceHistory = []
      }
      updatedProduct.priceHistory.push({
        date: new Date().toISOString(),
        price: products[index].price,
        reason: 'Price update via admin panel'
      })
    }

    products[index] = updatedProduct
    await this.saveProducts(products)
    return updatedProduct
  }

  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getAllProducts()
    const index = products.findIndex(p => p.id === id)
    
    if (index === -1) return false

    products.splice(index, 1)
    await this.saveProducts(products)
    return true
  }

  async bulkUpdateProducts(updates: { id: string; data: Partial<Product> }[]): Promise<Product[]> {
    const products = await this.getAllProducts()
    const updatedProducts: Product[] = []

    for (const update of updates) {
      const index = products.findIndex(p => p.id === update.id)
      if (index !== -1) {
        products[index] = {
          ...products[index],
          ...update.data,
          lastUpdated: new Date().toISOString(),
        }
        updatedProducts.push(products[index])
      }
    }

    await this.saveProducts(products)
    return updatedProducts
  }

  async duplicateProduct(id: string): Promise<Product | null> {
    const product = await this.getProductById(id)
    if (!product) return null

    const duplicatedProduct = {
      ...product,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-copy-${Date.now()}`,
    }

    return this.createProduct(duplicatedProduct)
  }

  async getLowStockProducts(): Promise<Product[]> {
    const products = await this.getAllProducts()
    return products.filter(product => 
      product.inventory.stock <= product.inventory.lowStockThreshold
    )
  }

  async getProductAnalytics() {
    const products = await this.getAllProducts()
    
    const totalProducts = products.length
    const inStockProducts = products.filter(p => p.inStock).length
    const outOfStockProducts = totalProducts - inStockProducts
    const lowStockProducts = products.filter(p => 
      p.inventory.stock <= p.inventory.lowStockThreshold
    ).length

    const categoryBreakdown = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.inventory.stock), 0)

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      lowStockProducts,
      categoryBreakdown,
      averagePrice,
      totalInventoryValue,
    }
  }

  private async saveProducts(products: Product[]): Promise<void> {
    try {
      // Create backup
      await this.createBackup()
      
      const inventory = { all: products }
      await fs.writeFile(this.inventoryPath, JSON.stringify(inventory, null, 2))
    } catch (error) {
      console.error('Error saving inventory:', error)
      throw error
    }
  }

  private async createBackup(): Promise<void> {
    try {
      const backupDir = path.join(process.cwd(), 'data', 'backups')
      await fs.mkdir(backupDir, { recursive: true })
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupPath = path.join(backupDir, `inventory-backup-${timestamp}.json`)
      
      const currentData = await fs.readFile(this.inventoryPath, 'utf-8')
      await fs.writeFile(backupPath, currentData)
      
      // Keep only last 10 backups
      const backupFiles = await fs.readdir(backupDir)
      const backupInventoryFiles = backupFiles
        .filter(file => file.startsWith('inventory-backup-'))
        .sort()
        .reverse()
      
      if (backupInventoryFiles.length > 10) {
        for (const file of backupInventoryFiles.slice(10)) {
          await fs.unlink(path.join(backupDir, file))
        }
      }
    } catch (error) {
      console.error('Error creating backup:', error)
    }
  }
}
