import { NextRequest, NextResponse } from 'next/server';

// Import Firebase client SDK (works on Vercel without admin credentials)
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';

// Firebase config (using your existing config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBA6avdbz89WJokX-jQRkp7jg6-kAfetBg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nurvi-jewel.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nurvi-jewel",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nurvi-jewel.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1069462383251",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1069462383251:web:633a8c30a52b673af9fb66",
};

// Initialize Firebase (client SDK - works on serverless)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, product } = body;
    
    console.log('🔥 Firebase product save:', { action, name: product?.name });
    
    // Validate required fields
    if (!product || !product.name || !product.price) {
      return NextResponse.json({ 
        success: false,
        error: 'Product name and price are required' 
      }, { status: 400 });
    }

    // Prepare product data for Firebase
    const productData = {
      ...product,
      product_id: product.id || `${product.category?.toLowerCase() || 'product'}-${Date.now()}`,
      product_name: product.name,
      category: product.category || 'General',
      price: Number(product.price) || 0,
      original_price: Number(product.originalPrice) || 0,
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
      updated_at: new Date().toISOString(),
    };

    if (action === 'add_product') {
      // Add new product with auto-generated ID
      const timestamp = Date.now();
      const productId = product.id || `${product.category?.toLowerCase() || 'product'}-${timestamp}`;
      
      productData.created_at = new Date().toISOString();
      productData.id = productId;
      productData.product_id = productId;
      
      // Use setDoc with custom ID instead of addDoc
      const productRef = doc(db, 'products', productId);
      await setDoc(productRef, productData);
      
      console.log('✅ Product added to Firebase:', productId);
      
      return NextResponse.json({
        success: true,
        message: 'Product added successfully!',
        product: { ...product, id: productId, firebaseId: productId }
      });
      
    } else if (action === 'update_product') {
      // Update existing product
      if (!product.id) {
        return NextResponse.json({ 
          success: false,
          error: 'Product ID required for update' 
        }, { status: 400 });
      }
      
      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, productData);
      
      console.log('✅ Product updated in Firebase:', product.id);
      
      return NextResponse.json({
        success: true,
        message: 'Product updated successfully!',
        product: product
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Firebase error:', error);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save product',
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Check Vercel logs for details'
      },
      { status: 500 }
    );
  }
}

