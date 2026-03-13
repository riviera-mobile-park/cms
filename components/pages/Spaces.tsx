// Spaces.tsx
// Main page for viewing and managing all spaces

'use client';

import { useState } from 'react';
import { Space } from '@/data/spaces';
import { SpaceCard } from '@/components/SpaceCard';
import { SpaceTable } from '@/components/SpaceTable';
import { EditSpaceModal } from '@/components/EditSpaceModal';
import { SpacePreviewModal } from '@/components/SpacePreviewModal';

interface SpacesProps {
  spaces: Space[];
  onUpdateSpace: (space: Space) => void;
  onToggleForSale: (id: string, value: boolean) => void;
  onToggleByRmhp: (id: string, value: boolean) => void;
}

export function Spaces({ spaces, onUpdateSpace, onToggleForSale, onToggleByRmhp }: SpacesProps) {
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [previewingSpace, setPreviewingSpace] = useState<Space | null>(null);

  // Sort spaces by number/letter
  const sortedSpaces = [...spaces].sort((a, b) => {
    // Extract numbers from space identifiers
    const aNum = parseInt(a.spaceNumber.replace(/\D/g, '')) || a.spaceNumber.charCodeAt(0);
    const bNum = parseInt(b.spaceNumber.replace(/\D/g, '')) || b.spaceNumber.charCodeAt(0);
    return aNum - bNum;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="heading text-3xl mb-1" style={{ color: '#24323A' }}>All Spaces</h1>
        <p className="text-sm" style={{ color: '#2F6F8F' }}>
          Manage all mobile home spaces at Riviera Mobile Home Park
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #D7E3E7', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
        <SpaceTable
          spaces={sortedSpaces}
          onEdit={setEditingSpace}
          onPreview={setPreviewingSpace}
          onToggleForSale={onToggleForSale}
          onToggleByRmhp={onToggleByRmhp}
          showCheckboxes
        />
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-2">
        {sortedSpaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            onEdit={setEditingSpace}
            onPreview={setPreviewingSpace}
            onToggleForSale={onToggleForSale}
            onToggleByRmhp={onToggleByRmhp}
            showCheckboxes
          />
        ))}
      </div>

      {/* Edit Modal */}
      <EditSpaceModal
        space={editingSpace}
        isOpen={!!editingSpace}
        onClose={() => setEditingSpace(null)}
        onSave={onUpdateSpace}
      />

      {/* Preview Modal */}
      <SpacePreviewModal
        space={previewingSpace}
        isOpen={!!previewingSpace}
        onClose={() => setPreviewingSpace(null)}
      />
    </div>
  );
}