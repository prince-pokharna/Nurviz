#!/usr/bin/env node

const ExcelJS = require('exceljs');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

console.log('🖼️  Advanced Auto-Extract Images from Excel...');

// Configuration
const EXCEL_FILE = path.join(__dirname, '..', 'Stock-Management-Inventory.xlsx');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const EXTRACTED_DIR = path.join(IMAGES_DIR, 'auto-extracted');

// Image processing configuration
const IMAGE_CONFIG = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 85,
  format: 'jpg',
  categories: ['necklaces', 'rings', 'earrings', 'bracelets', 'anklets']
};

async function autoExtractAdvanced() {
  try {
    console.log('📊 Reading Excel file with ExcelJS...');
    
    // Ensure directories exist
    await ensureDirectories();
    
    // Check if Excel file exists
    const excelExists = await checkFileExists(EXCEL_FILE);
    if (!excelExists) {
      throw new Error(`Excel file not found: ${EXCEL_FILE}`);
    }

    // Check file info
    const stats = await fs.stat(EXCEL_FILE);
    console.log(`📄 Excel file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    // Try to read Excel file with ExcelJS
    let workbook;
    try {
      workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(EXCEL_FILE);
      console.log('✅ Excel file loaded successfully with ExcelJS');
    } catch (excelError) {
      console.log('⚠️  ExcelJS failed, trying alternative method...');
      console.log('📝 Error details:', excelError.message);
      
      // Fallback to basic XLSX library
      const XLSX = require('xlsx');
      const xlsxWorkbook = XLSX.readFile(EXCEL_FILE);
      
      // Convert to ExcelJS format
      workbook = new ExcelJS.Workbook();
      const sheetName = xlsxWorkbook.SheetNames[0];
      const worksheet = workbook.addWorksheet(sheetName);
      
      // Convert data
      const xlsxData = XLSX.utils.sheet_to_json(xlsxWorkbook.Sheets[sheetName], { 
        header: 1,
        defval: "",
        blankrows: false 
      });
      
      // Add data to ExcelJS worksheet
      xlsxData.forEach((row, rowIndex) => {
        worksheet.getRow(rowIndex + 1).values = row;
      });
      
      console.log('✅ Excel file converted using XLSX library');
    }
    
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new Error('No worksheet found in Excel file');
    }

    // Get headers and data
    const headers = [];
    const dataRows = [];
    
    try {
      worksheet.getRow(1).eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value?.toString() || '';
      });
      
      // Get all data rows
      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        const rowData = [];
        
        for (let colNumber = 1; colNumber <= headers.length; colNumber++) {
          const cell = row.getCell(colNumber);
          rowData[colNumber - 1] = cell.value?.toString() || '';
        }
        
        // Only add non-empty rows
        if (rowData.some(cell => cell.trim() !== '')) {
          dataRows.push(rowData);
        }
      }
    } catch (parseError) {
      console.log('⚠️  Error parsing Excel data:', parseError.message);
      throw new Error('Unable to parse Excel file data');
    }

    console.log(`✅ Found ${dataRows.length} product rows`);
    console.log('📋 Headers:', headers);

    // Extract images from worksheet
    const extractedImages = await extractImagesFromWorksheet(worksheet);
    
    // Process and organize images by product
    const processedImages = await processAndOrganizeImages(extractedImages, dataRows, headers);
    
    // Generate updated Excel with correct image paths
    await generateUpdatedExcel(processedImages, headers, dataRows);
    
    console.log('🎉 Advanced auto-extract completed successfully!');
    console.log(`📸 Extracted ${extractedImages.length} images`);
    console.log(`📦 Processed ${processedImages.length} products`);
    
  } catch (error) {
    console.error('❌ Advanced auto-extract failed:', error);
    console.error('💡 Suggestions:');
    console.error('   - Check if Excel file is corrupted');
    console.error('   - Try saving Excel file as .xlsx format');
    console.error('   - Ensure Excel file is not password protected');
    console.error('   - Check if file is currently open in Excel');
    process.exit(1);
  }
}

async function ensureDirectories() {
  const dirs = [
    IMAGES_DIR,
    EXTRACTED_DIR,
    ...IMAGE_CONFIG.categories.map(cat => path.join(IMAGES_DIR, cat))
  ];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
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

async function extractImagesFromWorksheet(worksheet) {
  console.log('🔍 Extracting embedded images from Excel...');
  
  const extractedImages = [];
  
  // Get all images from worksheet
  const images = worksheet.getImages();
  
  console.log(`📸 Found ${images.length} embedded images`);
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    
    try {
      // Get image buffer from workbook
      const imageBuffer = worksheet.workbook.model.media[image.imageId];
      
      if (imageBuffer && imageBuffer.buffer) {
        // Determine image extension
        const extension = imageBuffer.extension || 'jpg';
        
        // Get image position/range
        const range = image.range;
        
        // Extract image info
        const imageInfo = {
          index: i,
          imageId: image.imageId,
          extension,
          buffer: imageBuffer.buffer,
          range,
          row: range.tl.row + 1, // Convert to 1-based
          col: range.tl.col + 1,
          filename: `extracted-${i + 1}.${extension}`
        };
        
        extractedImages.push(imageInfo);
        console.log(`✅ Found image ${i + 1}: Row ${imageInfo.row}, Col ${imageInfo.col}`);
        
      } else {
        console.warn(`⚠️  Could not extract image ${i + 1}: No buffer found`);
      }
      
    } catch (error) {
      console.error(`❌ Error extracting image ${i + 1}:`, error.message);
    }
  }
  
  return extractedImages;
}

async function processAndOrganizeImages(extractedImages, dataRows, headers) {
  console.log('🔧 Processing and organizing images by product...');
  
  const processedImages = [];
  
  for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
    const row = dataRows[rowIndex];
    const productId = row[0] || `P${rowIndex + 1}`;
    const productName = row[1] || `Product ${rowIndex + 1}`;
    const category = (row[2] || 'general').toLowerCase();
    
    // Find images for this row (row + 2 because of header and 0-based index)
    const rowNumber = rowIndex + 2;
    const rowImages = extractedImages.filter(img => img.row === rowNumber);
    
    console.log(`📝 Product ${productId}: Found ${rowImages.length} images`);
    
    // Process each image for this product
    const productImages = [];
    
    for (let imageIndex = 0; imageIndex < rowImages.length; imageIndex++) {
      const image = rowImages[imageIndex];
      
      try {
        // Generate filename
        const cleanName = productName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        const categoryFolder = IMAGE_CONFIG.categories.includes(category) 
          ? category 
          : 'general';
        
        const filename = `${cleanName}-${imageIndex + 1}.jpg`;
        const filepath = path.join(IMAGES_DIR, categoryFolder, filename);
        const webPath = `/images/products/${categoryFolder}/${filename}`;
        
        // Process and save image
        await processAndSaveImage(image.buffer, filepath);
        
        productImages.push({
          index: imageIndex + 1,
          filename,
          filepath,
          webPath,
          original: image
        });
        
        console.log(`✅ Saved: ${webPath}`);
        
      } catch (error) {
        console.error(`❌ Error processing image for ${productId}:`, error.message);
      }
    }
    
    // Generate all image paths (even if no images found)
    const imagePaths = {
      productId,
      productName,
      category,
      rowIndex,
      images: productImages,
      main_image: productImages[0]?.webPath || generatePlaceholderPath(productId, productName, category, 1),
      image_2: productImages[1]?.webPath || generatePlaceholderPath(productId, productName, category, 2),
      image_3: productImages[2]?.webPath || generatePlaceholderPath(productId, productName, category, 3),
      image_4: productImages[3]?.webPath || generatePlaceholderPath(productId, productName, category, 4)
    };
    
    processedImages.push(imagePaths);
  }
  
  return processedImages;
}

async function processAndSaveImage(buffer, filepath) {
  // Use Sharp to process and optimize image
  await sharp(buffer)
    .resize(IMAGE_CONFIG.maxWidth, IMAGE_CONFIG.maxHeight, { 
      fit: 'inside',
      withoutEnlargement: true 
    })
    .jpeg({ quality: IMAGE_CONFIG.quality })
    .toFile(filepath);
}

function generatePlaceholderPath(productId, productName, category, imageNumber) {
  const cleanName = productName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const categoryFolder = IMAGE_CONFIG.categories.includes(category) 
    ? category 
    : 'general';
  
  return `/images/products/${categoryFolder}/${cleanName}-${imageNumber}.jpg`;
}

async function generateUpdatedExcel(processedImages, headers, dataRows) {
  console.log('📝 Generating updated Excel with image paths...');
  
  // Create new workbook and worksheet
  const newWorkbook = new ExcelJS.Workbook();
  const newWorksheet = newWorkbook.addWorksheet('Products');
  
  // Add image URL columns to headers
  const imageUrlColumns = ['Main Image URL', 'Image 2 URL', 'Image 3 URL', 'Image 4 URL'];
  const newHeaders = [...headers];
  
  imageUrlColumns.forEach(column => {
    if (!newHeaders.includes(column)) {
      newHeaders.push(column);
    }
  });
  
  // Set headers
  newWorksheet.getRow(1).values = newHeaders;
  
  // Add data rows with image paths
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const imagePaths = processedImages[i];
    const newRow = [...row];
    
    // Ensure row has enough columns
    while (newRow.length < newHeaders.length) {
      newRow.push('');
    }
    
    // Add image paths
    const mainImageIndex = newHeaders.indexOf('Main Image URL');
    const image2Index = newHeaders.indexOf('Image 2 URL');
    const image3Index = newHeaders.indexOf('Image 3 URL');
    const image4Index = newHeaders.indexOf('Image 4 URL');
    
    if (mainImageIndex !== -1) newRow[mainImageIndex] = imagePaths.main_image;
    if (image2Index !== -1) newRow[image2Index] = imagePaths.image_2;
    if (image3Index !== -1) newRow[image3Index] = imagePaths.image_3;
    if (image4Index !== -1) newRow[image4Index] = imagePaths.image_4;
    
    // Set row data
    newWorksheet.getRow(i + 2).values = newRow;
  }
  
  // Style the header row
  const headerRow = newWorksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };
  
  // Auto-fit columns
  newWorksheet.columns.forEach(column => {
    column.width = 15;
  });
  
  // Save updated Excel file
  const updatedExcelPath = path.join(__dirname, '..', 'Stock-Management-Inventory-Updated.xlsx');
  await newWorkbook.xlsx.writeFile(updatedExcelPath);
  
  console.log(`✅ Updated Excel saved: ${updatedExcelPath}`);
  
  // Also create a summary report
  await createSummaryReport(processedImages, updatedExcelPath);
}

async function createSummaryReport(processedImages, excelPath) {
  console.log('📊 Creating extraction summary report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    totalProducts: processedImages.length,
    totalImages: processedImages.reduce((sum, p) => sum + p.images.length, 0),
    products: processedImages.map(p => ({
      productId: p.productId,
      productName: p.productName,
      category: p.category,
      imageCount: p.images.length,
      imagePaths: {
        main_image: p.main_image,
        image_2: p.image_2,
        image_3: p.image_3,
        image_4: p.image_4
      }
    }))
  };
  
  const reportPath = path.join(__dirname, '..', 'data', 'image-extraction-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📋 Summary report saved: ${reportPath}`);
}

// Run the advanced auto-extract
if (require.main === module) {
  autoExtractAdvanced();
}

module.exports = {
  autoExtractAdvanced,
  processAndOrganizeImages,
  generatePlaceholderPath
}; 