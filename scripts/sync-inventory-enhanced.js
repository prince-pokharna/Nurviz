#!/usr/bin/env node

const XLSX = require('xlsx');
const fs = require('fs').promises;
const path = require('path');
const { initializeDatabase, executeQuery, fetchAll, fetchOne, closeDatabase } = require('../lib/database');

console.log('🔄 Starting inventory sync...');

// Check if we're in a serverless environment  
const isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME;

if (isServerless) {
  console.log('🌐 Detected serverless environment - skipping inventory sync');
  console.log('📄 Inventory will be loaded from JSON files');
  console.log('✅ Inventory sync complete (using JSON fallback)');
  process.exit(0);
}

// Configuration
const EXCEL_FILE = path.join(__dirname, '..', 'Stock-Management-Inventory-Updated.xlsx');
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const BACKUP_DIR = path.join(OUTPUT_DIR, 'backups');

// Enhanced Excel Schema Mapping with proper column mapping
const COLUMN_MAPPING = {
  'Product ID': 'product_id',
  'Product_ID': 'product_id',
  'Product Name': 'product_name', 
  'Product_Name': 'product_name',
  'Category': 'category',
  'Website Section': 'website_section',
  'Website_Section': 'website_section',
  'Price (₹)': 'price',
  'Price (â\x82¹)': 'price', // Handle encoding issues
  'Price': 'price',
  'Original Price (₹)': 'original_price',
  'Original Price (â\x82¹)': 'original_price', // Handle encoding issues
  'Original_Price': 'original_price',
  'Discount %': 'discount_percent',
  'Discount_Percent': 'discount_percent',
  'Main Image URL': 'main_image',
  'Main_Image': 'main_image',
  'Image 2 URL': 'image_2',
  'Image_2': 'image_2',
  'Image 3 URL': 'image_3',
  'Image_3': 'image_3',
  'Image 4 URL': 'image_4',
  'Image_4': 'image_4',
  'Description': 'description',
  'Material': 'material',
  'Weight (grams)': 'weight_grams',
  'Weight_Grams': 'weight_grams',
  'Length/Size': 'sizes_available',  // CORRECTED: This contains actual size info
  'Length_Size': 'sizes_available',
  'Colors Available': 'colors_available',  // CORRECT: This contains actual colors
  'Colors_Available': 'colors_available',
  'Sizes Available': 'product_variants',  // CORRECTED: This contains variants, not sizes
  'Sizes_Available': 'product_variants',
  'Style': 'style',
  'Occasion': 'occasion',
  'Features': 'features',
  'Rating': 'rating',

  'In Stock': 'in_stock',
  'In_Stock': 'in_stock',
  'Is New': 'is_new',
  'Is_New': 'is_new',
  'Is Sale': 'is_sale',
  'Is_Sale': 'is_sale',
  'Care Instructions': 'care_instructions',
  'Care_Instructions': 'care_instructions',
  'SKU': 'sku',
  'Brand': 'brand',
  'Collection': 'collection',
  'Tags': 'tags',

  'Minimum Stock': 'minimum_stock',
  'Minimum_Stock': 'minimum_stock',
  'Cost Price': 'cost_price',
  'Cost_Price': 'cost_price',
  'Uniqueness Factor': 'uniqueness_factor',
  'Uniqueness_Factor': 'uniqueness_factor',
  'Anti-Tarnish': 'anti_tarnish',
  'Anti_Tarnish': 'anti_tarnish',

  'Instagram Hashtags': 'instagram_hashtags',
  'Instagram_Hashtags': 'instagram_hashtags'
};

