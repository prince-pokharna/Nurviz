#!/usr/bin/env node

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('🔄 Starting inventory synchronization...');

// File paths
const EXCEL_FILE = path.join(__dirname, '..', 'Stock-Management-Inventory.xlsx');
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(OUTPUT_DIR, 'products.json');

// Ensure data directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

try {
  // Check if Excel file exists
  if (!fs.existsSync(EXCEL_FILE)) {
    console.log('❌ Excel file not found:', EXCEL_FILE);
    console.log('📝 Creating sample data instead...');
    createSampleData();
    return;
  }

  console.log('📊 Reading Excel file:', EXCEL_FILE);
  
  // Read the Excel file
  const workbook = XLSX.readFile(EXCEL_FILE);
  console.log('📊 Available sheets:', workbook.SheetNames);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Get the range of the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  console.log(`📊 Worksheet range: ${range.s.r} to ${range.e.r} rows, ${range.s.c} to ${range.e.c} columns`);
  
  // Convert to JSON with headers starting from first row
  const rawData = XLSX.utils.sheet_to_json(worksheet, { 
    header: 1,  // Use first row as headers
    defval: "",  // Default value for empty cells
    blankrows: false  // Skip blank rows
  });
  
  // Convert array format to object format
  if (rawData.length > 0) {
    const headers = rawData[0];
    console.log('📋 Headers found:', headers);
    
    const dataRows = rawData.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
    
    // Replace rawData with properly formatted data
    rawData.length = 0;
    rawData.push(...dataRows);
  }
  
  console.log(`✅ Found ${rawData.length} rows in Excel file`);
  
  // Debug: Show the column headers from first row
  if (rawData.length > 0) {
    console.log('📋 Available columns:', Object.keys(rawData[0]));
    const priceColumns = Object.keys(rawData[0]).filter(col => col.includes('Price'));
    console.log('💰 Price columns found:', priceColumns);
  }
  
  // Filter out comment/header rows and only keep actual product data
  const productData = rawData.filter(row => {
    const productId = String(row['Product ID'] || '').trim();
    
    // Skip empty rows, comment rows, or header rows
    if (!productId || 
        productId.startsWith('#') || 
        productId.includes('SECTION') ||
        productId.includes('FEATURED PRODUCTS') ||
        productId.includes('COLLECTIONS PAGE') ||
        productId.includes('INVENTORY SUMMARY') ||
        productId.includes('Note:') ||
        productId === 'Product ID') {
      return false;
    }
    
    // Only include rows that have both Product ID and Product Name
    return row['Product Name'] && String(row['Product Name']).trim().length > 0;
  });
  
  console.log(`✅ Found ${productData.length} valid product rows after filtering`);
  
  // Process and categorize products
  const processedProducts = processInventoryData(productData);
  console.log(`✅ Processed ${processedProducts.length} valid products`);
  
  // Categorize products
  const categorizedData = {
    all: processedProducts,
    featured: processedProducts.filter(p => 
      p.category === 'Featured Products' || 
      p.section === 'Featured Products' || 
      (p.notes && p.notes.includes('FEATURED'))
    ),
    rings: processedProducts.filter(p => 
      p.category.toLowerCase().includes('ring') ||
      p.section === 'Rings Page'
    ),
    necklaces: processedProducts.filter(p => 
      p.category.toLowerCase().includes('necklace') ||
      p.section === 'Necklaces Page'
    ),
    earrings: processedProducts.filter(p => 
      p.category.toLowerCase().includes('earring') ||
      p.section === 'Earrings Page'
    ),
    bracelets: processedProducts.filter(p => 
      p.category.toLowerCase().includes('bracelet') ||
      p.section === 'Bracelets Page'
    ),
    anklets: processedProducts.filter(p => 
      p.category.toLowerCase().includes('anklet') ||
      p.section === 'Anklets Page'
    ),
    collections: processedProducts.filter(p => p.section === 'Collections Page'),
    
    // Page-specific collections
    ringsPage: processedProducts.filter(p => p.section === 'Rings Page'),
    necklacesPage: processedProducts.filter(p => p.section === 'Necklaces Page'),
    earringsPage: processedProducts.filter(p => p.section === 'Earrings Page'),
    braceletsPage: processedProducts.filter(p => p.section === 'Bracelets Page'),
    ankletsPage: processedProducts.filter(p => p.section === 'Anklets Page'),
    
    // Special filters
    onSale: processedProducts.filter(p => p.isSale),
    newArrivals: processedProducts.filter(p => p.isNew),
    inStock: processedProducts.filter(p => p.inStock),
    contentCreatorReady: processedProducts.filter(p => p.contentCreator.contentCreatorFriendly)
  };
  
  const outputPath = path.join(__dirname, '..', 'data', 'inventory.json');
  fs.writeFileSync(outputPath, JSON.stringify(categorizedData, null, 2));
  
  console.log(`✅ Inventory synchronized successfully!`);
  console.log(`📁 Output saved to: ${outputPath}`);
  console.log(`📊 Categories summary:`);
  console.log(`   - Total products: ${categorizedData.all.length}`);
  console.log(`   - Featured: ${categorizedData.featured.length}`);
  console.log(`   - Collections Page: ${categorizedData.collections.length}`);
  console.log(`   - Rings: ${categorizedData.rings.length} (Page: ${categorizedData.ringsPage.length})`);
  console.log(`   - Necklaces: ${categorizedData.necklaces.length} (Page: ${categorizedData.necklacesPage.length})`);
  console.log(`   - Earrings: ${categorizedData.earrings.length} (Page: ${categorizedData.earringsPage.length})`);
  console.log(`   - Bracelets: ${categorizedData.bracelets.length} (Page: ${categorizedData.braceletsPage.length})`);
  console.log(`   - Anklets: ${categorizedData.anklets.length} (Page: ${categorizedData.ankletsPage.length})`);
  console.log(`🏷️ Special filters:`);
  console.log(`   - On Sale: ${categorizedData.onSale.length}`);
  console.log(`   - New Arrivals: ${categorizedData.newArrivals.length}`);
  console.log(`   - In Stock: ${categorizedData.inStock.length}`);
  console.log(`   - Content Creator Ready: ${categorizedData.contentCreatorReady.length}`);
  
} catch (error) {
  console.error('❌ Error synchronizing inventory:', error);
  console.log('📝 Creating fallback data...');
  createSampleData();
}

