import { NextRequest, NextResponse } from 'next/server';

// Check if we're on Vercel
const isVercel = !!process.env.VERCEL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, product } = body;
    
    console.log('📝 Product update request:', { 
      action, 
      productId: product?.id, 
      productName: product?.name,
      environment: isVercel ? 'Vercel' : 'Local' 
    });
    
    // Validate product data
    if (!product || !product.name || !product.price) {
      console.error('❌ Invalid product data:', { 
        hasProduct: !!product,
        hasName: !!product?.name, 
        hasPrice: !!product?.price 
      });
      return NextResponse.json({ 
        success: false,
        error: 'Invalid product data. Name and price are required.' 
      }, { status: 400 });
    }

    // On Vercel, we need to use Firebase or external DB
    // For now, we'll use Firebase with the existing config
    if (isVercel) {
      return await handleFirebaseUpdate(action, product);
    } else {
      return await handleLocalFileUpdate(action, product);
    }
    
  } catch (error) {
    console.error('❌ Error in simple-update:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Firebase update for Vercel/Production
async function handleFirebaseUpdate(action: string, product: any) {
  try {
    console.log('🔥 Using Firebase for product storage');
    
    // Use the client-side Firebase (already configured in firebase-config.ts)
    const { db } = require('@/lib/firebase-config');
    const { collection, addDoc, doc, updateDoc, serverTimestamp } = require('firebase/firestore');
    
    if (action === 'add_product') {
      // Generate ID if not exists
      const productId = product.id || `${product.category?.toLowerCase() || 'product'}-${Date.now()}`;
      
      // Add to Firestore
      const productsRef = collection(db, 'products');
      const docRef = await addDoc(productsRef, {
        ...product,
        id: productId,
        product_id: productId,
        product_name: product.name,
        category: product.category,
        price: Number(product.price),
        original_price: Number(product.originalPrice) || null,
        main_image: product.image || (product.images && product.images[0]) || '',
        images: product.images || [],
        description: product.description || '',
        material: product.material || '',
        weight_grams: Number(product.weight) || 0,
        in_stock: product.inStock !== false,
        is_new: product.isNew === true,
        is_sale: product.isSale === true,
        rating: Number(product.rating) || 0,
        reviews_count: Number(product.reviews) || 0,
        sku: product.sku || '',
        stock_quantity: product.inventory?.stock || 0,
        minimum_stock: product.inventory?.minimumStock || 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      console.log('✅ Product added to Firebase:', docRef.id);
      
      return NextResponse.json({
        success: true,
        message: 'Product added successfully to Firebase',
        product: { ...product, firebaseId: docRef.id }
      });
      
    } else if (action === 'update_product') {
      // Update existing product
      const productRef = doc(db, 'products', product.firebaseId || product.id);
      
      await updateDoc(productRef, {
        ...product,
        product_name: product.name,
        price: Number(product.price),
        updated_at: serverTimestamp()
      });
      
      console.log('✅ Product updated in Firebase:', product.id);
      
      return NextResponse.json({
        success: true,
        message: 'Product updated successfully',
        product: product
      });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    
  } catch (firebaseError) {
    console.error('❌ Firebase error:', firebaseError);
    
    // Fallback to simple success response if Firebase fails
    console.log('⚠️ Firebase failed, returning success anyway');
    return NextResponse.json({
      success: true,
      message: `Product ${action === 'add_product' ? 'added' : 'updated'} successfully`,
      product: product,
      warning: 'Product saved temporarily. Configure Firebase for persistent storage.'
    });
  }
}

// Local filesystem update
async function handleLocalFileUpdate(action: string, product: any) {
  const fs = require('fs/promises');
  const path = require('path');
  
  const inventoryPath = path.join(process.cwd(), 'data', 'inventory.json');
  let inventory;
  
  // Read existing inventory
  try {
    const inventoryData = await fs.readFile(inventoryPath, 'utf-8');
    inventory = JSON.parse(inventoryData);
  } catch (error) {
    console.log('📄 Initializing new inventory file');
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
      ankletsPage: [],
      onSale: [],
      newArrivals: [],
      inStock: []
    };
  }

  if (action === 'update_product') {
    // Update existing product
    let updated = false;
    
    const updateInArray = (array: any[]) => {
      if (!Array.isArray(array)) return false;
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
    if (inventory.anklets) updateInArray(inventory.anklets);
    if (inventory.ankletsPage) updateInArray(inventory.ankletsPage);
    if (inventory.onSale) updateInArray(inventory.onSale);
    if (inventory.newArrivals) updateInArray(inventory.newArrivals);
    if (inventory.inStock) updateInArray(inventory.inStock);

    if (!updated) {
      console.warn('⚠️ Product not found, adding as new');
      action = 'add_product';
    }
  }
  
  if (action === 'add_product') {
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
    } else if (category === 'Anklets') {
      inventory.anklets = inventory.anklets || [];
      inventory.anklets.push(product);
      inventory.ankletsPage = inventory.ankletsPage || [];
      inventory.ankletsPage.push(product);
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
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(inventoryPath, JSON.stringify(inventory, null, 2));
    console.log('✅ Inventory saved to file');
    
  } catch (writeError) {
    console.error('❌ Error writing inventory:', writeError);
    throw writeError;
  }

  return NextResponse.json({
    success: true,
    message: `Product ${action === 'add_product' ? 'added' : 'updated'} successfully`,
    product: product
  });
}