async function syncInventoryEnhanced() {
  let syncLogId = null;
  
  try {
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database connection established');

    // Create sync log entry
    syncLogId = await createSyncLog('full_sync', path.basename(EXCEL_FILE));
    
    // Ensure directories exist
    await ensureDirectories();
    
    // Check if Excel file exists
    const excelExists = await checkFileExists(EXCEL_FILE);
    if (!excelExists) {
      throw new Error(`Excel file not found: ${EXCEL_FILE}`);
    }

    console.log('📊 Reading Excel file:', EXCEL_FILE);
    
    // Read and process Excel file
    const { rawData, headers } = await readExcelFile(EXCEL_FILE);
    console.log(`✅ Found ${rawData.length} rows in Excel file`);
    console.log('📋 Headers:', headers);

    // Filter and validate product data
    const validProducts = await validateAndFilterProducts(rawData);
    console.log(`✅ Found ${validProducts.length} valid products after filtering`);

    // Create backup before sync
    await createBackup();
    
    // ALWAYS generate JSON output for local development
    await generateJSONOutput(validProducts);
    
    // Also sync to database if available
    const syncResult = await syncProductsToDatabase(validProducts);
    console.log(`✅ Sync completed: ${syncResult.successful} successful, ${syncResult.failed} failed`);
    
    // Update sync log
    await updateSyncLog(syncLogId, 'completed', validProducts.length, syncResult.successful, syncResult.failed);
    
    console.log('🎉 Enhanced inventory synchronization completed successfully!');
    
  } catch (error) {
    console.error('❌ Enhanced sync failed:', error);
    if (syncLogId) {
      await updateSyncLog(syncLogId, 'failed', 0, 0, 0, error.message);
    }
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

async function ensureDirectories() {
  const dirs = [OUTPUT_DIR, IMAGES_DIR, BACKUP_DIR];
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  }
}

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON with headers
  const rawData = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1,
    defval: "",
    blankrows: false
  });
  
  if (rawData.length === 0) {
    throw new Error('Excel file is empty');
  }
  
  const headers = rawData[0];
  const dataRows = rawData.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });
    return obj;
  });
  
  return { rawData: dataRows, headers };
}

async function validateAndFilterProducts(rawData) {
  const validProducts = [];
  const errors = [];
  
  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    const productId = String(row['Product ID'] || row['Product_ID'] || '').trim();
    
    // Skip empty rows, comment rows, or header rows
    if (!productId || 
        productId.startsWith('#') || 
        productId.includes('SECTION') ||
        productId.includes('FEATURED PRODUCTS') ||
        productId.includes('COLLECTIONS PAGE') ||
        productId.includes('INVENTORY SUMMARY') ||
        productId.includes('Note:') ||
        productId === 'Product ID') {
      continue;
    }
    
    // Validate required fields
    const productName = String(row['Product Name'] || row['Product_Name'] || '').trim();
    if (!productName) {
      errors.push(`Row ${i + 2}: Missing product name for ID ${productId}`);
      continue;
    }
    
    // Map and validate product data
    try {
      const mappedProduct = mapProductData(row);
      validProducts.push(mappedProduct);
    } catch (error) {
      errors.push(`Row ${i + 2}: ${error.message}`);
    }
  }
  
  if (errors.length > 0) {
    console.log('⚠️  Validation warnings:');
    errors.forEach(error => console.log(`   ${error}`));
  }
  
  return validProducts;
}