function processInventoryData(data) {
  return data.map(row => {
    // Helper function to safely convert to string
    const toString = (value) => {
      if (value === null || value === undefined) return "";
      return String(value);
    };

    // Helper function to safely convert to number
    const toNumber = (value) => {
      if (value === null || value === undefined || value === "") return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    // Helper function to safely split strings
    const toArray = (value, separator = ',') => {
      const str = toString(value).trim();
      return str ? str.split(separator).map(s => s.trim()).filter(Boolean) : [];
    };

    // Helper function to safely split with | separator
    const toArrayPipe = (value) => {
      const str = toString(value).trim();
      return str ? str.split('|').map(s => s.trim()).filter(Boolean) : [];
    };

    return {
      id: toString(row['Product ID'] || ''),
      name: toString(row['Product Name'] || ''),
      category: toString(row['Category'] || ''),
      section: toString(row['Website Section'] || ''),
      price: toNumber(row['Price (â\x82¹)'] || row['Price (₹)'] || row['Price (â¹)'] || 0),
      originalPrice: toNumber(row['Original Price (â\x82¹)'] || row['Original Price (₹)'] || row['Original Price (â¹)'] || 0),
      discount: toNumber(row['Discount %'] || 0),
      image: toString(row['Main Image URL'] || '/placeholder.jpg'),
      images: [
        toString(row['Main Image URL'] || ''),
        toString(row['Image 2 URL'] || ''),
        toString(row['Image 3 URL'] || ''),
        toString(row['Image 4 URL'] || '')
      ].filter(img => img && img !== '/placeholder.jpg'),
      description: toString(row['Description'] || ''),
      material: toString(row['Material'] || ''),
      gemstone: toString(row['Stone/Gemstone'] || ''),
      weight: toNumber(row['Weight (grams)'] || 0),
      size: toString(row['Length/Size'] || ''),
      colors: toArrayPipe(row['Colors Available'] || ''),
      sizes: toArrayPipe(row['Sizes Available'] || ''),
      style: toString(row['Style'] || ''),
      occasion: toString(row['Occasion'] || ''),
      features: toArrayPipe(row['Features'] || ''),
      rating: toNumber(row['Rating'] || 4.5),
      reviews: toNumber(row['Reviews Count'] || 0),
      inStock: toString(row['In Stock'] || 'Yes').toLowerCase() === 'yes',
      isNew: toString(row['Is New'] || 'No').toLowerCase() === 'yes',
      isSale: toString(row['Is Sale'] || 'No').toLowerCase() === 'yes',
      careInstructions: toString(row['Care Instructions'] || ''),
      sku: toString(row['SKU'] || ''),
      brand: toString(row['Brand'] || 'Nurvi Jewel'),
      collection: toString(row['Collection'] || ''),
      tags: toArrayPipe(row['Tags'] || ''),
      seoTitle: toString(row['SEO Title'] || ''),
      seoDescription: toString(row['SEO Description'] || ''),
      dateAdded: toString(row['Date Added'] || new Date().toISOString().split('T')[0]),
      lastUpdated: toString(row['Last Updated'] || new Date().toISOString().split('T')[0]),
      inventory: {
        stock: toNumber(row['Stock Quantity'] || 0),
        minimumStock: toNumber(row['Minimum Stock'] || 5),
        supplier: toString(row['Supplier'] || ''),
        supplierContact: toString(row['Supplier Contact'] || ''),
        costPrice: toNumber(row['Cost Price'] || 0),
        profitMargin: toString(row['Profit Margin'] || '30%')
      },
      contentCreator: {
        uniquenessFactor: toString(row['Uniqueness Factor'] || ''),
        contentCreatorFriendly: toString(row['Content Creator Friendly'] || 'No').toLowerCase() === 'yes',
        antiTarnish: toString(row['Anti-Tarnish'] || 'No').toLowerCase() === 'yes',
        photoshootReady: toString(row['Photoshoot Ready'] || 'No').toLowerCase() === 'yes',
        videoContentReady: toString(row['Video Content Ready'] || 'No').toLowerCase() === 'yes'
      },
      social: {
        targetAudience: toArrayPipe(row['Target Audience'] || ''),
        socialMediaTags: toString(row['Social Media Tags'] || ''),
        instagramHashtags: toString(row['Instagram Hashtags'] || ''),
        influencerCategory: toString(row['Influencer Category'] || '')
      },
      status: toString(row['Status'] || 'Active'),
      notes: toString(row['Notes'] || ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }).filter(product => product.id && product.name); // Only include products with valid id and name
}

function createSampleData() {
  const sampleProducts = [
    {
      id: 'sample-1',
      name: 'Sample Royal Necklace',
      category: 'Necklaces',
      section: 'Featured Products',
      price: 15999,
      originalPrice: 19999,
      discount: 20,
      images: ['/placeholder.jpg'],
      description: 'Beautiful sample necklace for testing',
      material: 'Gold Plated',
      stone: 'Kundan',
      weight: 50,
      size: '18 inches',
      colors: ['Gold', 'Silver'],
      sizes: ['Medium', 'Large'],
      style: 'Traditional',
      occasion: 'Wedding',
      features: ['Anti-tarnish', 'Handcrafted'],
      rating: 4.8,
      reviews: 150,
      inStock: true,
      isNew: true,
      isSale: true,
      careInstructions: 'Keep dry and clean with soft cloth',
      sku: 'SAMPLE001',
      brand: 'Nurvi Jewel',
      collection: 'Royal Collection',
      tags: ['traditional', 'wedding', 'necklace'],
      seoTitle: 'Sample Royal Necklace | Nurvi Jewel',
      seoDescription: 'Beautiful traditional necklace perfect for weddings',
      dateAdded: '2024-01-01',
      lastUpdated: new Date().toISOString().split('T')[0],
      stockQuantity: 25,
      minimumStock: 5,
      supplier: 'Sample Supplier',
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
      notes: 'Sample product for testing - FEATURED HOMEPAGE'
    }
  ];

  const sampleData = {
    all: sampleProducts,
    featured: sampleProducts.filter(p => p.notes.includes('FEATURED')),
    rings: sampleProducts.filter(p => p.category === 'Rings'),
    necklaces: sampleProducts.filter(p => p.category === 'Necklaces'),
    earrings: sampleProducts.filter(p => p.category === 'Earrings'),
    bracelets: sampleProducts.filter(p => p.category === 'Bracelets'),
    anklets: sampleProducts.filter(p => p.category === 'Anklets')
  };

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(sampleData, null, 2));
  console.log('✅ Sample data created successfully!');
} 