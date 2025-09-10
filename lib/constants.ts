// Product type definition
export interface Product {
  id: string;
  name: string;
  category: string;
  section?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  description: string;
  material?: string;
  gemstone?: string;
  weight?: number;
  size?: string;
  colors?: string[];
  sizes?: string[];
  style?: string;
  occasion?: string;
  features?: string[];
  rating?: number;
  reviews?: number;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  careInstructions?: string;
  sku?: string;
  brand?: string;
  collection?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  dateAdded?: string;
  lastUpdated?: string;
  inventory?: {
    stock: number;
    minimumStock: number;
    supplier: string;
    supplierContact: string;
    costPrice: number;
    profitMargin: string;
  };
  contentCreator?: {
    uniquenessFactor: string;
    contentCreatorFriendly: boolean;
    antiTarnish: boolean;
    photoshootReady: boolean;
    videoContentReady: boolean;
  };
  social?: {
    targetAudience: string[];
    socialMediaTags: string;
    instagramHashtags: string;
    influencerCategory: string;
  };
  status?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface InventoryData {
  all: Product[];
  featured: Product[];
  rings: Product[];
  necklaces: Product[];
  earrings: Product[];
  bracelets: Product[];
  anklets: Product[];
  collections: Product[];
  ringsPage?: Product[];
  necklacesPage?: Product[];
  earringsPage?: Product[];
  braceletsPage?: Product[];
  ankletsPage?: Product[];
  onSale?: Product[];
  newArrivals?: Product[];
  inStock?: Product[];
  contentCreatorReady?: Product[];
}

// Load inventory data from JSON file (server-side only)
let inventoryData: InventoryData | null = null;

const getInventoryData = (): InventoryData => {
  // Return cached data if available
  if (inventoryData) {
    return inventoryData;
  }

  // Only load from filesystem on server-side
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const inventoryPath = path.join(process.cwd(), 'data', 'inventory.json');
      if (fs.existsSync(inventoryPath)) {
        const data = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
        inventoryData = data;
        return data;
      }
    } catch (error) {
      console.warn('Could not load inventory data, using fallback');
    }
  }
  
  // Fallback empty data structure - client will load async
  const fallbackData = {
    all: [],
    featured: [],
    rings: [],
    necklaces: [],
    earrings: [],
    bracelets: [],
    anklets: [],
    collections: []
  };
  
  inventoryData = fallbackData;
  return fallbackData;
};

// Client-side function to load inventory from API (for future implementation)
export const loadInventoryClient = async (): Promise<InventoryData> => {
  if (typeof window !== 'undefined' && inventoryData && inventoryData.all.length === 0) {
    try {
      // Try to fetch from API endpoint (you can implement this later)
      // const response = await fetch('/api/inventory');
      // const data = await response.json();
      // inventoryData = data;
      // return data;
    } catch (error) {
      console.warn('Could not load inventory from API');
    }
  }
  return inventoryData || getInventoryData();
};

export const INVENTORY_DATA = getInventoryData();

// Export individual categories for easy access
export const PRODUCTS = INVENTORY_DATA.all || [];
export const FEATURED_PRODUCTS = INVENTORY_DATA.featured || [];
export const RINGS = INVENTORY_DATA.rings || [];
export const NECKLACES = INVENTORY_DATA.necklaces || [];
export const EARRINGS = INVENTORY_DATA.earrings || [];
export const BRACELETS = INVENTORY_DATA.bracelets || [];
export const ANKLETS = INVENTORY_DATA.anklets || [];
export const COLLECTIONS = INVENTORY_DATA.collections || [];

// Additional product filters
export const ON_SALE_PRODUCTS = INVENTORY_DATA.onSale || [];
export const NEW_ARRIVALS = INVENTORY_DATA.newArrivals || [];
export const IN_STOCK_PRODUCTS = INVENTORY_DATA.inStock || [];
export const CONTENT_CREATOR_READY = INVENTORY_DATA.contentCreatorReady || [];

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(product => product.id === id);
};

// Helper function to safely convert values to strings
const safeString = (value: any): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

// Helper function to sanitize product data
const sanitizeProduct = (product: any): Product => {
  return {
    ...product,
    material: safeString(product.material),
    style: safeString(product.style),
    occasion: safeString(product.occasion),
    rating: product.rating || 0,
    specifications: product.specifications ? {
      ...product.specifications,
      Material: safeString(product.specifications.Material),
      Style: safeString(product.specifications.Style),
      Occasion: safeString(product.specifications.Occasion),
      Stone: safeString(product.specifications.Stone)
    } : undefined
  };
};

export const getProductsByCategory = (category: string): Product[] => {
  return PRODUCTS
    .filter(product => 
      safeString(product.category).toLowerCase().includes(category.toLowerCase())
    )
    .map(sanitizeProduct);
};

export const getProductsBySection = (section: string): Product[] => {
  return PRODUCTS.filter(product => 
    product.section === section
  );
};

export const getFeaturedProducts = (limit?: number): Product[] => {
  const featured = FEATURED_PRODUCTS.length > 0 ? FEATURED_PRODUCTS : PRODUCTS.slice(0, 6);
  return limit ? featured.slice(0, limit) : featured;
};

export const getProductsByPriceRange = (min: number, max: number): Product[] => {
  return PRODUCTS.filter(product => 
    product.price >= min && product.price <= max
  );
};

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Product categories for navigation
export const PRODUCT_CATEGORIES = [
  {
    name: 'Rings',
    href: '/rings',
    count: RINGS.length,
    description: 'Elegant rings for every occasion'
  },
  {
    name: 'Necklaces', 
    href: '/necklaces',
    count: NECKLACES.length,
    description: 'Beautiful necklaces to complement your style'
  },
  {
    name: 'Earrings',
    href: '/earrings', 
    count: EARRINGS.length,
    description: 'Stunning earrings for any look'
  },
  {
    name: 'Bracelets',
    href: '/bracelets',
    count: BRACELETS.length,
    description: 'Stylish bracelets and bangles'
  },
  {
    name: 'Anklets',
    href: '/anklets',
    count: ANKLETS.length,
    description: 'Delicate anklets for a graceful touch'
  }
];

// Website configuration
export const SITE_CONFIG = {
  name: 'Nurvi Jewel',
  description: 'Exquisite jewelry collection for the modern woman',
  url: 'https://nurvijewel.com',
  tagline: 'Where Elegance Meets Excellence'
};

// Material options for filtering
export const PRODUCT_MATERIALS = [
  'Gold Plated',
  'Silver Plated', 
  'Sterling Silver',
  'Brass',
  'Stainless Steel',
  'Platinum Plated',
  'Rose Gold Plated',
  'Copper',
  'Alloy'
];

// Size options
export const PRODUCT_SIZES = [
  'XS', 'S', 'M', 'L', 'XL',
  'One Size',
  'Adjustable',
  '6', '7', '8', '9', '10'
];

// Color options
export const PRODUCT_COLORS = [
  'Gold',
  'Silver', 
  'Rose Gold',
  'Antique Gold',
  'Copper',
  'Black',
  'White',
  'Multi-color'
];

// Export ALL_PRODUCTS for backward compatibility
export const ALL_PRODUCTS = PRODUCTS; 