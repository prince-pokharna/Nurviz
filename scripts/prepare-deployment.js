#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

console.log('🚀 Preparing for deployment...');

async function prepareDeployment() {
  try {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    console.log('✅ Data directory ensured');

    // Ensure essential data files exist
    const inventoryFile = path.join(dataDir, 'inventory.json');
    const ordersFile = path.join(dataDir, 'orders.json');

    // Check if inventory.json exists, if not create minimal structure
    try {
      await fs.access(inventoryFile);
      console.log('✅ Inventory file exists');
    } catch {
      console.log('📝 Creating default inventory file...');
      const defaultInventory = {
        all: [],
        featured: [],
        collections: [],
        categories: {
          necklaces: [],
          rings: [],
          earrings: [],
          bracelets: [],
          anklets: []
        }
      };
      await fs.writeFile(inventoryFile, JSON.stringify(defaultInventory, null, 2));
      console.log('✅ Default inventory file created');
    }

    // Check if orders.json exists, if not create empty array
    try {
      await fs.access(ordersFile);
      console.log('✅ Orders file exists');
    } catch {
      console.log('📝 Creating default orders file...');
      await fs.writeFile(ordersFile, JSON.stringify([], null, 2));
      console.log('✅ Default orders file created');
    }

    console.log('🎉 Deployment preparation completed successfully!');
    
  } catch (error) {
    console.error('❌ Deployment preparation failed:', error);
    process.exit(1);
  }
}

// Run preparation
prepareDeployment(); 