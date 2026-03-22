// Spaces.tsx
// Main page for viewing and managing all spaces

'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Space } from '@/data/spaces';
import { SpaceTable } from '@/components/SpaceTable';
import { EditSpaceModal } from '@/components/EditSpaceModal';
import { SpacePreviewModal } from '@/components/SpacePreviewModal';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/dashboard-cards';

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
          <h1 className="heading text-3xl mb-1 text-foreground">All Spaces</h1>
          <p className="text-sm text-secondary">
            Manage all mobile home spaces at Riviera Mobile Home Park
          </p>
        </div>
        <Button onClick={handleAddHome} className="gap-2 bg-secondary">
          <Plus className="h-4 w-4" />
          Add Home
        </Button>
      </div>

      {/* Table View */}
      <div className="bg-card rounded-xl overflow-hidden border border-border shadow-md">
        <CardHeader title="All Spaces" badge={sortedSpaces.length} />
        <SpaceTable
          spaces={sortedSpaces}
          onEdit={setEditingSpace}
          onPreview={setPreviewingSpace}
          onToggleForSale={onToggleForSale}
          onToggleByRmhp={onToggleByRmhp}
          showCheckboxes
        />
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