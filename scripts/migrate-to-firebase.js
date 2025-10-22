#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Firebase Admin configuration
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  projectId: process.env.FIREBASE_PROJECT_ID,
};

// Initialize Firebase Admin
const adminApp = initializeApp(firebaseAdminConfig);
const db = getFirestore(adminApp);

console.log('🔥 Firebase Migration Script for Nurvi Jewel');
console.log('============================================\n');

async function migrateData() {
  try {
    console.log('📊 Starting data migration to Firebase...\n');

    // Migrate inventory data
    await migrateInventory();
    
    // Migrate orders data
    await migrateOrders();
    
    // Create default categories
    await createDefaultCategories();
    
    // Create default admin user
    await createDefaultAdmin();
    
    console.log('\n✅ Migration completed successfully!');
    console.log('🎉 Your data is now stored in Firebase Firestore');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function migrateInventory() {
  try {
    console.log('📦 Migrating inventory data...');
    
    const inventoryPath = path.join(process.cwd(), 'data', 'inventory.json');
    const inventoryData = await fs.readFile(inventoryPath, 'utf8');
    const inventory = JSON.parse(inventoryData);
    
    let products = [];
    if (Array.isArray(inventory)) {
      products = inventory;
    } else if (inventory.all && Array.isArray(inventory.all)) {
      products = inventory.all;
    }
    
    console.log(`Found ${products.length} products to migrate`);
    
    let migratedCount = 0;
    for (const product of products) {
      try {
        // Clean and format product data
        const cleanProduct = {
          product_id: product.id || product.product_id || `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          product_name: product.name || product.product_name || 'Unnamed Product',
          category: product.category || 'Uncategorized',
          website_section: product.section || product.website_section || 'General',
          price: parseFloat(product.price) || 0,
          original_price: parseFloat(product.originalPrice) || parseFloat(product.original_price) || null,
          discount_percent: parseFloat(product.discount_percent) || null,
          main_image: product.image || product.main_image || '',
          image_2: product.image_2 || '',
          image_3: product.image_3 || '',
          image_4: product.image_4 || '',
          images: product.images || [],
          description: product.description || '',
          material: product.material || 'Gold Plated Brass',
          weight_grams: parseFloat(product.weight) || parseFloat(product.weight_grams) || null,
          length_size: product.length_size || '',
          colors_available: product.colors_available || '',
          sizes_available: product.sizes_available || '',
          style: product.style || '',
          occasion: product.occasion || '',
          features: product.features || '',
          rating: parseFloat(product.rating) || 0,
          reviews_count: parseInt(product.reviews_count) || 0,
          in_stock: product.inStock !== undefined ? product.inStock : (product.in_stock !== undefined ? product.in_stock : true),
          is_new: product.isNew || product.is_new || false,
          is_sale: product.isSale || product.is_sale || false,
          care_instructions: product.care_instructions || '',
          sku: product.sku || '',
          brand: product.brand || 'Nurvi Jewel',
          collection: product.collection || '',
          tags: product.tags || '',
          seo_title: product.seo_title || '',
          seo_description: product.seo_description || '',
          stock_quantity: parseInt(product.inventory?.stock) || parseInt(product.stock_quantity) || 0,
          minimum_stock: parseInt(product.inventory?.minimumStock) || parseInt(product.minimum_stock) || 5,
          cost_price: parseFloat(product.cost_price) || null,
          uniqueness_factor: product.uniqueness_factor || '',
          anti_tarnish: product.anti_tarnish || true,
          social_media_tags: product.social_media_tags || '',
          instagram_hashtags: product.instagram_hashtags || '',
          created_at: new Date(),
          updated_at: new Date()
        };
        
        // Add to Firestore
        await db.collection('products').add(cleanProduct);
        migratedCount++;
        
        if (migratedCount % 10 === 0) {
          console.log(`  ✅ Migrated ${migratedCount}/${products.length} products`);
        }
        
      } catch (error) {
        console.error(`  ❌ Error migrating product ${product.id || product.name}:`, error.message);
      }
    }
    
    console.log(`✅ Inventory migration completed: ${migratedCount}/${products.length} products migrated`);
    
  } catch (error) {
    console.error('❌ Error migrating inventory:', error);
  }
}

async function migrateOrders() {
  try {
    console.log('📋 Migrating orders data...');
    
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    
    try {
      const ordersData = await fs.readFile(ordersPath, 'utf8');
      const orders = JSON.parse(ordersData);
      
      console.log(`Found ${orders.length} orders to migrate`);
      
      let migratedCount = 0;
      for (const order of orders) {
        try {
          const cleanOrder = {
            order_id: order.order_id || order.id || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            user_id: order.user_id || null,
            customer_email: order.customer_email || order.email || '',
            customer_name: order.customer_name || order.name || '',
            customer_phone: order.customer_phone || order.phone || '',
            total_amount: parseFloat(order.total_amount) || parseFloat(order.total) || 0,
            discount_amount: parseFloat(order.discount_amount) || 0,
            shipping_amount: parseFloat(order.shipping_amount) || 0,
            tax_amount: parseFloat(order.tax_amount) || 0,
            payment_status: order.payment_status || 'pending',
            order_status: order.order_status || 'processing',
            payment_method: order.payment_method || '',
            payment_id: order.payment_id || '',
            shipping_address: order.shipping_address || '',
            billing_address: order.billing_address || '',
            notes: order.notes || '',
            created_at: order.created_at ? new Date(order.created_at) : new Date(),
            updated_at: new Date()
          };
          
          await db.collection('orders').add(cleanOrder);
          migratedCount++;
          
        } catch (error) {
          console.error(`  ❌ Error migrating order ${order.id}:`, error.message);
        }
      }
      
      console.log(`✅ Orders migration completed: ${migratedCount}/${orders.length} orders migrated`);
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('📋 No orders file found, skipping orders migration');
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error('❌ Error migrating orders:', error);
  }
}

async function createDefaultCategories() {
  try {
    console.log('📂 Creating default categories...');
    
    const categories = [
      { name: 'Rings', display_order: 1, is_active: true },
      { name: 'Necklaces', display_order: 2, is_active: true },
      { name: 'Earrings', display_order: 3, is_active: true },
      { name: 'Bracelets', display_order: 4, is_active: true },
      { name: 'Anklets', display_order: 5, is_active: true }
    ];
    
    for (const category of categories) {
      try {
        await db.collection('categories').add({
          ...category,
          created_at: new Date()
        });
      } catch (error) {
        console.error(`  ❌ Error creating category ${category.name}:`, error.message);
      }
    }
    
    console.log('✅ Default categories created');
    
  } catch (error) {
    console.error('❌ Error creating categories:', error);
  }
}

async function createDefaultAdmin() {
  try {
    console.log('👤 Creating default admin user...');
    
    const adminUser = {
      email: 'admin@nurvijewel.com',
      name: 'Nurvi Jewel Admin',
      is_email_verified: true,
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await db.collection('users').add(adminUser);
    console.log('✅ Default admin user created');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

// Run migration
migrateData();
