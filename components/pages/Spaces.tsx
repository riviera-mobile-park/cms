// Spaces.tsx
// Main page for viewing and managing all spaces

'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Space } from '@/data/spaces';
import { SpaceCard } from '@/components/SpaceCard';
import { SpaceTable } from '@/components/SpaceTable';
import { EditSpaceModal } from '@/components/EditSpaceModal';
import { SpacePreviewModal } from '@/components/SpacePreviewModal';
import { Button } from '@/components/ui/button';

interface SpacesProps {
  spaces: Space[];
  onSaveSpace: (space: Space) => void;
  onToggleForSale: (id: string, value: boolean) => void;
  onToggleByRmhp: (id: string, value: boolean) => void;
}

export function Spaces({ spaces, onSaveSpace, onToggleForSale, onToggleByRmhp }: SpacesProps) {
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [previewingSpace, setPreviewingSpace] = useState<Space | null>(null);

  // Sort spaces by number/letter
  const sortedSpaces = [...spaces].sort((a, b) => {
    // Extract numbers from space identifiers
    const aNum = parseInt(a.spaceNumber.replace(/\D/g, '')) || a.spaceNumber.charCodeAt(0);
    const bNum = parseInt(b.spaceNumber.replace(/\D/g, '')) || b.spaceNumber.charCodeAt(0);
    return aNum - bNum;
  });

  const handleAddHome = () => {
    // Create a new empty space
    const newSpace: Space = {
      id: `temp-${Date.now()}`,
      spaceNumber: '',
      status: 'Available',
      lotSize: '',
      homeSize: '',
      pricePerMonth: 0,
      salePrice: undefined,
      bedrooms: 0,
      bathrooms: 0,
      storage: false,
      parkingType: 'Street Parking',
      parkingSpaces: undefined,
      aboutHome: '',
      forSale: false,
      byRmhp: false,
      images: [],
    };
    setEditingSpace(newSpace);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="heading text-3xl mb-1" style={{ color: '#24323A' }}>All Spaces</h1>
          <p className="text-sm" style={{ color: '#2F6F8F' }}>
            Manage all mobile home spaces at Riviera Mobile Home Park
          </p>
        </div>
        <Button 
          onClick={handleAddHome}
          className="gap-2"
          style={{ background: '#2F6F8F' }}
        >
          <Plus className="h-4 w-4" />
          Add Home
        </Button>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-xl" style={{ border: '1px solid #D7E3E7', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <SpaceTable
          spaces={sortedSpaces}
          onEdit={setEditingSpace}
          onPreview={setPreviewingSpace}
          onToggleForSale={onToggleForSale}
          onToggleByRmhp={onToggleByRmhp}
          showCheckboxes
        />
      </div>

      {/* Mobile Card View - only for xs screens */}
      <div className="md:hidden space-y-2">
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
        onSave={onSaveSpace}
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