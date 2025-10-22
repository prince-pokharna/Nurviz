import { NextRequest, NextResponse } from 'next/server';

// Simple product save that works without Firebase rules
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, product } = body;
    
    console.log('💾 Simple product save:', { action, name: product?.name });
    
    // Validate required fields
    if (!product || !product.name || !product.price) {
      return NextResponse.json({ 
        success: false,
        error: 'Product name and price are required' 
      }, { status: 400 });
    }

    // Generate product ID if adding new
    if (action === 'add_product' && (!product.id || product.id.startsWith('new-'))) {
      const timestamp = Date.now();
      const category = product.category?.toLowerCase() || 'product';
      product.id = `${category}-${timestamp}`;
    }

    // For Vercel deployment: Use Firebase client SDK with relaxed rules
    try {
      const { initializeApp, getApps } = await import('firebase/app');
      const { getFirestore, collection, doc, setDoc, updateDoc } = await import('firebase/firestore');
      
      const firebaseConfig = {
        apiKey: "AIzaSyBA6avdbz89WJokX-jQRkp7jg6-kAfetBg",
        authDomain: "nurvi-jewel.firebaseapp.com",
        projectId: "nurvi-jewel",
        storageBucket: "nurvi-jewel.firebasestorage.app",
        messagingSenderId: "1069462383251",
        appId: "1:1069462383251:web:633a8c30a52b673af9fb66",
      };

      const app = getApps().length === 0 ? initializeApp(firebaseConfig, 'admin-app') : getApps()[0];
      const db = getFirestore(app);

      // Prepare product data
      const productData = {
        ...product,
        product_id: product.id,
        product_name: product.name,
        category: product.category || 'General',
        price: Number(product.price) || 0,
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
        created_at: product.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to Firestore
      const productRef = doc(db, 'products', product.id);
      await setDoc(productRef, productData, { merge: true });
      
      console.log('✅ Product saved to Firebase:', product.id);
      
      return NextResponse.json({
        success: true,
        message: `Product ${action === 'add_product' ? 'added' : 'updated'} successfully!`,
        product: productData
      });
      
    } catch (firebaseError: any) {
      console.error('❌ Firebase error:', firebaseError);
      
      // If permission denied, provide helpful message
      if (firebaseError.message?.includes('PERMISSION_DENIED')) {
        return NextResponse.json({
          success: false,
          error: 'Firebase permission denied',
          solution: 'Please update Firebase security rules',
          instructions: {
            step1: 'Go to https://console.firebase.google.com',
            step2: 'Select "nurvi-jewel" project',
            step3: 'Click "Firestore Database" → "Rules"',
            step4: 'Set: allow read, write: if true;',
            step5: 'Click "Publish"'
          }
        }, { status: 403 });
      }
      
      throw firebaseError;
    }
    
  } catch (error) {
    console.error('❌ Save error:', error);
    
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

