#!/usr/bin/env node

const XLSX = require('xlsx');
const fs = require('fs').promises;
const path = require('path');

console.log('🔧 Setting up image structure and generating paths...');

// Configuration
const EXCEL_FILE = path.join(__dirname, '..', 'Stock-Management-Inventory.xlsx');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Categories for organizing images
const CATEGORIES = ['necklaces', 'rings', 'earrings', 'bracelets', 'anklets'];

async function setupImageStructure() {
  try {
    console.log('📊 Reading Excel file for product data...');
    
    // Check if Excel file exists
    const excelExists = await checkFileExists(EXCEL_FILE);
    if (!excelExists) {
      throw new Error(`Excel file not found: ${EXCEL_FILE}`);
    }

    // Create directory structure
    await createDirectoryStructure();

    // Read Excel file
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Get headers and data
    const rawData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: "",
      blankrows: false
    });
    
    const headers = rawData[0];
    const dataRows = rawData.slice(1);
    
    console.log(`✅ Found ${dataRows.length} product rows`);
    console.log('📋 Headers:', headers);

    // Generate image paths for each product
    const productsWithPaths = generateImagePaths(dataRows, headers);
    
    // Create updated Excel with image paths
    await createUpdatedExcel(productsWithPaths, headers);
    
    // Create example file structure
    await createExampleImages();
    
    console.log('🎉 Image structure setup completed successfully!');
    console.log(`📦 Generated paths for ${productsWithPaths.length} products`);
    console.log('📝 Next steps:');
    console.log('   1. Add your jewelry images to the category folders');
    console.log('   2. Update the Excel file with actual image paths');
    console.log('   3. Run npm run sync-inventory to update website');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function createDirectoryStructure() {
  console.log('📁 Creating directory structure...');
  
  const dirs = [
    IMAGES_DIR,
    ...CATEGORIES.map(cat => path.join(IMAGES_DIR, cat))
  ];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
      console.log(`✅ Directory exists: ${path.basename(dir)}`);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Created directory: ${path.basename(dir)}`);
    }
  }
}

function generateImagePaths(dataRows, headers) {
  console.log('🔗 Generating image paths...');
  
  const products = [];
  
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const productId = row[0] || `P${i + 1}`;
    const productName = row[1] || `Product ${i + 1}`;
    const category = (row[2] || 'general').toLowerCase();
    
    // Clean product name for filename
    const cleanName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Map category to folder
    const categoryFolder = CATEGORIES.includes(category) ? category : 'general';
    
    // Generate image paths
    const imagePaths = {
      productId,
      productName,
      category: categoryFolder,
      main_image: `/images/products/${categoryFolder}/${cleanName}-1.jpg`,
      image_2: `/images/products/${categoryFolder}/${cleanName}-2.jpg`,
      image_3: `/images/products/${categoryFolder}/${cleanName}-3.jpg`,
      image_4: `/images/products/${categoryFolder}/${cleanName}-4.jpg`,
      originalRow: row
    };
    
    products.push(imagePaths);
    console.log(`📝 ${productId}: ${imagePaths.main_image}`);
  }
  
  return products;
}

async function createUpdatedExcel(products, headers) {
  console.log('📝 Creating updated Excel file...');
  
  // Add image URL columns if they don't exist
  const imageUrlColumns = ['Main Image URL', 'Image 2 URL', 'Image 3 URL', 'Image 4 URL'];
  const newHeaders = [...headers];
  
  imageUrlColumns.forEach(column => {
    if (!newHeaders.includes(column)) {
      newHeaders.push(column);
    }
  });
  
  // Create new data rows with image paths
  const newDataRows = products.map(product => {
    const newRow = [...product.originalRow];
    
    // Ensure row has enough columns
    while (newRow.length < newHeaders.length) {
      newRow.push('');
    }
    
    // Add image paths
    const mainImageIndex = newHeaders.indexOf('Main Image URL');
    const image2Index = newHeaders.indexOf('Image 2 URL');
    const image3Index = newHeaders.indexOf('Image 3 URL');
    const image4Index = newHeaders.indexOf('Image 4 URL');
    
    if (mainImageIndex !== -1) newRow[mainImageIndex] = product.main_image;
    if (image2Index !== -1) newRow[image2Index] = product.image_2;
    if (image3Index !== -1) newRow[image3Index] = product.image_3;
    if (image4Index !== -1) newRow[image4Index] = product.image_4;
    
    return newRow;
  });
  
  // Create new workbook
  const newWorkbook = XLSX.utils.book_new();
  const newWorksheet = XLSX.utils.aoa_to_sheet([newHeaders, ...newDataRows]);
  
  // Add the worksheet to workbook
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Products');
  
  // Save updated Excel file
  const updatedExcelPath = path.join(__dirname, '..', 'Stock-Management-Inventory-With-Paths.xlsx');
  XLSX.writeFile(newWorkbook, updatedExcelPath);
  
  console.log(`✅ Updated Excel saved: ${path.basename(updatedExcelPath)}`);
}

async function createExampleImages() {
  console.log('📸 Creating example placeholder images...');
  
  // Create README files for each category
  for (const category of CATEGORIES) {
    const categoryDir = path.join(IMAGES_DIR, category);
    const readmePath = path.join(categoryDir, 'README.md');
    
    const readmeContent = `# ${category.charAt(0).toUpperCase() + category.slice(1)} Images

## Instructions:
1. Add your ${category} images to this folder
2. Use the naming convention: product-name-1.jpg, product-name-2.jpg, etc.
3. Recommended image specifications:
   - Format: JPG, PNG, or WebP
   - Size: 800x800px to 1200x1200px
   - Quality: High resolution (will be optimized automatically)

## Example filenames:
- royal-kundan-necklace-1.jpg
- royal-kundan-necklace-2.jpg
- diamond-solitaire-ring-1.jpg
- chandelier-earrings-1.jpg

## Next steps:
1. Add your images here
2. Update the Excel file with the correct image paths
3. Run \`npm run sync-inventory\` to update the website
`;
    
    await fs.writeFile(readmePath, readmeContent);
    console.log(`✅ Created README for ${category}`);
  }
}

// Run the setup
if (require.main === module) {
  setupImageStructure();
}

module.exports = {
  setupImageStructure,
  generateImagePaths,
  createDirectoryStructure
}; 