'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaUploaderProps {
  onUploadComplete: (urls: string[], types: ('image' | 'video')[]) => void;
  existingMedia?: { urls: string[]; types: ('image' | 'video')[] };
}

interface MediaItem {
  url: string;
  type: 'image' | 'video';
  file?: File;
}

export default function MediaUploader({ onUploadComplete, existingMedia }: MediaUploaderProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    if (existingMedia && existingMedia.urls.length > 0) {
      return existingMedia.urls.map((url, index) => ({
        url,
        type: existingMedia.types[index] || 'image',
      }));
    }
    return [];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newItems: MediaItem[] = [];

    Array.from(files).forEach((file) => {
      const fileType = file.type;
      const isImage = fileType.startsWith('image/');
      const isVideo = fileType.startsWith('video/');

      if (!isImage && !isVideo) {
        toast.error(`${file.name}: Alleen afbeeldingen en video's zijn toegestaan`);
        return;
      }

      // Check file size (50MB max)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`${file.name}: Bestand te groot (max 50MB)`);
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      newItems.push({
        url: previewUrl,
        type: isImage ? 'image' : 'video',
        file,
      });
    });

    setMediaItems((prev) => [...prev, ...newItems]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const removeItem = (index: number) => {
    setMediaItems((prev) => {
      const newItems = [...prev];
      // Revoke object URL if it exists
      if (newItems[index].file) {
        URL.revokeObjectURL(newItems[index].url);
      }
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const uploadMedia = async () => {
    const filesToUpload = mediaItems.filter((item) => item.file);

    if (filesToUpload.length === 0) {
      // No new files to upload, just return existing media
      const urls = mediaItems.map((item) => item.url);
      const types = mediaItems.map((item) => item.type);
      onUploadComplete(urls, types);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      filesToUpload.forEach((item) => {
        if (item.file) {
          formData.append('files', item.file);
        }
      });

      const response = await fetch('/api/wanted/upload-media', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Combine existing media with newly uploaded
      const existingItems = mediaItems.filter((item) => !item.file);
      const allUrls = [...existingItems.map((item) => item.url), ...data.urls];
      const allTypes = [...existingItems.map((item) => item.type), ...data.types];

      setUploadProgress(100);
      toast.success(`${data.urls.length} bestand(en) geüpload`);
      
      onUploadComplete(allUrls, allTypes);
    } catch (error: any) {
      toast.error(`Upload mislukt: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? 'border-[#5865f2] bg-[#5865f2]/5'
            : 'border-[#40444b] hover:border-[#5865f2]/50'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-4 text-center pointer-events-none">
          <div className="p-4 bg-[#5865f2]/10 rounded-full">
            <Upload className="w-8 h-8 text-[#5865f2]" />
          </div>
          <div>
            <p className="text-lg font-medium text-white mb-1">
              Sleep bestanden hierheen of klik om te selecteren
            </p>
            <p className="text-sm text-[#72767d]">
              Afbeeldingen (JPG, PNG, WEBP, GIF) en video&apos;s (MP4, WEBM, MOV) • Max 50MB per bestand
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="p-4 bg-[#2f3136] rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-5 h-5 text-[#5865f2] animate-spin" />
            <span className="text-white font-medium">Uploaden...</span>
            <span className="text-[#72767d] text-sm ml-auto">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-[#40444b] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5865f2] to-[#7289da] transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Media Preview Grid */}
      {mediaItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaItems.map((item, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-[#2f3136] group"
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Type Badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white flex items-center gap-1">
                {item.type === 'image' ? (
                  <ImageIcon className="w-3 h-3" />
                ) : (
                  <Video className="w-3 h-3" />
                )}
                {item.type}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(index)}
                disabled={isUploading}
                className="absolute top-2 right-2 p-1.5 bg-[#f04747] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Upload Status */}
              {item.file && (
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="px-2 py-1 bg-yellow-500/90 rounded text-xs text-black font-medium text-center">
                    Te uploaden
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {mediaItems.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-[#2f3136] rounded-lg">
          <div className="text-sm text-[#b9bbbe]">
            {mediaItems.length} bestand(en) geselecteerd
            {mediaItems.filter((item) => item.file).length > 0 && (
              <span className="text-yellow-500 ml-2">
                ({mediaItems.filter((item) => item.file).length} nieuw)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export the uploadMedia function to be called from parent
export { type MediaItem };

