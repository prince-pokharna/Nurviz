#!/usr/bin/env node

const { initializeDatabase, createTables, executeQuery, fetchAll, closeDatabase } = require('../lib/database');
const bcrypt = require('bcryptjs');

console.log('🔄 Starting database initialization...');

async function initializeNurviDatabase() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log('✅ Database connection established');

    // Create all tables and indexes
    await createTables();
    console.log('✅ Database schema created successfully');

    // Insert default categories
    await insertDefaultCategories();
    console.log('✅ Default categories inserted');

    // Create default admin user
    await createDefaultAdmin();
    console.log('✅ Default admin user created');

    // Initialize sync log
    await initializeSyncLog();
    console.log('✅ Sync log initialized');

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

async function insertDefaultCategories() {
  const categories = [
    { name: 'Rings', display_order: 1 },
    { name: 'Necklaces', display_order: 2 },
    { name: 'Earrings', display_order: 3 },
    { name: 'Bracelets', display_order: 4 },
    { name: 'Anklets', display_order: 5 },
    { name: 'Featured Products', display_order: 0 }
  ];

  for (const category of categories) {
    try {
      await executeQuery(
        'INSERT OR IGNORE INTO categories (name, display_order) VALUES (?, ?)',
        [category.name, category.display_order]
      );
      console.log(`✅ Category inserted: ${category.name}`);
    } catch (error) {
      console.log(`⚠️  Category may already exist: ${category.name}`);
    }
  }
}

async function createDefaultAdmin() {
  const adminEmail = 'admin@nurvijewel.com';
  const adminPassword = 'admin123'; // Change this in production!
  const adminName = 'Nurvi Admin';

  try {
    // Check if admin already exists
    const existingAdmin = await fetchAll('SELECT * FROM users WHERE email = ?', [adminEmail]);
    
    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    await executeQuery(
      `INSERT INTO users (email, name, password_hash, is_email_verified, is_admin) 
       VALUES (?, ?, ?, 1, 1)`,
      [adminEmail, adminName, passwordHash]
    );

    console.log('✅ Default admin user created');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('⚠️  IMPORTANT: Change the admin password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

async function initializeSyncLog() {
  try {
    await executeQuery(
      `INSERT INTO sync_logs (sync_type, status, started_at, completed_at) 
       VALUES ('database_init', 'completed', datetime('now'), datetime('now'))`
    );
  } catch (error) {
    console.error('❌ Error initializing sync log:', error);
  }
}

// Run initialization if called directly
if (require.main === module) {
  initializeNurviDatabase();
}

module.exports = { initializeNurviDatabase }; 