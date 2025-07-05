const fs = require('fs').promises;
const path = require('path');

console.log('🔄 Database fallback system loaded for Vercel deployment');

// Fallback data paths
const INVENTORY_FILE = path.join(process.cwd(), 'data', 'inventory.json');
const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Check if we're in a serverless environment or build environment
const isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';

async function readJSONFile(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(`📄 Using default value for ${path.basename(filePath)}`);
    return defaultValue;
  }
}

async function writeJSONFile(filePath, data) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error writing JSON file:', error);
    return false;
  }
}

// Database fallback functions
const fallbackDB = {
  // Initialize database (no-op for JSON)
  async initializeDatabase() {
    console.log('✅ Database fallback initialized (JSON files)');
    return true;
  },

  // Close database (no-op for JSON)
  async closeDatabase() {
    console.log('✅ Database fallback closed');
    return true;
  },

  // Execute query (simulated with JSON operations)
  async executeQuery(sql, params = []) {
    console.log('📝 Simulated query execution:', sql.substring(0, 50) + '...');
    return { id: Date.now(), changes: 1 };
  },

  // Fetch all products
  async fetchAll(table = 'products') {
    if (table === 'products' || table.includes('products')) {
      const inventory = await readJSONFile(INVENTORY_FILE, []);
      return Array.isArray(inventory) ? inventory : inventory.all || [];
    }
    return [];
  },

  // Fetch single product
  async fetchOne(sql, params = []) {
    const products = await this.fetchAll('products');
    if (params[0]) {
      return products.find(p => p.id === params[0] || p.product_id === params[0]) || null;
    }
    return products[0] || null;
  },

  // Get inventory data
  async getInventory() {
    try {
      const data = await readJSONFile(INVENTORY_FILE, { all: [], featured: [], collections: [] });
      
      // If data is an array, convert to expected format
      if (Array.isArray(data)) {
        return {
          all: data,
          featured: data.filter(p => p.section === 'Featured Products').slice(0, 6),
          collections: data.filter(p => p.section === 'Collections Page').slice(0, 20),
          categories: {
            necklaces: data.filter(p => p.category?.toLowerCase().includes('necklace')),
            rings: data.filter(p => p.category?.toLowerCase().includes('ring')),
            earrings: data.filter(p => p.category?.toLowerCase().includes('earring')),
            bracelets: data.filter(p => p.category?.toLowerCase().includes('bracelet')),
            anklets: data.filter(p => p.category?.toLowerCase().includes('anklet'))
          }
        };
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error reading inventory:', error);
      return { all: [], featured: [], collections: [], categories: {} };
    }
  },

  // Save orders
  async saveOrder(orderData) {
    try {
      const orders = await readJSONFile(ORDERS_FILE, []);
      const newOrder = {
        id: Date.now().toString(),
        ...orderData,
        created_at: new Date().toISOString()
      };
      orders.push(newOrder);
      await writeJSONFile(ORDERS_FILE, orders);
      return newOrder;
    } catch (error) {
      console.error('❌ Error saving order:', error);
      throw error;
    }
  },

  // Get orders
  async getOrders() {
    return await readJSONFile(ORDERS_FILE, []);
  }
};

// Export only fallback functions for now to avoid SQLite dependency issues
console.log('📦 Exporting database fallback functions (serverless mode)');

module.exports = {
  isServerless: true,
  fallbackDB,
  
  // Main database functions that only use fallback
  async initializeDatabase() {
    return await fallbackDB.initializeDatabase();
  },

  async closeDatabase() {
    return await fallbackDB.closeDatabase();
  },

  async executeQuery(sql, params) {
    return await fallbackDB.executeQuery(sql, params);
  },

  async fetchAll(sql, params) {
    return await fallbackDB.fetchAll(sql, params);
  },

  async fetchOne(sql, params) {
    return await fallbackDB.fetchOne(sql, params);
  },

  async getInventory() {
    return await fallbackDB.getInventory();
  },

  async saveOrder(orderData) {
    return await fallbackDB.saveOrder(orderData);
  },

  async getOrders() {
    return await fallbackDB.getOrders();
  }
}; 