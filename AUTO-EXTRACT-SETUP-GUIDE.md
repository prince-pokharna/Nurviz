# 🖼️ Auto-Extract Images Setup Guide

## 🎯 Overview
This system allows you to **insert images directly into Excel** and automatically extract them to your website with proper organization and optimization.

## 📋 Prerequisites
- Node.js installed
- Excel file with embedded images
- Basic knowledge of Excel

## 🔧 Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- `exceljs` - For reading Excel files with images
- `sharp` - For image processing and optimization
- Other existing dependencies

### Step 2: Excel File Structure

Your Excel file should have these **minimum columns**:
```
A. Product ID
B. Product Name
C. Category
D. Website Section
E. Price (₹)
F. Original Price (₹)
G. Main Image URL          ← Auto-filled by script
H. Image 2 URL            ← Auto-filled by script  
I. Image 3 URL            ← Auto-filled by script
J. Image 4 URL            ← Auto-filled by script
... (other product data columns)
```

### Step 3: Adding Images to Excel

#### Method 1: Insert → Pictures
1. **Click** on any cell in the product row
2. **Insert → Pictures → This Device**
3. **Select** your jewelry image
4. **Resize** image to fit within the row
5. **Repeat** for multiple images per product

#### Method 2: Copy & Paste
1. **Copy** image from anywhere (computer, web, etc.)
2. **Click** on the cell where you want the image
3. **Paste** (Ctrl+V)
4. **Resize** if needed

#### Method 3: Drag & Drop
1. **Open** your image folder
2. **Drag** image files directly into Excel cells
3. **Drop** them in the appropriate product rows

### Step 4: Image Organization Tips

#### Best Practices:
- **One row per product** - Put all images for a product in the same row
- **Multiple images per product** - Place up to 4 images per product
- **Image quality** - Use high-quality images (will be optimized automatically)
- **File formats** - JPG, PNG, and WebP are supported

#### Image Placement:
```
Row 2: Product 1 → [Image 1] [Image 2] [Image 3] [Image 4]
Row 3: Product 2 → [Image 1] [Image 2] [Image 3] [Image 4]
Row 4: Product 3 → [Image 1] [Image 2] [Image 3] [Image 4]
```

## 🚀 Usage Instructions

### Step 1: Prepare Your Excel File
1. **Open** your `Stock-Management-Inventory.xlsx` file
2. **Add** your product data (ID, Name, Category, etc.)
3. **Insert** images directly into the cells
4. **Save** the Excel file

### Step 2: Run Auto-Extract
```bash
npm run auto-extract
```

**What this does:**
- 📖 Reads your Excel file
- 🔍 Finds all embedded images
- 📁 Organizes images by category
- 🖼️ Optimizes images (resizes, compresses)
- 💾 Saves images to website folders
- 📝 Creates updated Excel with image URLs
- 📊 Generates summary report

### Step 3: Check Results
After running auto-extract:

1. **New Excel file**: `Stock-Management-Inventory-Updated.xlsx`
2. **Extracted images**: `public/images/products/[category]/`
3. **Summary report**: `data/image-extraction-report.json`

### Step 4: Sync to Website
```bash
npm run sync-inventory
```

This updates your website with the new images and paths.

## 📁 File Organization

### Automatic Folder Structure:
```
public/images/products/
├── necklaces/
│   ├── royal-kundan-necklace-1.jpg
│   ├── royal-kundan-necklace-2.jpg
│   └── ...
├── rings/
│   ├── diamond-ring-1.jpg
│   ├── diamond-ring-2.jpg
│   └── ...
├── earrings/
│   ├── chandelier-earrings-1.jpg
│   └── ...
├── bracelets/
│   ├── tennis-bracelet-1.jpg
│   └── ...
└── anklets/
    ├── gold-anklet-1.jpg
    └── ...
```

### Image Naming Convention:
- Format: `[product-name]-[number].jpg`
- Example: `royal-kundan-necklace-1.jpg`
- Automatic: Special characters removed, lowercase

## 📊 Image Processing

### Automatic Optimization:
- **Maximum size**: 1200x1200 pixels
- **Format**: JPG (optimized for web)
- **Quality**: 85% (balance of quality/file size)
- **Compression**: Smart compression applied

### Original vs Processed:
- **Original**: Your high-quality images
- **Processed**: Web-optimized versions
- **Backup**: Original Excel file preserved

## 🔄 Complete Workflow

### For New Products:
1. **Add** product data to Excel
2. **Insert** product images directly in Excel
3. **Run** `npm run auto-extract`
4. **Run** `npm run sync-inventory`
5. **Check** website for new products

### For Updating Images:
1. **Replace** images in Excel file
2. **Run** `npm run auto-extract`
3. **Run** `npm run sync-inventory`
4. **Verify** updated images on website

## 📝 Output Files

### Stock-Management-Inventory-Updated.xlsx
- **Your original data** + **auto-generated image URLs**
- **Use this file** for future updates
- **Keep the original** as backup

### image-extraction-report.json
```json
{
  "timestamp": "2025-01-05T12:00:00.000Z",
  "totalProducts": 25,
  "totalImages": 78,
  "products": [
    {
      "productId": "P001",
      "productName": "Royal Kundan Necklace",
      "category": "necklaces",
      "imageCount": 3,
      "imagePaths": {
        "main_image": "/images/products/necklaces/royal-kundan-necklace-1.jpg",
        "image_2": "/images/products/necklaces/royal-kundan-necklace-2.jpg",
        "image_3": "/images/products/necklaces/royal-kundan-necklace-3.jpg",
        "image_4": "/images/products/necklaces/royal-kundan-necklace-4.jpg"
      }
    }
  ]
}
```

## 🛠️ Troubleshooting

### Common Issues:

#### "Excel file not found"
- **Check**: Excel file is named `Stock-Management-Inventory.xlsx`
- **Location**: File is in the project root directory
- **Solution**: Rename or move your Excel file

#### "No images found"
- **Check**: Images are actually embedded in Excel (not just links)
- **Solution**: Use Insert → Pictures, not just typing URLs
- **Tip**: You should see the actual image in the Excel cell

#### "Images not appearing on website"
- **Check**: Did you run `npm run sync-inventory` after auto-extract?
- **Solution**: Always run sync after extracting images
- **Verify**: Check `data/inventory.json` for image paths

#### "Poor image quality"
- **Check**: Original images are high quality
- **Solution**: Use images at least 800x800 pixels
- **Note**: System automatically optimizes for web

### Getting Help:
- **Check**: Console output for detailed error messages
- **Verify**: All dependencies are installed (`npm install`)
- **Test**: Try with a simple Excel file first

## 📈 Advanced Features

### Batch Processing:
- Process hundreds of products at once
- Automatic category detection
- Smart filename generation

### Image Optimization:
- Automatic resizing for web
- Compression without quality loss
- Multiple format support

### Backup System:
- Original Excel file preserved
- Image extraction report generated
- Rollback capability maintained

## 🎉 Success Checklist

After running auto-extract, you should have:
- ✅ Updated Excel file with image URLs
- ✅ Images organized in category folders
- ✅ Optimized images for web
- ✅ Summary report generated
- ✅ Website ready for sync

## 🔄 Next Steps

1. **Run** the auto-extract process
2. **Check** the generated files
3. **Sync** to your website
4. **Test** the website functionality
5. **Enjoy** your automated image management!

---

**Note**: This system revolutionizes your workflow by eliminating manual image management. Simply add images to Excel and let the automation handle the rest! 