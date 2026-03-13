// Upload.tsx
// Image upload page with drag-and-drop

'use client';

import { useRef, useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { Space } from '@/data/spaces';
import { ImageAssignmentModal } from '@/components/ImageAssignmentModal';

interface UploadProps {
  spaces: Space[];
  onImagesAssigned: (spaceId: string, images: File[]) => Promise<void> | void;
}

export function Upload({ spaces, onImagesAssigned }: UploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setIsAssigning(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length > 0) {
      setSelectedFiles(files);
      setIsAssigning(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFinish = async (spaceId: string, images: File[]) => {
    await onImagesAssigned(spaceId, images);
    closeModal();
  };

  const closeModal = () => {
    setIsAssigning(false);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading text-3xl mb-1" style={{ color: '#24323A' }}>Upload Images</h1>
        <p className="text-sm" style={{ color: '#2F6F8F' }}>
          Upload and assign property images to mobile home spaces
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="bg-white rounded-xl p-12 lg:p-16 flex flex-col items-center justify-center cursor-pointer transition-colors"
        style={{
          border: `2px dashed ${isDragging ? '#7FD1C2' : '#D7E3E7'}`,
          background: isDragging ? '#E8F6F3' : '#FFFFFF',
          boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
        }}
      >
        {/* Icon circle — solid seafoam, no gradient */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background: '#7FD1C2' }}
        >
          <UploadIcon className="w-8 h-8 text-white" />
        </div>

        <h2 className="heading text-xl mb-1.5" style={{ color: '#24323A' }}>
          Tap to select images
        </h2>
        <p className="text-sm text-center" style={{ color: '#2F6F8F' }}>
          PNG, JPG, or WebP · Select all photos for one home at a time
        </p>

        {/* Primary button */}
        <button
          className="mt-6 px-6 py-2.5 rounded-xl text-sm text-white transition-colors"
          style={{ background: '#7FD1C2' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#5FBCAC')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#7FD1C2')}
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
        >
          Choose Files
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Image Assignment Modal */}
      <ImageAssignmentModal
        images={selectedFiles}
        spaces={spaces}
        isOpen={isAssigning}
        onClose={closeModal}
        onFinish={handleFinish}
      />
    </div>
  );
}
