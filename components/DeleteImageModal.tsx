// DeleteImageModal.tsx
// Confirmation modal for deleting images - requires typing "delete"

'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '@/components/ui/input';

interface DeleteImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteImageModal({ isOpen, onClose, onConfirm }: DeleteImageModalProps) {
  const [inputValue, setInputValue] = useState('');

  // Reset input when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (inputValue.toLowerCase() === 'delete') {
      onConfirm();
      setInputValue('');
    }
  };

  const isDeleteEnabled = inputValue.toLowerCase() === 'delete';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              style={{ border: '1px solid #D7E3E7' }}
            >
              {/* Header */}
              <div className="p-6 border-b" style={{ borderColor: '#D7E3E7' }}>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#FEE2E2' }}
                  >
                    <AlertCircle className="w-5 h-5" style={{ color: '#d4183d' }} />
                  </div>
                  <div>
                    <h2 className="heading text-xl" style={{ color: '#24323A' }}>
                      Confirm Deletion
                    </h2>
                    <p className="text-sm mt-1" style={{ color: '#2F6F8F' }}>
                      Type 'delete' to permanently remove this image
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type 'delete' to confirm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isDeleteEnabled) {
                      handleConfirm();
                    }
                  }}
                />
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t" style={{ borderColor: '#D7E3E7', background: '#F7FAFB' }}>
                <button
                  onClick={onClose}
                  className="btn-cancel flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!isDeleteEnabled}
                  className="btn-delete flex-1"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
