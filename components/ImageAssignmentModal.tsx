// ImageAssignmentModal.tsx
// Assign uploaded images to spaces by number or unit letter

'use client';

import { useState, useMemo } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Space } from '@/data/spaces';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageAssignmentModalProps {
  images: File[];
  spaces: Space[];
  isOpen: boolean;
  onClose: () => void;
  onFinish: (spaceId: string, images: File[]) => Promise<void> | void;
}

export function ImageAssignmentModal({
  images,
  spaces,
  isOpen,
  onClose,
  onFinish,
}: ImageAssignmentModalProps) {
  const [spaceNum, setSpaceNum] = useState('');
  const [unitLetter, setUnitLetter] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewUrls = useMemo(
    () => images.map((f) => URL.createObjectURL(f)),
    [images]
  );

  const isDirty = spaceNum.trim() !== '' || unitLetter.trim() !== '';

  const handleClose = () => {
    if (isSubmitting) return;

    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      reset();
      onClose();
    }
  };

  const reset = () => {
    setSpaceNum('');
    setUnitLetter('');
    setError('');
    setShowCancelConfirm(false);
  };

  const handleConfirmDiscard = () => { reset(); onClose(); };
  const handleKeepEditing = () => setShowCancelConfirm(false);

  const findMatchingSpace = (): Space | undefined => {
    const num = spaceNum.trim();
    const unit = unitLetter.trim().toUpperCase();
    return spaces.find((s) => {
      if (num) {
        if (s.spaceNumber === num) return true;
        if (s.spaceNumber.replace(/\D/g, '') === num) return true;
      }
      if (unit) {
        if (s.spaceNumber.toUpperCase() === `UNIT ${unit}`) return true;
        if (s.spaceNumber.toUpperCase() === unit) return true;
      }
      return false;
    });
  };

  const handleSave = async () => {
    if (!spaceNum.trim() && !unitLetter.trim()) {
      setError('Enter a space number or unit letter.');
      return;
    }
    const matched = findMatchingSpace();
    if (!matched) {
      const label = spaceNum.trim() ? `Space ${spaceNum.trim()}` : `Unit ${unitLetter.trim().toUpperCase()}`;
      setError(`No space found for "${label}". Check the number or letter and try again.`);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onFinish(matched.id, images);
      reset();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 lg:top-1/2 lg:-translate-y-1/2 left-0 right-0 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl z-50 max-h-[90vh] lg:max-h-[85vh] overflow-hidden flex flex-col w-full lg:w-[520px]"
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
              <div>
                <h2 className="heading text-xl" style={{ color: '#24323A' }}>Assign Photos</h2>
                <p className="text-xs mt-0.5" style={{ color: '#2F6F8F' }}>
                  {images.length} photo{images.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: '#2F6F8F' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#E8F6F3')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Thumbnail grid */}
              <div>
                <p className="text-xs mb-2" style={{ color: '#2F6F8F' }}>Photos to upload</p>
                <div className="flex flex-wrap gap-2">
                  {previewUrls.map((url, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative"
                      style={{ border: '1px solid #D7E3E7' }}
                    >
                      <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0.5 right-1 text-[9px] text-white/80 leading-tight">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Space identification */}
              <div className="space-y-3">
                <p className="text-sm" style={{ color: '#24323A' }}>
                  Which space are these photos for?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="assign-space-num">Space #</Label>
                    <Input
                      id="assign-space-num"
                      value={spaceNum}
                      onChange={(e) => {
                        setSpaceNum(e.target.value);
                        setError('');
                        if (e.target.value.trim()) setUnitLetter('');
                      }}
                      placeholder="e.g. 101"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="assign-unit">Unit Letter</Label>
                    <Input
                      id="assign-unit"
                      value={unitLetter}
                      onChange={(e) => {
                        setUnitLetter(e.target.value);
                        setError('');
                        if (e.target.value.trim()) setSpaceNum('');
                      }}
                      placeholder="e.g. A"
                    />
                  </div>
                </div>
                <p className="text-[10px]" style={{ color: '#2F6F8F' }}>Fill in one — whichever applies to this home.</p>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5" style={{ borderTop: '1px solid #D7E3E7', background: '#F7FAFB' }}>
              {showCancelConfirm ? (
                <div className="flex-1 flex flex-col gap-2">
                  <p className="text-sm text-center" style={{ color: '#24323A' }}>Discard unsaved changes?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleKeepEditing}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2.5 text-white rounded-xl text-sm transition-colors"
                      style={{ background: '#7FD1C2' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#5FBCAC')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#7FD1C2')}
                    >
                      Keep Editing
                    </button>
                    <button
                      onClick={handleConfirmDiscard}
                      disabled={isSubmitting}
                      className="btn-cancel flex-1 text-sm"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="btn-cancel flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 text-white rounded-xl transition-colors"
                    style={{ background: '#7FD1C2' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#5FBCAC')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#7FD1C2')}
                  >
                    {isSubmitting ? 'Uploading...' : 'Save Photos'}
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
