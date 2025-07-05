// Database Schema and Connection Setup for Nurvi Jewels E-commerce Platform
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(process.cwd(), 'data', 'nurvi_jewels.db');

// Initialize database connection
let db = null;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err.message);
        reject(err);
      } else {
        console.log('✅ Connected to SQLite database');
        resolve(db);
      }
    });
  });
};

// Database Schema Creation
const createTables = () => {
  return new Promise((resolve, reject) => {
    const tables = [
      // Products table with streamlined schema
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id VARCHAR(50) UNIQUE NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        website_section VARCHAR(100),
        price DECIMAL(10,2),
        original_price DECIMAL(10,2),
        discount_percent DECIMAL(5,2),
        main_image VARCHAR(255),
        image_2 VARCHAR(255),
        image_3 VARCHAR(255),
        image_4 VARCHAR(255),
        description TEXT,
        material VARCHAR(100),
        weight_grams DECIMAL(8,2),
        length_size VARCHAR(50),
        colors_available TEXT,
        sizes_available TEXT,
        style VARCHAR(100),
        occasion VARCHAR(100),
        features TEXT,
        rating DECIMAL(3,2),
        reviews_count INTEGER DEFAULT 0,
        in_stock BOOLEAN DEFAULT true,
        is_new BOOLEAN DEFAULT false,
        is_sale BOOLEAN DEFAULT false,
        care_instructions TEXT,
        sku VARCHAR(100) UNIQUE,
        brand VARCHAR(100),
        collection VARCHAR(100),
        tags TEXT,
        seo_title VARCHAR(255),
        seo_description TEXT,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        stock_quantity INTEGER DEFAULT 0,
        minimum_stock INTEGER DEFAULT 0,
        cost_price DECIMAL(10,2),
        uniqueness_factor TEXT,
        anti_tarnish BOOLEAN DEFAULT false,
        social_media_tags TEXT,
        instagram_hashtags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Categories table for dynamic categorization
      `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) UNIQUE NOT NULL,
        parent_id INTEGER,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Users table for authentication
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        is_email_verified BOOLEAN DEFAULT false,
        is_admin BOOLEAN DEFAULT false,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Email verifications table for OTP management
      `CREATE TABLE IF NOT EXISTS email_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        type VARCHAR(20) NOT NULL, -- 'registration', 'login', 'password_reset'
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Password reset tokens table
      `CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Orders table
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        user_id INTEGER,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        total_amount DECIMAL(10,2) NOT NULL,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        shipping_amount DECIMAL(10,2) DEFAULT 0,
        tax_amount DECIMAL(10,2) DEFAULT 0,
        payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
        order_status VARCHAR(50) DEFAULT 'processing', -- processing, shipped, delivered, cancelled
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        shipping_address TEXT,
        billing_address TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Order items table
      `CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        product_details TEXT, -- JSON string with product details at time of order
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id)
      )`,

      // Sync logs table for Excel synchronization tracking
      `CREATE TABLE IF NOT EXISTS sync_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sync_type VARCHAR(50) NOT NULL, -- 'full_sync', 'partial_sync', 'image_sync'
        file_name VARCHAR(255),
        total_records INTEGER,
        successful_records INTEGER,
        failed_records INTEGER,
        errors TEXT, -- JSON string of errors
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'running', -- running, completed, failed
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Wishlist table
      `CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, product_id)
      )`,

      // Cart table
      `CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, product_id)
      )`,

      // Notifications table for email/SMS tracking
      `CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        email VARCHAR(255),
        phone VARCHAR(20),
        type VARCHAR(50) NOT NULL, -- 'order_confirmation', 'order_update', 'otp', 'password_reset'
        subject VARCHAR(255),
        message TEXT,
        channel VARCHAR(20) NOT NULL, -- 'email', 'sms'
        status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
        sent_at TIMESTAMP,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`
    ];

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
      'CREATE INDEX IF NOT EXISTS idx_products_section ON products(website_section)',
      'CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)',
      'CREATE INDEX IF NOT EXISTS idx_products_stock ON products(in_stock)',
      'CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status)',
      'CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email)',
      'CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)'
    ];

    let completedTables = 0;
    let completedIndexes = 0;
    const totalOperations = tables.length + indexes.length;

    // Create tables
    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Error creating table ${index + 1}:`, err.message);
          reject(err);
        } else {
          completedTables++;
          console.log(`✅ Created table ${index + 1}/${tables.length}`);
          
          if (completedTables === tables.length) {
            // Create indexes after all tables are created
            indexes.forEach((indexSql, indexIdx) => {
              db.run(indexSql, (indexErr) => {
                if (indexErr) {
                  console.error(`❌ Error creating index ${indexIdx + 1}:`, indexErr.message);
                } else {
                  completedIndexes++;
                  console.log(`✅ Created index ${indexIdx + 1}/${indexes.length}`);
                  
                  if (completedIndexes === indexes.length) {
                    console.log('✅ All database tables and indexes created successfully');
                    resolve(db);
                  }
                }
              });
            });
          }
        }
      });
    });
  });
};

// Database utility functions
const executeQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const fetchOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const fetchAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err.message);
        } else {
          console.log('✅ Database connection closed');
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  initializeDatabase,
  createTables,
  executeQuery,
  fetchOne,
  fetchAll,
  closeDatabase,
  db: () => db
}; 