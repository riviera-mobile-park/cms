// EditSpaceModal.tsx
// Modal for editing space details - handles images, pricing, beds/baths, etc.

'use client';

import { useState, useEffect, useRef } from 'react';
import { X, GripVertical, ImageOff } from 'lucide-react';
import { Space } from '@/data/spaces';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'motion/react';

interface EditSpaceModalProps {
  space: Space | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (space: Space) => void;
}

export function EditSpaceModal({ space, isOpen, onClose, onSave }: EditSpaceModalProps) {
  const [formData, setFormData] = useState<Space | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [imageOrder, setImageOrder] = useState<string[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [spaceNumInput, setSpaceNumInput] = useState('');
  const [unitLetterInput, setUnitLetterInput] = useState('');
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  useEffect(() => {
    if (space) {
      setFormData({ ...space });
      setCharCount(space.aboutHome.length);
      setImageOrder([...(space.images ?? [])]);
      // Parse existing spaceNumber into the two fields
      const sn = space.spaceNumber.trim();
      const isNumeric = /^\d+$/.test(sn);
      const isUnitLetter = /^(unit\s+)?[a-zA-Z]$/i.test(sn);
      if (isNumeric) {
        setSpaceNumInput(sn);
        setUnitLetterInput('');
      } else if (isUnitLetter) {
        setSpaceNumInput('');
        setUnitLetterInput(sn.replace(/^unit\s+/i, '').toUpperCase());
      } else {
        // fallback: put whatever is there into the space number box
        setSpaceNumInput(sn);
        setUnitLetterInput('');
      }
    }
  }, [space]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    // Combine the two fields: prefer spaceNum; fall back to unit letter
    const combined = spaceNumInput.trim() || unitLetterInput.trim();
    onSave({ ...formData!, images: imageOrder, spaceNumber: combined });
    onClose();
  };

  const handleAboutHomeChange = (value: string) => {
    setFormData({ ...formData, aboutHome: value });
    setCharCount(value.length);
  };

  const handleDragStart = (index: number) => { dragIndex.current = index; };

  const handleDragEnter = (index: number) => {
    dragOverIndex.current = index;
    if (dragIndex.current === null || dragIndex.current === index) return;
    const reordered = [...imageOrder];
    const dragged = reordered.splice(dragIndex.current, 1)[0];
    reordered.splice(index, 0, dragged);
    dragIndex.current = index;
    setImageOrder(reordered);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    dragOverIndex.current = null;
  };

  const handleCancelClick = () => setShowCancelConfirm(true);
  const handleConfirmDiscard = () => { setShowCancelConfirm(false); onClose(); };
  const handleKeepEditing = () => setShowCancelConfirm(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
            {/* Drag Handle (mobile only) */}
            <div className="lg:hidden flex justify-center pt-2 pb-1">
              <div className="w-12 h-1.5 rounded-full" style={{ background: '#D7E3E7' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-6"
              style={{ borderBottom: '1px solid #D7E3E7' }}
            >
              <h2 className="heading text-2xl" style={{ color: '#24323A' }}>Edit Space</h2>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* Space Number + Unit Letter — two separate boxes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="spaceNumber">Space Number</Label>
                  <Input
                    id="spaceNumber"
                    value={spaceNumInput}
                    onChange={(e) => {
                      setSpaceNumInput(e.target.value);
                      if (e.target.value.trim()) setUnitLetterInput('');
                    }}
                    placeholder="e.g., 101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitLetter">Unit Letter</Label>
                  <Input
                    id="unitLetter"
                    value={unitLetterInput}
                    onChange={(e) => {
                      setUnitLetterInput(e.target.value);
                      if (e.target.value.trim()) setSpaceNumInput('');
                    }}
                    placeholder="e.g., A"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status}
                  onValueChange={(value: Space['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    {!formData.forSale && (
                      <SelectItem value="Occupied">Occupied</SelectItem>
                    )}
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Month</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#2F6F8F' }}>$</span>
                  <Input id="price" type="number" value={formData.pricePerMonth}
                    onChange={(e) => setFormData({ ...formData, pricePerMonth: Number(e.target.value) })}
                    className="pl-7" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeSize">Home Size</Label>
                <Input id="homeSize" value={formData.homeSize}
                  onChange={(e) => setFormData({ ...formData, homeSize: e.target.value })}
                  placeholder="e.g., 1,200 sqft" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size</Label>
                <Input id="lotSize" value={formData.lotSize}
                  onChange={(e) => setFormData({ ...formData, lotSize: e.target.value })}
                  placeholder="e.g., 40x80" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" min="0" value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" type="number" min="0" step="0.5" value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage">Storage Room</Label>
                <Select value={formData.storage ? 'yes' : 'no'}
                  onValueChange={(value) => setFormData({ ...formData, storage: value === 'yes' })}>
                  <SelectTrigger id="storage"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parkingType">Parking Type</Label>
                <Select value={formData.parkingType}
                  onValueChange={(value: Space['parkingType']) => setFormData({ ...formData, parkingType: value })}>
                  <SelectTrigger id="parkingType"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Street Parking">Street Parking</SelectItem>
                    <SelectItem value="Covered Parking">Covered Parking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parkingSpaces">Number of Parking Spaces (Optional)</Label>
                <Input id="parkingSpaces" type="number" min="0"
                  value={formData.parkingSpaces || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    parkingSpaces: e.target.value ? Number(e.target.value) : undefined,
                  })}
                  placeholder="Leave blank if not applicable" />
              </div>

              {/* Divider */}
              <div className="my-2" style={{ borderTop: '1px solid #D7E3E7' }} />

              <div className="space-y-2">
                <Label htmlFor="aboutHome">About This Home</Label>
                <div className="relative">
                  <Textarea id="aboutHome" value={formData.aboutHome}
                    onChange={(e) => handleAboutHomeChange(e.target.value)}
                    placeholder="Describe the property, its features, and location..."
                    rows={6} className="resize-none pr-16" />
                  <span className="absolute bottom-3 right-3 text-xs" style={{ color: '#2F6F8F' }}>
                    {charCount}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-2" style={{ borderTop: '1px solid #D7E3E7' }} />

              {/* Photos */}
              <div className="space-y-2">
                <Label>Photos</Label>
                {imageOrder.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl py-8"
                    style={{ border: '1.5px dashed #D7E3E7', background: '#E8F6F3' }}
                  >
                    <ImageOff className="w-6 h-6" style={{ color: '#7FD1C2' }} />
                    <p className="text-xs" style={{ color: '#2F6F8F' }}>No photos assigned yet</p>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px]" style={{ color: '#2F6F8F' }}>Drag to reorder</p>
                    <div className="flex flex-wrap gap-2">
                      {imageOrder.map((url, i) => (
                        <div
                          key={url}
                          draggable
                          onDragStart={() => handleDragStart(i)}
                          onDragEnter={() => handleDragEnter(i)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          className="relative w-20 h-20 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none group"
                          style={{ border: '1px solid #D7E3E7' }}
                        >
                          <img src={url} alt={`Photo ${i + 1}`}
                            className="w-full h-full object-cover pointer-events-none" draggable={false} />
                          <span className="absolute top-1 left-1 bg-black/50 text-white text-[10px] rounded px-1 leading-tight">
                            {i + 1}
                          </span>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                            <GripVertical className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6" style={{ borderTop: '1px solid #D7E3E7', background: '#F7FAFB' }}>
              {showCancelConfirm ? (
                <div className="flex-1 flex flex-col gap-2">
                  <p className="text-sm text-center" style={{ color: '#24323A' }}>Discard unsaved changes?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleKeepEditing}
                      className="flex-1 px-4 py-2.5 text-white rounded-xl text-sm transition-colors"
                      style={{ background: '#7FD1C2' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#5FBCAC')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#7FD1C2')}
                    >
                      Keep Editing
                    </button>
                    <button
                      onClick={handleConfirmDiscard}
                      className="btn-cancel flex-1 text-sm"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleCancelClick}
                    className="btn-cancel flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 text-white rounded-xl transition-colors"
                    style={{ background: '#7FD1C2' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#5FBCAC')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#7FD1C2')}
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}