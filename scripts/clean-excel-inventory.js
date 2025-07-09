#!/usr/bin/env node

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('🧹 Starting Excel file cleanup...');

// Configuration
const EXCEL_FILE = path.join(__dirname, '..', 'Stock-Management-Inventory-Updated.xlsx');
const BACKUP_FILE = path.join(__dirname, '..', 'Stock-Management-Inventory-Backup.xlsx');

// Columns to remove (unnecessary and confidential)
const COLUMNS_TO_REMOVE = [
  'supplier',
  'Supplier', 
  'supplier contact',
  'Supplier Contact',
  'stone/gemstone',
  'Stone/Gemstone',
  'Stone',
  'Gemstone',
  'length',
  'Length',
  'reviews count',
  'Reviews Count',
  'Reviews_Count',
  'seo title',
  'SEO Title',
  'SEO_Title',
  'seo description', 
  'SEO Description',
  'SEO_Description',
  'date added',
  'Date Added',
  'Date_Added',
  'last updated',
  'Last Updated', 
  'Last_Updated',
  'stock quantity',
  'Stock Quantity',
  'Stock_Quantity',
  'profit margin',
  'Profit Margin',
  'Profit_Margin',
  'content creator friendly',
  'Content Creator Friendly',
  'Content_Creator_Friendly',
  'photoshoot ready',
  'Photoshoot Ready',
  'Photoshoot_Ready',
  'target audience',
  'Target Audience',
  'Target_Audience',
  'social media tags',
  'Social Media Tags',
  'Social_Media_Tags',
  'influencer category',
  'Influencer Category',
  'Influencer_Category',
  'video content ready',
  'Video Content Ready',
  'Video_Content_Ready',
  'status',
  'Status',
  'notes',
  'Notes'
];

async function cleanExcelFile() {
  try {
    // Check if Excel file exists
    if (!fs.existsSync(EXCEL_FILE)) {
      console.error(`❌ Excel file not found: ${EXCEL_FILE}`);
      process.exit(1);
    }

    console.log('📊 Reading Excel file:', EXCEL_FILE);
    
    // Create backup first
    fs.copyFileSync(EXCEL_FILE, BACKUP_FILE);
    console.log('✅ Backup created:', BACKUP_FILE);
    
    // Read the Excel file
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON to work with the data
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === 0) {
      console.error('❌ Excel file is empty');
      process.exit(1);
    }
    
    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);
    
    console.log(`📋 Original columns (${headers.length}):`, headers);
    
    // Find indices of columns to remove
    const columnsToRemoveIndices = [];
    headers.forEach((header, index) => {
      if (COLUMNS_TO_REMOVE.some(col => 
        col.toLowerCase() === header.toLowerCase() || 
        col.toLowerCase().replace(/[^a-z0-9]/g, '') === header.toLowerCase().replace(/[^a-z0-9]/g, '')
      )) {
        columnsToRemoveIndices.push(index);
        console.log(`🗑️  Removing column: ${header} (index ${index})`);
      }
    });
    
    console.log(`📊 Removing ${columnsToRemoveIndices.length} columns...`);
    
    // Remove columns from headers
    const cleanHeaders = headers.filter((header, index) => !columnsToRemoveIndices.includes(index));
    
    // Remove columns from data rows
    const cleanDataRows = dataRows.map(row => 
      row.filter((cell, index) => !columnsToRemoveIndices.includes(index))
    );
    
    // Combine cleaned headers and data
    const cleanData = [cleanHeaders, ...cleanDataRows];
    
    console.log(`📋 New columns (${cleanHeaders.length}):`, cleanHeaders);
    console.log(`📊 Data rows: ${cleanDataRows.length}`);
    
    // Create new worksheet with cleaned data
    const newWorksheet = XLSX.utils.aoa_to_sheet(cleanData);
    
    // Update the workbook
    workbook.Sheets[sheetName] = newWorksheet;
    
    // Write the cleaned Excel file
    XLSX.writeFile(workbook, EXCEL_FILE);
    
    console.log('✅ Excel file cleaned successfully!');
    console.log(`📊 Removed ${columnsToRemoveIndices.length} unnecessary columns`);
    console.log(`📋 Final file has ${cleanHeaders.length} columns and ${cleanDataRows.length} rows`);
    console.log(`💾 Cleaned file saved as: ${EXCEL_FILE}`);
    console.log(`🔄 Backup available at: ${BACKUP_FILE}`);
    
    // Display summary of removed columns
    console.log('\n📝 Summary of removed columns:');
    columnsToRemoveIndices.forEach(index => {
      console.log(`   - ${headers[index]}`);
    });
    
    console.log('\n🎉 Excel cleanup completed successfully!');
    console.log('💡 The cleaned Excel file is now ready for proper stock management.');
    
  } catch (error) {
    console.error('❌ Error cleaning Excel file:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanExcelFile(); 