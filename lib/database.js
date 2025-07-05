// Serverless-compatible database layer for Vercel deployment
// This file replaces SQLite3 with JSON-based storage for serverless compatibility

const fs = require('fs').promises;
const path = require('path');

console.log('🌐 Serverless database layer loaded');

// Data file paths
const INVENTORY_FILE = path.join(process.cwd(), 'data', 'inventory.json');
const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Helper functions for JSON file operations
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

// Database functions (serverless-compatible)
const initializeDatabase = async () => {
  console.log('✅ Serverless database initialized (JSON files)');
  return true;
};

const closeDatabase = async () => {
  console.log('✅ Serverless database closed');
  return true;
};

const executeQuery = async (sql, params = []) => {
  console.log('📝 Simulated query execution (serverless)');
  return { id: Date.now(), changes: 1 };
};

const fetchAll = async (sql, params = []) => {
  // Handle different table queries
  if (sql.includes('products') || sql.includes('inventory')) {
    const inventory = await readJSONFile(INVENTORY_FILE, []);
    return Array.isArray(inventory) ? inventory : inventory.all || [];
  }
  
  if (sql.includes('orders')) {
    return await readJSONFile(ORDERS_FILE, []);
  }
  
  return [];
};

const fetchOne = async (sql, params = []) => {
  const results = await fetchAll(sql, params);
  if (params[0]) {
    return results.find(item => 
      item.id === params[0] || 
      item.product_id === params[0] || 
      item.order_id === params[0]
    ) || null;
  }
  return results[0] || null;
};

// Inventory-specific functions
const getInventory = async () => {
  try {
    const data = await readJSONFile(INVENTORY_FILE, { all: [], featured: [], collections: [] });
    
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
};

// Order management functions
const saveOrder = async (orderData) => {
  try {
    const orders = await readJSONFile(ORDERS_FILE, []);
    const newOrder = {
      id: Date.now().toString(),
      order_id: `ORD-${Date.now()}`,
      ...orderData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    orders.push(newOrder);
    await writeJSONFile(ORDERS_FILE, orders);
    console.log('✅ Order saved successfully:', newOrder.order_id);
    return newOrder;
  } catch (error) {
    console.error('❌ Error saving order:', error);
    throw error;
  }
};

const getOrders = async () => {
  return await readJSONFile(ORDERS_FILE, []);
};

// Export all database functions
module.exports = {
  initializeDatabase,
  closeDatabase,
  executeQuery,
  fetchAll,
  fetchOne,
  getInventory,
  saveOrder,
  getOrders
}; 