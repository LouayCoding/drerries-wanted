import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role for storage operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    const mediaTypes: ('image' | 'video')[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        // Validate file type
        const fileType = file.type;
        const isImage = fileType.startsWith('image/');
        const isVideo = fileType.startsWith('video/');

        if (!isImage && !isVideo) {
          errors.push(`${file.name}: Invalid file type. Only images and videos are allowed.`);
          continue;
        }

        // Validate file size (50MB max)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
          errors.push(`${file.name}: File too large. Maximum size is 50MB.`);
          continue;
        }

        // Validate specific formats
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        const validVideoTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/quicktime'];

        if (isImage && !validImageTypes.includes(fileType)) {
          errors.push(`${file.name}: Unsupported image format. Use JPG, PNG, WEBP, or GIF.`);
          continue;
        }

        if (isVideo && !validVideoTypes.includes(fileType)) {
          errors.push(`${file.name}: Unsupported video format. Use MP4, WEBM, or MOV.`);
          continue;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const fileExtension = file.name.split('.').pop();
        const fileName = `${timestamp}_${randomString}.${fileExtension}`;
        const filePath = `wanted-media/${fileName}`;

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('wanted-media')
          .upload(filePath, buffer, {
            contentType: fileType,
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          errors.push(`${file.name}: Upload failed - ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('wanted-media')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
        mediaTypes.push(isImage ? 'image' : 'video');

      } catch (error: any) {
        errors.push(`${file.name}: ${error.message}`);
      }
    }

    // Return results
    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { 
          error: 'All uploads failed', 
          details: errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      types: mediaTypes,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload media', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove media file from storage (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File URL is required' },
        { status: 400 }
      );
    }

    // Extract file path from URL
    const urlParts = fileUrl.split('/wanted-media/');
    if (urlParts.length < 2) {
      return NextResponse.json(
        { error: 'Invalid file URL' },
        { status: 400 }
      );
    }

    const filePath = `wanted-media/${urlParts[1]}`;

    // Delete from storage
    const { error } = await supabase.storage
      .from('wanted-media')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'File deleted successfully' });

  } catch (error: any) {
    console.error('Media delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}