function mapProductData(row) {
  const product = {};
  
  // Helper functions
  const toString = (value) => value === null || value === undefined ? "" : String(value).trim();
  const toNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };
  const toBoolean = (value) => {
    const str = toString(value).toLowerCase();
    return str === 'yes' || str === 'true' || str === '1';
  };
  
  // Map all columns using the mapping
  for (const [excelColumn, dbColumn] of Object.entries(COLUMN_MAPPING)) {
    const value = row[excelColumn];
    
    if (value !== undefined) {
      switch (dbColumn) {
        case 'price':
        case 'original_price':
        case 'discount_percent':
        case 'weight_grams':
        case 'rating':
        case 'reviews_count':
        case 'stock_quantity':
        case 'minimum_stock':
        case 'cost_price':
          product[dbColumn] = toNumber(value);
          break;
        case 'in_stock':
        case 'is_new':
        case 'is_sale':
        case 'anti_tarnish':
          product[dbColumn] = toBoolean(value);
          break;
        default:
          product[dbColumn] = toString(value);
      }
    }
  }
  
  // Set defaults for required fields
  if (!product.product_id) {
    throw new Error('Product ID is required');
  }
  if (!product.product_name) {
    throw new Error('Product name is required');
  }
  
  // Set current timestamp if dates are missing
  const now = new Date().toISOString();
  if (!product.date_added) product.date_added = now;
  if (!product.last_updated) product.last_updated = now;
  
  // Add default pricing if missing
  if (!product.price || product.price === 0) {
    // Set default prices based on category
    const categoryPricing = {
      'rings': 1500,
      'necklaces': 2500,
      'earrings': 1200,
      'bracelets': 1800,
      'anklets': 1000,
      'featured': 2000
    };
    
    const category = product.category?.toLowerCase() || '';
    const defaultPrice = Object.keys(categoryPricing).find(key => category.includes(key));
    product.price = defaultPrice ? categoryPricing[defaultPrice] : 1500;
    
    // Set original price if it's a sale item
    if (product.is_sale && (!product.original_price || product.original_price === 0)) {
      product.original_price = Math.round(product.price * 1.25); // 25% discount
    }
  }
  
  return product;
}

async function createSyncLog(syncType, fileName) {
  const result = await executeQuery(
    `INSERT INTO sync_logs (sync_type, file_name, started_at, status) 
     VALUES (?, ?, datetime('now'), 'running')`,
    [syncType, fileName]
  );
  return result.id;
}

async function updateSyncLog(id, status, totalRecords = 0, successfulRecords = 0, failedRecords = 0, errors = null) {
  await executeQuery(
    `UPDATE sync_logs 
     SET status = ?, total_records = ?, successful_records = ?, failed_records = ?, 
         errors = ?, completed_at = datetime('now')
     WHERE id = ?`,
    [status, totalRecords, successfulRecords, failedRecords, errors, id]
  );
}

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `inventory-backup-${timestamp}.json`);
  
  try {
    // Export current database products to backup
    const products = await fetchAll('SELECT * FROM products');
    await fs.writeFile(backupFile, JSON.stringify(products, null, 2));
    console.log(`✅ Backup created: ${backupFile}`);
  } catch (error) {
    console.log('⚠️  Could not create backup:', error.message);
  }
}

async function syncProductsToDatabase(products) {
  let successful = 0;
  let failed = 0;
  const errors = [];
  
  for (const product of products) {
    try {
      // Check if product exists
      const existing = await fetchOne('SELECT id FROM products WHERE product_id = ?', [product.product_id]);
      
      if (existing) {
        // Update existing product
        await updateProduct(product);
      } else {
        // Insert new product
        await insertProduct(product);
      }
      successful++;
    } catch (error) {
      failed++;
      errors.push(`Product ${product.product_id}: ${error.message}`);
      console.error(`❌ Error syncing product ${product.product_id}:`, error.message);
    }
  }
  
  if (errors.length > 0) {
    console.log('⚠️  Sync errors:');
    errors.forEach(error => console.log(`   ${error}`));
  }
  
  return { successful, failed, errors };
}

async function insertProduct(product) {
  const columns = Object.keys(product);
  const placeholders = columns.map(() => '?').join(', ');
  const values = Object.values(product);
  
  const sql = `INSERT INTO products (${columns.join(', ')}) VALUES (${placeholders})`;
  await executeQuery(sql, values);
}

async function updateProduct(product) {
  const columns = Object.keys(product).filter(col => col !== 'product_id');
  const setClause = columns.map(col => `${col} = ?`).join(', ');
  const values = columns.map(col => product[col]);
  values.push(product.product_id);
  
  const sql = `UPDATE products SET ${setClause}, updated_at = datetime('now') WHERE product_id = ?`;
  await executeQuery(sql, values);
}

