// SpacePreviewModal.tsx
// Preview modal with image carousel and space specs

'use client';

import { useState, useEffect } from 'react';
import { X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Space } from '@/data/spaces';
import { Badge } from '@/components/ui/badge';

interface SpacePreviewModalProps {
  space: Space | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SpacePreviewModal({ space, isOpen, onClose }: SpacePreviewModalProps) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [space]);

  if (!isOpen || !space) return null;

  const images = space.images ?? [];
  const hasImages = images.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 lg:top-1/2 lg:-translate-y-1/2 left-0 right-0 lg:left-[calc(50%+7.5rem)] lg:-translate-x-1/2 lg:right-auto bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl z-50 max-h-[90vh] lg:h-[95vh] overflow-hidden flex flex-col w-full lg:w-[calc(100vw-17rem)]"
            style={{ border: '1px solid #D7E3E7' }}
          >
            {/* Drag Handle (mobile) */}
            <div className="lg:hidden flex justify-center pt-2 pb-1">
              <div className="w-12 h-1.5 rounded-full" style={{ background: '#D7E3E7' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3"
              style={{ borderBottom: '1px solid #D7E3E7' }}
            >
              <h2 className="heading text-xl" style={{ color: '#24323A' }}>Space {space.spaceNumber}</h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* Stat badges — mobile only */}
              <div className="flex flex-wrap gap-1.5 lg:hidden">
                {[
                  { text: `$${space.pricePerMonth}/mo` },
                  { text: space.homeSize },
                  { text: space.lotSize },
                  { text: `${space.bedrooms} bed` },
                  { text: `${space.bathrooms} bath` },
                ].map(({ text }) => (
                  <Badge key={text} variant="secondary" className="text-xs px-2.5 py-1"
                    style={{ background: '#E8F6F3', color: '#24323A', border: 'none' }}>
                    {text}
                  </Badge>
                ))}
                {space.storage && (
                  <Badge className="text-xs px-2.5 py-1 text-white" style={{ background: '#7FD1C2', border: 'none' }}>
                    Storage
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs px-2.5 py-1"
                  style={{ borderColor: '#D7E3E7', color: '#2F6F8F' }}>
                  {space.parkingType}
                </Badge>
                {space.forSale && (
                  <Badge className="bg-amber-500 text-white text-xs px-2.5 py-1">For Sale</Badge>
                )}
                {space.byRmhp && (
                  <Badge className="text-xs px-2.5 py-1 text-white" style={{ background: '#1F4E63', border: 'none' }}>
                    RMHP
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="text-xs px-2.5 py-1"
                  style={{
                    borderColor: space.status === 'Available' ? '#7FD1C2'
                      : space.status === 'Pending' ? '#F59E0B'
                      : '#D7E3E7',
                    color: space.status === 'Available' ? '#2F6F8F'
                      : space.status === 'Pending' ? '#D97706'
                      : '#2F6F8F',
                  }}
                >
                  {space.status}
                </Badge>
              </div>

              {/* Stats table — desktop only */}
              {(() => {
                const cols = [
                  { label: 'Price / Month', value: `$${space.pricePerMonth}` },
                  { label: 'Home Size', value: space.homeSize },
                  { label: 'Lot Size', value: space.lotSize },
                  { label: 'Bedrooms', value: space.bedrooms },
                  { label: 'Bathrooms', value: space.bathrooms },
                  { label: 'Parking', value: space.parkingType },
                  { label: 'Storage', value: space.storage ? 'Yes' : 'No' },
                  { label: 'Status', value: space.status },
                  ...(space.forSale ? [{ label: 'For Sale', value: 'Yes' }] : []),
                  ...(space.byRmhp ? [{ label: 'Listed by', value: 'RMHP' }] : []),
                ];
                return (
                  <div className="hidden lg:block rounded-xl overflow-hidden" style={{ border: '1px solid #D7E3E7' }}>
                    <table className="w-full text-sm">
                      <thead style={{ background: '#F7FAFB', borderBottom: '1px solid #D7E3E7' }}>
                        <tr>
                          {cols.map(({ label }) => (
                            <th key={label} className="px-4 py-2 text-left font-medium whitespace-nowrap" style={{ color: '#2F6F8F' }}>
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ background: '#FFFFFF' }}>
                          {cols.map(({ label, value }) => (
                            <td key={label} className="px-4 py-3 whitespace-nowrap" style={{ color: '#24323A' }}>
                              {value}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* About */}
              {space.aboutHome && (
                <div>
                  <p className="text-xs mb-1" style={{ color: '#2F6F8F' }}>About this home</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#24323A' }}>{space.aboutHome}</p>
                </div>
              )}

              {/* Image section */}
              <div>
                {hasImages ? (
                  <>
                    <div className="rounded-xl overflow-hidden aspect-[4/3] w-full lg:max-w-sm lg:mx-auto"
                      style={{ background: '#E8F6F3' }}
                    >
                      <img
                        src={images[activeImage]}
                        alt={`Space ${space.spaceNumber} photo ${activeImage + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {images.length > 1 && (
                      <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                        {images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all"
                            style={{
                              borderColor: i === activeImage ? '#7FD1C2' : 'transparent',
                              opacity: i === activeImage ? 1 : 0.6,
                            }}
                          >
                            <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-2 lg:max-w-sm lg:mx-auto"
                    style={{ background: '#E8F6F3' }}
                  >
                    <Home className="w-8 h-8" style={{ color: '#7FD1C2' }} />
                    <p className="text-xs" style={{ color: '#2F6F8F' }}>No photos yet</p>
                  </div>
                )}
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-3 p-6" style={{ borderTop: '1px solid #D7E3E7', background: '#F7FAFB' }}>
              <button
                onClick={onClose}
                className="px-4 py-3 text-white rounded-xl transition-colors text-sm"
                style={{ background: '#7FD1C2' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#5FBCAC')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#7FD1C2')}
              >
                Done
              </button>
            </div>          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
