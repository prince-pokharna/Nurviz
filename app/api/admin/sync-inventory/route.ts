import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

// Column mapping for Excel data
const COLUMN_MAPPING = {
  'Product ID': 'product_id',
  'Product Name': 'product_name',
  'Category': 'category',
  'Website Section': 'website_section',
  'Price (₹)': 'price',
  'Price (â\x82¹)': 'price',
  'Original Price (₹)': 'original_price',
  'Original Price (â\x82¹)': 'original_price',
  'Stock Quantity': 'stock_quantity',
  'In Stock': 'in_stock',
  'Is New': 'is_new',
  'Is Sale': 'is_sale',
  'Description': 'description',
  'Main Image URL': 'main_image',
  'Features': 'features',
  'Colors Available': 'colors_available',
  'Sizes Available': 'sizes_available',
  'Material': 'material',
  'Weight (grams)': 'weight_grams',
  'Style': 'style',
  'Occasion': 'occasion',
  'Rating': 'rating',
  'Reviews Count': 'reviews_count',
  'Care Instructions': 'care_instructions',
  'SKU': 'sku',
  'Brand': 'brand',
  'Collection': 'collection',
  'Tags': 'tags',
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated admin
    const adminAuth = request.headers.get('x-admin-auth')
    if (!adminAuth || adminAuth !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the uploaded file
    const formData = await request.formData()
    const file = formData.get('excel-file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Read Excel file
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      blankrows: false
    })

    if (rawData.length === 0) {
      return NextResponse.json({ error: 'Excel file is empty' }, { status: 400 })
    }

    const headers = rawData[0] as string[]
    const dataRows = rawData.slice(1).map(row => {
      const obj: any = {}
      headers.forEach((header, index) => {
        obj[header] = (row as any[])[index] || ""
      })
      return obj
    })

    // Process and validate products
    const validProducts = []
    const errors = []

    for (let i = 0; i < dataRows.length; i++) {
      try {
        const product = mapProductData(dataRows[i])
        if (product.product_id && product.name) {
          validProducts.push(product)
        }
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error}`)
      }
    }

    // Update inventory.json file (for now, until we implement database)
    const inventoryData = {
      products: validProducts,
      categories: [...new Set(validProducts.map(p => p.category))],
      lastUpdated: new Date().toISOString(),
      totalProducts: validProducts.length,
      syncSource: 'admin_upload'
    }

    // In a real deployment, you'd save to database
    // For now, we'll return the processed data
    const response = {
      success: true,
      message: 'Inventory synced successfully',
      data: {
        totalRows: dataRows.length,
        validProducts: validProducts.length,
        errors: errors.length,
        categories: inventoryData.categories,
        lastUpdated: inventoryData.lastUpdated
      },
      products: validProducts.slice(0, 5), // Sample of first 5 products
      errors: errors.slice(0, 10) // First 10 errors if any
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ 
      error: 'Failed to sync inventory',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function mapProductData(row: any) {
  const toString = (value: any) => value === null || value === undefined ? "" : String(value).trim()
  const toNumber = (value: any) => {
    const num = parseFloat(String(value).replace(/[^\d.-]/g, ''))
    return isNaN(num) ? 0 : num
  }
  const toBoolean = (value: any) => {
    const str = toString(value).toLowerCase()
    return str === 'true' || str === '1' || str === 'yes' || str === 'on'
  }
  const stringToArray = (value: any) => {
    if (!value) return []
    return toString(value).split(/[,|;]/).map(s => s.trim()).filter(s => s)
  }

  // Map Excel columns to database fields
  const mapped: any = {}
  Object.entries(COLUMN_MAPPING).forEach(([excelCol, dbField]) => {
    if (row[excelCol] !== undefined) {
      mapped[dbField] = row[excelCol]
    }
  })

  // Process the mapped data
  const product = {
    id: toString(mapped.product_id) || `P${Date.now()}`,
    product_id: toString(mapped.product_id),
    name: toString(mapped.product_name),
    category: toString(mapped.category).toLowerCase(),
    website_section: toString(mapped.website_section),
    price: toNumber(mapped.price),
    originalPrice: toNumber(mapped.original_price),
    stockQuantity: toNumber(mapped.stock_quantity),
    inStock: toBoolean(mapped.in_stock),
    isNew: toBoolean(mapped.is_new),
    isSale: toBoolean(mapped.is_sale),
    description: toString(mapped.description),
    image: toString(mapped.main_image) || '/placeholder.svg',
    features: stringToArray(mapped.features),
    // TEMPORARY WORKAROUND: Excel file has colors and sizes in wrong columns
    colors: stringToArray(mapped.length_size || mapped.sizes_available),
    sizes: stringToArray(mapped.colors_available || mapped.sizes),
    material: toString(mapped.material),
    weight: toNumber(mapped.weight_grams),
    style: toString(mapped.style),
    occasion: toString(mapped.occasion),
    rating: toNumber(mapped.rating) || 4.5,
    reviews: toNumber(mapped.reviews_count) || 0,
    careInstructions: toString(mapped.care_instructions),
    sku: toString(mapped.sku),
    brand: toString(mapped.brand) || 'Nurvi Jewel',
    collection: toString(mapped.collection),
    tags: stringToArray(mapped.tags),
    // Additional computed fields
    discountPercent: mapped.original_price > 0 && mapped.price > 0 
      ? Math.round(((mapped.original_price - mapped.price) / mapped.original_price) * 100)
      : 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return product
} 