async function generateJSONOutput(products) {
  try {
    // Transform products to match frontend interface
    const transformedProducts = products.map(p => {
      // Helper function to fix image paths
      const fixImagePath = (imagePath) => {
        if (!imagePath) return '';
        // If path already starts with /images, return as is
        if (imagePath.startsWith('/images/')) return imagePath;
        // If path starts with /products, prepend /images
        if (imagePath.startsWith('/products/')) return `/images${imagePath}`;
        // If path doesn't start with /, prepend /images/products/
        if (!imagePath.startsWith('/')) return `/images/products/${imagePath}`;
        // Default case
        return imagePath;
      };

      // Helper function to split pipe-separated values
      const splitPipeValues = (value) => {
        if (!value) return [];
        return String(value).split('|').map(v => v.trim()).filter(Boolean);
      };

      // Helper function to detect if a value contains colors or sizes
      const detectDataType = (value) => {
        if (!value) return 'unknown';
        const str = String(value).toLowerCase();
        
        // Common color keywords
        const colorKeywords = ['gold', 'silver', 'rose gold', 'white gold', 'black', 'white', 'red', 'blue', 'green', 'pink', 'purple', 'yellow', 'bronze', 'copper', 'platinum'];
        
        // Common size keywords
        const sizeKeywords = ['small', 'medium', 'large', 'xs', 'xl', 'xxl', 'inches', 'cm', 'mm', 'adjustable', 'one size', 'diameter', 'length', 'width'];
        
        // Check if contains color keywords
        const hasColors = colorKeywords.some(color => str.includes(color));
        
        // Check if contains size keywords
        const hasSizes = sizeKeywords.some(size => str.includes(size));
        
        if (hasColors && !hasSizes) return 'colors';
        if (hasSizes && !hasColors) return 'sizes';
        if (hasColors && hasSizes) return 'mixed';
        
        return 'unknown';
      };

      // Intelligently map colors and sizes based on content
      const rawColorsField = splitPipeValues(p.colors_available);
      const rawSizesField = splitPipeValues(p.sizes_available);
      
      const colorsFieldType = detectDataType(p.colors_available);
      const sizesFieldType = detectDataType(p.sizes_available);
      
      let actualColors = [];
      let actualSizes = [];
      
      // Smart mapping based on content detection
      if (colorsFieldType === 'colors') {
        actualColors = rawColorsField;
      } else if (colorsFieldType === 'sizes') {
        actualSizes = rawColorsField;
      } else {
        actualColors = rawColorsField; // Default to colors if unknown
      }
      
      if (sizesFieldType === 'sizes') {
        actualSizes = rawSizesField;
      } else if (sizesFieldType === 'colors') {
        actualColors = rawSizesField;
      } else {
        actualSizes = rawSizesField; // Default to sizes if unknown
      }
      
      // If we still don't have colors, try to get them from sizes field
      if (actualColors.length === 0 && sizesFieldType === 'colors') {
        actualColors = rawSizesField;
      }
      
      // If we still don't have sizes, try to get them from colors field
      if (actualSizes.length === 0 && colorsFieldType === 'sizes') {
        actualSizes = rawColorsField;
      }

      return {
        id: p.product_id,
        name: p.product_name,
        price: p.price || 0,
        originalPrice: p.original_price > 0 ? p.original_price : undefined,
        image: fixImagePath(p.main_image),
        images: [p.main_image, p.image_2, p.image_3, p.image_4].filter(Boolean).map(fixImagePath),
        category: p.category,
        section: p.website_section,
        description: p.description,
        material: p.material,
        weight: p.weight_grams,
        size: p.sizes_available, // This now contains actual size info
        // INTELLIGENT MAPPING: Detect and map colors/sizes based on content
        colors: actualColors,
        sizes: actualSizes,
        variants: splitPipeValues(p.product_variants), // Contains product variants
        style: p.style,
        occasion: p.occasion,
        features: splitPipeValues(p.features),
        rating: p.rating || 0,
        reviews: p.reviews_count || 0,
        inStock: Boolean(p.in_stock),
        isNew: Boolean(p.is_new),
        isSale: Boolean(p.is_sale),
        careInstructions: p.care_instructions,
        sku: p.sku,
        brand: p.brand || "Nurvi Jewel",
        collection: p.collection,
        tags: splitPipeValues(p.tags || p.collection),
        seoTitle: p.seo_title,
        seoDescription: p.seo_description,
        dateAdded: p.date_added,
        lastUpdated: p.last_updated || new Date().toISOString(),
        inventory: {
          stock: p.stock_quantity || 0,
          minimumStock: p.minimum_stock || 0,
          costPrice: p.cost_price || 0
        },
        contentCreator: {
          uniquenessFactor: p.uniqueness_factor,
          antiTarnish: Boolean(p.anti_tarnish)
        },
        social: {
          socialMediaTags: p.social_media_tags,
          instagramHashtags: p.instagram_hashtags
        },

        // Keep original database fields for backward compatibility
        ...p
      };
    });
    
    // Categorize products
    const categorizedData = {
      all: transformedProducts,
      featured: transformedProducts.filter(p => 
        p.category === 'Featured Products' || 
        p.website_section === 'Featured Products' || 
        (p.notes && p.notes.includes('FEATURED'))
      ),
      rings: transformedProducts.filter(p => 
        (p.category && p.category.toLowerCase().includes('ring')) ||
        p.website_section === 'Rings Page'
      ),
      necklaces: transformedProducts.filter(p => 
        (p.category && p.category.toLowerCase().includes('necklace')) ||
        p.website_section === 'Necklaces Page'
      ),
      earrings: transformedProducts.filter(p => 
        (p.category && p.category.toLowerCase().includes('earring')) ||
        p.website_section === 'Earrings Page'
      ),
      bracelets: transformedProducts.filter(p => 
        (p.category && p.category.toLowerCase().includes('bracelet')) ||
        p.website_section === 'Bracelets Page'
      ),
      anklets: transformedProducts.filter(p => 
        (p.category && p.category.toLowerCase().includes('anklet')) ||
        p.website_section === 'Anklets Page'
      ),
      collections: transformedProducts.filter(p => p.website_section === 'Collections Page'),
      
      // Page-specific collections
      ringsPage: transformedProducts.filter(p => p.website_section === 'Rings Page'),
      necklacesPage: transformedProducts.filter(p => p.website_section === 'Necklaces Page'),
      earringsPage: transformedProducts.filter(p => p.website_section === 'Earrings Page'),
      braceletsPage: transformedProducts.filter(p => p.website_section === 'Bracelets Page'),
      ankletsPage: transformedProducts.filter(p => p.website_section === 'Anklets Page'),
      
      // Special filters
      onSale: transformedProducts.filter(p => p.isSale),
      newArrivals: transformedProducts.filter(p => p.isNew),
      inStock: transformedProducts.filter(p => p.inStock),
      contentCreatorReady: transformedProducts.filter(p => p.contentCreator.antiTarnish)
    };
    
    // Write JSON file for backward compatibility
    const outputPath = path.join(OUTPUT_DIR, 'inventory.json');
    await fs.writeFile(outputPath, JSON.stringify(categorizedData, null, 2));
    
    console.log(`✅ JSON output generated: ${outputPath}`);
    console.log(`📊 Categories summary:`);
    console.log(`   - Total products: ${categorizedData.all.length}`);
    console.log(`   - Featured: ${categorizedData.featured.length}`);
    console.log(`   - Collections Page: ${categorizedData.collections.length}`);
    console.log(`   - On Sale: ${categorizedData.onSale.length}`);
    console.log(`   - New Arrivals: ${categorizedData.newArrivals.length}`);
    console.log(`   - In Stock: ${categorizedData.inStock.length}`);
    
  } catch (error) {
    console.error('❌ Error generating JSON output:', error);
  }
}

// Run sync if called directly
if (require.main === module) {
  syncInventoryEnhanced();
}

module.exports = { syncInventoryEnhanced }; 