import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, product } = body;
    
    console.log('Simple update request:', { action, productId: product?.id, productName: product?.name });
    
    // Validate product data
    if (!product || !product.name || !product.price) {
      console.error('Invalid product data:', product);
      return NextResponse.json({ 
        success: false,
        error: 'Invalid product data. Name and price are required.' 
      }, { status: 400 });
    }
    
    // Read current inventory
    const inventoryPath = path.join(process.cwd(), 'data', 'inventory.json');
    let inventory;
    
    try {
      const inventoryData = await fs.readFile(inventoryPath, 'utf-8');
      inventory = JSON.parse(inventoryData);
    } catch (error) {
      console.error('Error reading inventory:', error);
      // Initialize empty inventory if file doesn't exist
      inventory = {
        all: [],
        featured: [],
        rings: [],
        ringsPage: [],
        necklaces: [],
        necklacesPage: [],
        earrings: [],
        earringsPage: [],
        bracelets: [],
        braceletsPage: [],
        anklets: [],
        onSale: [],
        newArrivals: [],
        inStock: []
      };
    }

    if (action === 'update_product') {
      // Update existing product
      let updated = false;
      
      // Update in all arrays
      const updateInArray = (array: any[]) => {
        const index = array.findIndex((p: any) => p.id === product.id);
        if (index !== -1) {
          array[index] = { ...array[index], ...product };
          return true;
        }
        return false;
      };

      if (inventory.all) updated = updateInArray(inventory.all) || updated;
      if (inventory.featured) updateInArray(inventory.featured);
      if (inventory.rings) updateInArray(inventory.rings);
      if (inventory.ringsPage) updateInArray(inventory.ringsPage);
      if (inventory.necklaces) updateInArray(inventory.necklaces);
      if (inventory.necklacesPage) updateInArray(inventory.necklacesPage);
      if (inventory.earrings) updateInArray(inventory.earrings);
      if (inventory.earringsPage) updateInArray(inventory.earringsPage);
      if (inventory.bracelets) updateInArray(inventory.bracelets);
      if (inventory.braceletsPage) updateInArray(inventory.braceletsPage);
      if (inventory.onSale) updateInArray(inventory.onSale);
      if (inventory.newArrivals) updateInArray(inventory.newArrivals);
      if (inventory.inStock) updateInArray(inventory.inStock);

      if (!updated) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
    } else if (action === 'add_product') {
      // Add new product
      inventory.all = inventory.all || [];
      inventory.all.push(product);

      // Add to category arrays
      const category = product.category;
      if (category === 'Rings') {
        inventory.rings = inventory.rings || [];
        inventory.rings.push(product);
        inventory.ringsPage = inventory.ringsPage || [];
        inventory.ringsPage.push(product);
      } else if (category === 'Necklaces') {
        inventory.necklaces = inventory.necklaces || [];
        inventory.necklaces.push(product);
        inventory.necklacesPage = inventory.necklacesPage || [];
        inventory.necklacesPage.push(product);
      } else if (category === 'Earrings') {
        inventory.earrings = inventory.earrings || [];
        inventory.earrings.push(product);
        inventory.earringsPage = inventory.earringsPage || [];
        inventory.earringsPage.push(product);
      } else if (category === 'Bracelets') {
        inventory.bracelets = inventory.bracelets || [];
        inventory.bracelets.push(product);
        inventory.braceletsPage = inventory.braceletsPage || [];
        inventory.braceletsPage.push(product);
      }

      // Add to special arrays
      if (product.isNew) {
        inventory.newArrivals = inventory.newArrivals || [];
        inventory.newArrivals.push(product);
      }
      if (product.isSale) {
        inventory.onSale = inventory.onSale || [];
        inventory.onSale.push(product);
      }
      if (product.inStock) {
        inventory.inStock = inventory.inStock || [];
        inventory.inStock.push(product);
      }
    }

    // Save updated inventory
    try {
      // Ensure data directory exists
      const dataDir = path.join(process.cwd(), 'data');
      try {
        await fs.mkdir(dataDir, { recursive: true });
      } catch (mkdirError) {
        // Directory might already exist
      }
      
      await fs.writeFile(inventoryPath, JSON.stringify(inventory, null, 2));
      console.log('✅ Inventory updated successfully');
    } catch (writeError) {
      console.error('❌ Error writing inventory:', writeError);
      
      // If running on Vercel, filesystem writes won't work
      if (process.env.VERCEL) {
        return NextResponse.json({
          success: false,
          error: 'Filesystem storage not available on Vercel. Please use a database or external storage.',
          suggestion: 'Consider using Firebase, Supabase, or another cloud database for production.'
        }, { status: 500 });
      }
      
      throw writeError;
    }

    return NextResponse.json({
      success: true,
      message: `Product ${action === 'add_product' ? 'added' : 'updated'} successfully`,
      product: product
    });
  } catch (error) {
    console.error('❌ Error updating inventory:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update inventory',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
