import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-config';
import { collection, query, where, getDocs, doc, updateDoc, orderBy, limit } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Fetching featured products...');

    // Get featured products (max 5)
    const productsRef = collection(db, 'products');
    const featuredQuery = query(
      productsRef, 
      where('featured', '==', true),
      orderBy('created_at', 'desc'),
      limit(5)
    );
    
    const featuredSnapshot = await getDocs(featuredQuery);
    const featuredProducts = featuredSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Found ${featuredProducts.length} featured products`);

    return NextResponse.json({
      success: true,
      featured: featuredProducts,
      count: featuredProducts.length
    });

  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch featured products',
      featured: [],
      count: 0
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, featured } = await request.json();

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    console.log(`📝 Updating featured status for product ${productId}: ${featured}`);

    // If setting as featured, check current count
    if (featured === true) {
      const productsRef = collection(db, 'products');
      const featuredQuery = query(productsRef, where('featured', '==', true));
      const featuredSnapshot = await getDocs(featuredQuery);
      
      if (featuredSnapshot.size >= 5) {
        return NextResponse.json({
          success: false,
          error: 'Maximum 5 products can be featured on homepage',
          maxReached: true
        }, { status: 400 });
      }
    }

    // Update product featured status
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      featured: featured === true,
      updated_at: new Date().toISOString()
    });

    console.log(`✅ Product ${productId} featured status updated to ${featured}`);

    return NextResponse.json({
      success: true,
      message: `Product ${featured ? 'added to' : 'removed from'} featured homepage display`
    });

  } catch (error) {
    console.error('❌ Error updating featured status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update featured status'
    }, { status: 500 });
  }
}
