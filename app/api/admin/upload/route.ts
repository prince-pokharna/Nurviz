import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Increase body size limit for image uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload API called');
    
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const category = (formData.get('category') as string || 'general').toLowerCase();
    
    console.log(`📦 Received ${files.length} file(s) for category: ${category}`);
    
    if (!files || files.length === 0) {
      console.error('❌ No files provided');
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedFiles: string[] = [];
    const timestamp = Date.now();
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'products', category);
    console.log(`📁 Upload directory: ${uploadDir}`);
    
    if (!existsSync(uploadDir)) {
      console.log('📁 Creating upload directory...');
      await mkdir(uploadDir, { recursive: true });
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      console.log(`📄 Processing file ${i + 1}: ${file.name} (${file.type}, ${file.size} bytes)`);
      
      if (!file.type.startsWith('image/')) {
        console.warn(`⚠️ Skipping non-image file: ${file.name}`);
        continue; // Skip non-image files
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        console.warn(`⚠️ File too large: ${file.name} (${file.size} bytes)`);
        continue;
      }

      // Generate unique filename with sanitized name
      const sanitizedName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-')
        .replace(/-+/g, '-');
      const extension = sanitizedName.split('.').pop() || 'jpg';
      const nameWithoutExt = sanitizedName.replace(`.${extension}`, '').substring(0, 30);
      const filename = `${nameWithoutExt}-${timestamp}-${i}.${extension}`;
      const filepath = path.join(uploadDir, filename);
      
      console.log(`💾 Saving to: ${filepath}`);
      
      try {
        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);
        
        // Add to uploaded files list with public path
        const publicPath = `/images/products/${category}/${filename}`;
        uploadedFiles.push(publicPath);
        
        console.log(`✅ Successfully saved: ${publicPath}`);
      } catch (fileError) {
        console.error(`❌ Error saving file ${file.name}:`, fileError);
      }
    }

    if (uploadedFiles.length === 0) {
      console.error('❌ No files were successfully uploaded');
      return NextResponse.json(
        { success: false, error: 'No valid image files were uploaded' },
        { status: 400 }
      );
    }

    console.log(`✅ Upload complete: ${uploadedFiles.length} file(s)`);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} image(s)`,
      files: uploadedFiles,
      count: uploadedFiles.length
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload files',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
