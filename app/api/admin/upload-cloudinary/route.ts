import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Cloudinary upload API called');
    
    // Check if Cloudinary is configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      console.error('❌ Cloudinary not configured');
      return NextResponse.json({
        success: false,
        error: 'Cloudinary not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET environment variables.'
      }, { status: 500 });
    }
    
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No files provided'
      }, { status: 400 });
    }

    console.log(`📦 Received ${files.length} file(s)`);
    
    const uploadedFiles: string[] = [];

    // Upload each file to Cloudinary
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        console.warn(`⚠️ Skipping non-image: ${file.name}`);
        continue;
      }

      try {
        // Convert file to base64 for Cloudinary upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        
        const uploadData = new FormData();
        uploadData.append('file', dataUrl);
        uploadData.append('upload_preset', uploadPreset);
        uploadData.append('folder', 'nurvi-jewels');

        const cloudinaryResponse = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: uploadData,
        });

        if (!cloudinaryResponse.ok) {
          throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.statusText}`);
        }

        const result = await cloudinaryResponse.json();
        uploadedFiles.push(result.secure_url);
        
        console.log(`✅ Uploaded to Cloudinary: ${file.name}`);
      } catch (error) {
        console.error(`❌ Error uploading ${file.name}:`, error);
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No files were successfully uploaded'
      }, { status: 400 });
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
    return NextResponse.json({
      success: false,
      error: 'Failed to upload files',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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

