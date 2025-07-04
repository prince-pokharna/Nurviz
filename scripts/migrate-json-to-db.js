#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { initializeDatabase, executeQuery, fetchOne, closeDatabase } = require('../lib/database');

console.log('🔄 Starting JSON to Database migration...');

const INVENTORY_FILE = path.join(__dirname, '..', 'data', 'inventory.json');

async function migrateJsonToDatabase() {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database connection established');

    // Check if inventory.json exists
    const inventoryExists = await checkFileExists(INVENTORY_FILE);
    if (!inventoryExists) {
      console.log('⚠️  No inventory.json found, migration skipped');
      return;
    }

    // Read existing JSON data
    const inventoryData = JSON.parse(await fs.readFile(INVENTORY_FILE, 'utf8'));
    console.log('📊 Reading existing inventory.json...');

    if (!inventoryData.all || inventoryData.all.length === 0) {
      console.log('⚠️  No products found in inventory.json');
      return;
    }

    const products = inventoryData.all;
    console.log(`✅ Found ${products.length} products to migrate`);

    // Migrate products to database
    let successful = 0;
    let failed = 0;
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        // Check if product already exists
        const existing = await fetchOne('SELECT id FROM products WHERE product_id = ?', [product.id]);
        
        if (existing) {
          console.log(`⚠️  Product ${product.id} already exists, skipping...`);
          continue;
        }

        // Map JSON structure to database structure
        const dbProduct = mapJsonToDbProduct(product, i + 1);
        
        // Insert product
        await insertProduct(dbProduct);
        successful++;
        console.log(`✅ Migrated product ${i + 1}/${products.length}: ${product.name}`);
        
      } catch (error) {
        failed++;
        errors.push(`Product ${product.id}: ${error.message}`);
        console.error(`❌ Error migrating product ${product.id}:`, error.message);
      }
    }

    console.log(`🎉 Migration completed!`);
    console.log(`   - Successful: ${successful}`);
    console.log(`   - Failed: ${failed}`);
    
    if (errors.length > 0) {
      console.log('⚠️  Migration errors:');
      errors.forEach(error => console.log(`   ${error}`));
    }

    // Create backup of original JSON file
    await createBackup();
    
    // Generate updated JSON from database
    await generateUpdatedJson();

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
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

function mapJsonToDbProduct(jsonProduct, index) {
  // Helper functions
  const toString = (value) => value === null || value === undefined ? "" : String(value).trim();
  const toNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };
  const toBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    const str = toString(value).toLowerCase();
    return str === 'yes' || str === 'true' || str === '1' || value === true;
  };

  const now = new Date().toISOString();

  return {
    product_id: toString(jsonProduct.id || `legacy-${index}`),
    product_name: toString(jsonProduct.name),
    category: toString(jsonProduct.category),
    website_section: toString(jsonProduct.section),
    price: toNumber(jsonProduct.price),
    original_price: toNumber(jsonProduct.originalPrice),
    discount_percent: toNumber(jsonProduct.discount),
    main_image: toString(jsonProduct.image),
    image_2: toString(jsonProduct.images && jsonProduct.images[1]),
    image_3: toString(jsonProduct.images && jsonProduct.images[2]),
    image_4: toString(jsonProduct.images && jsonProduct.images[3]),
    description: toString(jsonProduct.description),
    material: toString(jsonProduct.material),
    weight_grams: toNumber(jsonProduct.weight),
    length_size: toString(jsonProduct.size),
    colors_available: Array.isArray(jsonProduct.colors) ? jsonProduct.colors.join(',') : toString(jsonProduct.colors),
    sizes_available: Array.isArray(jsonProduct.sizes) ? jsonProduct.sizes.join(',') : toString(jsonProduct.sizes),
    style: toString(jsonProduct.style),
    occasion: toString(jsonProduct.occasion),
    features: Array.isArray(jsonProduct.features) ? jsonProduct.features.join(',') : toString(jsonProduct.features),
    rating: toNumber(jsonProduct.rating),
    reviews_count: toNumber(jsonProduct.reviews),
    in_stock: toBoolean(jsonProduct.inStock),
    is_new: toBoolean(jsonProduct.isNew),
    is_sale: toBoolean(jsonProduct.isSale),
    care_instructions: toString(jsonProduct.careInstructions),
    sku: toString(jsonProduct.sku),
    brand: toString(jsonProduct.brand),
    collection: toString(jsonProduct.collection),
    tags: Array.isArray(jsonProduct.tags) ? jsonProduct.tags.join(',') : toString(jsonProduct.tags),
    seo_title: toString(jsonProduct.seoTitle),
    seo_description: toString(jsonProduct.seoDescription),
    date_added: jsonProduct.dateAdded || jsonProduct.createdAt || now,
    last_updated: jsonProduct.lastUpdated || jsonProduct.updatedAt || now,
    stock_quantity: toNumber(jsonProduct.inventory?.stock || 0),
    minimum_stock: toNumber(jsonProduct.inventory?.minimumStock || 0),
    cost_price: toNumber(jsonProduct.inventory?.costPrice || 0),
    uniqueness_factor: toString(jsonProduct.contentCreator?.uniquenessFactor),
    anti_tarnish: toBoolean(jsonProduct.contentCreator?.antiTarnish),
    social_media_tags: toString(jsonProduct.social?.socialMediaTags),
    instagram_hashtags: toString(jsonProduct.social?.instagramHashtags),
    created_at: now,
    updated_at: now
  };
}

async function insertProduct(product) {
  const columns = Object.keys(product);
  const placeholders = columns.map(() => '?').join(', ');
  const values = Object.values(product);
  
  const sql = `INSERT INTO products (${columns.join(', ')}) VALUES (${placeholders})`;
  await executeQuery(sql, values);
}

async function createBackup() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'data', 'backups');
    const backupFile = path.join(backupDir, `inventory-json-backup-${timestamp}.json`);
    
    // Ensure backup directory exists
    try {
      await fs.access(backupDir);
    } catch {
      await fs.mkdir(backupDir, { recursive: true });
    }
    
    // Copy original file to backup
    await fs.copyFile(INVENTORY_FILE, backupFile);
    console.log(`✅ Backup created: ${backupFile}`);
  } catch (error) {
    console.log('⚠️  Could not create backup:', error.message);
  }
}

async function generateUpdatedJson() {
  try {
    // This will be handled by the enhanced sync script
    console.log('✅ Database migration complete. Run npm run sync-inventory to generate updated JSON.');
  } catch (error) {
    console.error('❌ Error generating updated JSON:', error);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateJsonToDatabase();
}

module.exports = { migrateJsonToDatabase }; 