// HomePhotosSection.tsx
// 2-column photo management: left = homes list, right = thumbnails + preview + delete

'use client';

import { useState } from 'react';
import { Space } from '@/data/spaces';
import { Check, Image as ImageIcon } from 'lucide-react';
import { DeleteImageModal } from '@/components/DeleteImageModal';
import { OptimizedImage } from '@/components/OptimizedImage';

interface HomePhotosSectionProps {
  spaces: Space[];
  onDeleteImage: (spaceId: string, imageUrl: string) => Promise<void> | void;
}

export function HomePhotosSection({ spaces, onDeleteImage }: HomePhotosSectionProps) {
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter spaces that have images
  const spacesWithImages = spaces.filter((s) => s.images && s.images.length > 0);

  // Get selected home
  const selectedHome = spacesWithImages.find((s) => s.id === selectedHomeId);
  const selectedHomeImages = selectedHome?.images || [];

  // Auto-select first image when home changes
  const handleHomeSelect = (homeId: string) => {
    setSelectedHomeId(homeId);
    const home = spacesWithImages.find((s) => s.id === homeId);
    if (home && home.images && home.images.length > 0) {
      setSelectedImageUrl(home.images[0]);
    } else {
      setSelectedImageUrl(null);
    }
  };

  const handleDeleteClick = () => {
    if (selectedImageUrl) {
      setModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedHomeId && selectedImageUrl) {
      await onDeleteImage(selectedHomeId, selectedImageUrl);

      // After deletion, check if home still has images
      const home = spacesWithImages.find((s) => s.id === selectedHomeId);
      const remainingImages = home?.images?.filter((img) => img !== selectedImageUrl) || [];

      if (remainingImages.length > 0) {
        // Select next image
        setSelectedImageUrl(remainingImages[0]);
      } else {
        // No images left, deselect home
        setSelectedHomeId(null);
        setSelectedImageUrl(null);
      }

      setModalOpen(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Section Header */}
      <div>
        <h1 className="heading text-2xl md:text-3xl mb-1" style={{ color: '#24323A' }}>
          Home Photos
        </h1>
        <p className="text-sm" style={{ color: '#2F6F8F' }}>
          Manage photos for homes with existing images
        </p>
      </div>

      {/* Main 2-Column Layout */}
      {spacesWithImages.length === 0 ? (
        <div
          className="bg-white rounded-xl p-6 md:p-8 text-center"
          style={{ border: '1px solid #D7E3E7', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-3" style={{ color: '#D7E3E7' }} />
          <p className="text-base" style={{ color: '#2F6F8F' }}>
            No homes with images yet
          </p>
          <p className="text-sm mt-1" style={{ color: '#2F6F8F' }}>
            Upload images to see them here
          </p>
        </div>
      ) : (
        <div
          className="bg-white rounded-xl overflow-hidden flex flex-col lg:flex-row"
          style={{ border: '1px solid #D7E3E7', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}
        >
          {/* LEFT COLUMN: Homes List */}
          <div
            className="w-full lg:w-60 border-b lg:border-b-0 lg:border-r"
            style={{ borderColor: '#D7E3E7', background: '#F7FAFB' }}
          >
            <div className="p-3 md:p-4 border-b" style={{ borderColor: '#D7E3E7' }}>
              <h3 className="text-sm font-semibold" style={{ color: '#24323A' }}>
                Homes ({spacesWithImages.length})
              </h3>
            </div>
            <div className="overflow-y-auto max-h-[200px] md:max-h-[300px] lg:max-h-[600px]">
              {spacesWithImages.map((space) => (
                <button
                  key={space.id}
                  onClick={() => handleHomeSelect(space.id)}
                  className="w-full text-left px-3 md:px-4 py-2.5 md:py-3 transition-colors border-b"
                  style={{
                    background: selectedHomeId === space.id ? '#E8F6F3' : 'transparent',
                    borderColor: '#D7E3E7',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedHomeId !== space.id) {
                      (e.currentTarget as HTMLElement).style.background = '#F7FAFB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedHomeId !== space.id) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: '#24323A' }}
                      >
                        {space.spaceNumber}
                      </p>
                      <p className="text-xs" style={{ color: '#2F6F8F' }}>
                        {space.images?.length || 0} photo{space.images?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {selectedHomeId === space.id && (
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#7FD1C2' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Image Thumbnails + Preview + Delete */}
          <div className="flex-1 flex flex-col">
            {!selectedHomeId ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3" style={{ color: '#D7E3E7' }} />
                  <p className="text-base" style={{ color: '#2F6F8F' }}>
                    Select a home to view photos
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* TOP: Thumbnails Grid */}
                <div className="p-6 border-b" style={{ borderColor: '#D7E3E7' }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: '#24323A' }}>
                    Images ({selectedHomeImages.length})
                  </h3>
                  {selectedHomeImages.length === 0 ? (
                    <p className="text-sm" style={{ color: '#2F6F8F' }}>
                      No images available
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                      {selectedHomeImages.map((imageUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageUrl(imageUrl)}
                          className="relative aspect-square rounded-lg overflow-hidden transition-all"
                          style={{
                            border: selectedImageUrl === imageUrl ? '3px solid #7FD1C2' : '1px solid #D7E3E7',
                            boxShadow: selectedImageUrl === imageUrl ? '0 4px 12px rgba(127, 209, 194, 0.3)' : 'none',
                          }}
                        >
                          <OptimizedImage
                            imageKey={imageUrl}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {selectedImageUrl === imageUrl && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: '#7FD1C2' }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* BOTTOM: Preview + Delete */}
                <div className="flex-1 p-4 md:p-6">
                  {!selectedImageUrl ? (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                      <p className="text-sm" style={{ color: '#2F6F8F' }}>
                        Select an image to preview
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-sm font-semibold" style={{ color: '#24323A' }}>
                        Preview
                      </h3>
                      <div
                        className="relative rounded-xl overflow-hidden"
                        style={{ border: '1px solid #D7E3E7' }}
                      >
                        <OptimizedImage
                          imageKey={selectedImageUrl}
                          alt="Preview"
                          className="w-full h-auto max-h-[300px] md:max-h-[400px] object-contain"
                        />
                      </div>
                      <button
                        onClick={handleDeleteClick}
                        className="btn-delete w-full"
                      >
                        Delete Image
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
