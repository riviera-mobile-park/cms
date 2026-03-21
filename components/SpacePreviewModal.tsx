// SpacePreviewModal.tsx
// Preview modal with image carousel and space specs

'use client';

import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
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

  const statusClass =
    space.status === 'Available' ? 'border-primary text-secondary' :
    space.status === 'Pending'   ? 'border-amber-400 text-amber-600' :
                                   'border-border text-secondary';

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
            className="fixed bottom-0 lg:top-1/2 lg:-translate-y-1/2 left-0 right-0 lg:left-[calc(50%+7.5rem)] lg:-translate-x-1/2 lg:right-auto bg-card rounded-t-3xl lg:rounded-2xl shadow-2xl z-50 max-h-[90vh] lg:h-[95vh] overflow-hidden flex flex-col w-full lg:w-[calc(100vw-17rem)] border border-border"
          >
            {/* Drag Handle (mobile) */}
            <div className="lg:hidden flex justify-center pt-2 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
              <h2 className="heading text-xl text-foreground">Space {space.spaceNumber}</h2>
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
                  <Badge key={text} variant="secondary" className="text-xs px-2.5 py-1 bg-muted text-foreground border-none">
                    {text}
                  </Badge>
                ))}
                {space.storage && (
                  <Badge className="text-xs px-2.5 py-1 text-white bg-primary border-none">
                    Storage
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs px-2.5 py-1 border-border text-secondary">
                  {space.parkingType}
                </Badge>
                {space.forSale && (
                  <Badge className="text-xs px-2.5 py-1 bg-primary text-sidebar-accent border-none">For Sale</Badge>
                )}
                {space.byRmhp && (
                  <Badge className="text-xs px-2.5 py-1 text-white bg-sidebar-accent border-none">
                    RMHP
                  </Badge>
                )}
                <Badge variant="outline" className={`text-xs px-2.5 py-1 ${statusClass}`}>
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
                  <div className="hidden lg:block rounded-xl overflow-hidden border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-background border-b border-border">
                        <tr>
                          {cols.map(({ label }) => (
                            <th key={label} className="px-4 py-2 text-left font-medium whitespace-nowrap text-secondary">
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-card">
                          {cols.map(({ label, value }) => (
                            <td key={label} className="px-4 py-3 whitespace-nowrap text-foreground">
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
                  <p className="text-xs mb-1 text-secondary">About this home</p>
                  <p className="text-sm leading-relaxed text-foreground">{space.aboutHome}</p>
                </div>
              )}

              {/* Image section */}
              <div>
                {hasImages ? (
                  <>
                    <div className="rounded-xl overflow-hidden aspect-[4/3] w-full lg:max-w-sm lg:mx-auto bg-muted">
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
                            className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                              i === activeImage ? 'border-primary opacity-100' : 'border-transparent opacity-60'
                            }`}
                          >
                            <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-2 lg:max-w-sm lg:mx-auto bg-muted">
                    <Home className="w-8 h-8 text-primary" />
                    <p className="text-xs text-secondary">No photos yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-border bg-background">
              <button
                onClick={onClose}
                className="px-4 py-3 text-white rounded-xl transition-colors text-sm bg-primary hover:bg-primary/85"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
