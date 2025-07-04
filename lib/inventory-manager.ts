// Inventory Management System
// Reads from Excel-generated JSON data

import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  name: string;
  category: string;
  section: string;
  price: number;
  originalPrice?: number;
  discount: number;
  images: string[];
  description: string;
  material: string;
  stone: string;
  weight: number;
  size: string;
  colors: string[];
  sizes: string[];
  style: string;
  occasion: string;
  features: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  careInstructions: string;
  sku: string;
  brand: string;
  collection: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  dateAdded: string;
  lastUpdated: string;
  stockQuantity: number;
  minimumStock: number;
  supplier: string;
  supplierContact: string;
  costPrice: number;
  profitMargin: string;
  uniquenessFactor: string;
  contentCreatorFriendly: boolean;
  antiTarnish: boolean;
  photoshootReady: boolean;
  targetAudience: string[];
  socialMediaTags: string;
  instagramHashtags: string;
  influencerCategory: string;
  videoContentReady: boolean;
  status: string;
  notes: string;
}

export interface InventoryData {
  all: Product[];
  featured: Product[];
  rings: Product[];
  necklaces: Product[];
  earrings: Product[];
  bracelets: Product[];
  anklets: Product[];
}

// Get products data from JSON file (generated from Excel)
export function getInventoryData(): InventoryData {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'products.json');
    
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data) as InventoryData;
    } else {
      console.warn('Products data file not found, using fallback data');
      return getFallbackData();
    }
  } catch (error) {
    console.error('Error reading inventory data:', error);
    return getFallbackData();
  }
}

// Get all products
export function getAllProducts(): Product[] {
  const inventory = getInventoryData();
  return inventory.all.filter(product => product.status === 'Active');
}

// Get featured products
export function getFeaturedProducts(): Product[] {
  const inventory = getInventoryData();
  return inventory.featured.filter(product => product.status === 'Active');
}

// Get products by category
export function getProductsByCategory(category: string): Product[] {
  const inventory = getInventoryData();
  const categoryKey = category.toLowerCase() as keyof InventoryData;
  
  if (categoryKey in inventory && Array.isArray(inventory[categoryKey])) {
    return (inventory[categoryKey] as Product[]).filter(product => product.status === 'Active');
  }
  
  return inventory.all.filter(product => 
    product.category.toLowerCase().includes(category.toLowerCase()) && 
    product.status === 'Active'
  );
}

// Get product by ID
export function getProductById(id: string): Product | null {
  const inventory = getInventoryData();
  return inventory.all.find(product => product.id === id && product.status === 'Active') || null;
}

// Search products
export function searchProducts(query: string): Product[] {
  const inventory = getInventoryData();
  const searchTerm = query.toLowerCase();
  
  return inventory.all.filter(product => 
    product.status === 'Active' && (
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      product.collection.toLowerCase().includes(searchTerm)
    )
  );
}

// Filter products
export interface ProductFilters {
  category?: string;
  priceRange?: [number, number];
  colors?: string[];
  materials?: string[];
  occasions?: string[];
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

export function filterProducts(filters: ProductFilters): Product[] {
  let products = getAllProducts();
  
  if (filters.category) {
    products = products.filter(p => p.category.toLowerCase().includes(filters.category!.toLowerCase()));
  }
  
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    products = products.filter(p => p.price >= min && p.price <= max);
  }
  
  if (filters.colors && filters.colors.length > 0) {
    products = products.filter(p => 
      filters.colors!.some(color => 
        p.colors.some(productColor => 
          productColor.toLowerCase().includes(color.toLowerCase())
        )
      )
    );
  }
  
  if (filters.materials && filters.materials.length > 0) {
    products = products.filter(p => 
      filters.materials!.some(material => 
        p.material.toLowerCase().includes(material.toLowerCase())
      )
    );
  }
  
  if (filters.occasions && filters.occasions.length > 0) {
    products = products.filter(p => 
      filters.occasions!.some(occasion => 
        p.occasion.toLowerCase().includes(occasion.toLowerCase())
      )
    );
  }
  
  if (filters.inStock !== undefined) {
    products = products.filter(p => p.inStock === filters.inStock);
  }
  
  if (filters.isNew !== undefined) {
    products = products.filter(p => p.isNew === filters.isNew);
  }
  
  if (filters.isSale !== undefined) {
    products = products.filter(p => p.isSale === filters.isSale);
  }
  
  return products;
}

// Get unique values for filters
export function getFilterOptions() {
  const inventory = getInventoryData();
  const products = inventory.all.filter(p => p.status === 'Active');
  
  const categories = [...new Set(products.map(p => p.category))];
  const colors = [...new Set(products.flatMap(p => p.colors))];
  const materials = [...new Set(products.map(p => p.material))];
  const occasions = [...new Set(products.map(p => p.occasion))];
  const collections = [...new Set(products.map(p => p.collection))];
  const priceRange = products.reduce((range, p) => [
    Math.min(range[0], p.price),
    Math.max(range[1], p.price)
  ], [Infinity, 0]);
  
  return {
    categories,
    colors,
    materials,
    occasions,
    collections,
    priceRange
  };
}

// Fallback data in case Excel file is not available
function getFallbackData(): InventoryData {
  const fallbackProducts: Product[] = [
    {
      id: 'fallback-1',
      name: 'Elegant Gold Necklace',
      category: 'Necklaces',
      section: 'Featured Products',
      price: 15999,
      originalPrice: 19999,
      discount: 20,
      images: ['/placeholder.jpg'],
      description: 'Beautiful gold necklace perfect for special occasions',
      material: 'Gold Plated',
      stone: 'Kundan',
      weight: 45,
      size: '18 inches',
      colors: ['Gold', 'Rose Gold'],
      sizes: ['Medium', 'Large'],
      style: 'Traditional',
      occasion: 'Wedding',
      features: ['Anti-tarnish coating', 'Handcrafted design'],
      rating: 4.8,
      reviews: 125,
      inStock: true,
      isNew: true,
      isSale: true,
      careInstructions: 'Keep dry and clean with soft cloth',
      sku: 'FALLBACK001',
      brand: 'Nurvi Jewel',
      collection: 'Royal Collection',
      tags: ['traditional', 'wedding', 'necklace'],
      seoTitle: 'Elegant Gold Necklace | Nurvi Jewel',
      seoDescription: 'Beautiful traditional necklace perfect for weddings',
      dateAdded: '2024-01-01',
      lastUpdated: new Date().toISOString().split('T')[0],
      stockQuantity: 25,
      minimumStock: 5,
      supplier: 'Fallback Supplier',
      supplierContact: '+91-9876543210',
      costPrice: 11999,
      profitMargin: '25%',
      uniquenessFactor: 'Handcrafted traditional design',
      contentCreatorFriendly: true,
      antiTarnish: true,
      photoshootReady: true,
      targetAudience: ['Brides', 'Traditional wear lovers'],
      socialMediaTags: '#necklace #traditional',
      instagramHashtags: '#traditionaljewelry #bride',
      influencerCategory: 'Wedding Influencers',
      videoContentReady: true,
      status: 'Active',
      notes: 'Fallback product for when Excel data is not available'
    }
  ];
  
  return {
    all: fallbackProducts,
    featured: fallbackProducts,
    rings: [],
    necklaces: fallbackProducts.filter(p => p.category === 'Necklaces'),
    earrings: [],
    bracelets: [],
    anklets: []
  };
}

// Sync inventory with latest Excel data (for manual sync)
export async function syncInventory(): Promise<void> {
  try {
    // This would typically call the sync script
    console.log('Syncing inventory with Excel data...');
    // In a real implementation, you might call the sync script here
    // or implement the Excel reading logic directly
  } catch (error) {
    console.error('Error syncing inventory:', error);
    throw error;
  }
} 