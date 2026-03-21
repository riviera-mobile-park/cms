'use client';

import { useState } from 'react';
import { Space } from '@/data/spaces';
import { SpaceTable } from '@/components/SpaceTable';
import { EditSpaceModal } from '@/components/EditSpaceModal';
import { SpacePreviewModal } from '@/components/SpacePreviewModal';

interface HomesForSaleProps {
  spaces: Space[];
  onUpdateSpace: (space: Space) => void;
}

export function HomesForSale({ spaces, onUpdateSpace }: HomesForSaleProps) {
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [previewingSpace, setPreviewingSpace] = useState<Space | null>(null);

  const forSaleSpaces = spaces.filter((space) => space.forSale && !space.byRmhp);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="heading text-3xl mb-1 text-foreground">Homes for Sale</h1>
        <p className="text-sm text-secondary">
          All mobile home spaces currently available for purchase
        </p>
      </div>

      {forSaleSpaces.length === 0 ? (
        <div className="bg-card rounded-xl p-8 text-center border border-border shadow-md">
          <p className="text-base text-secondary">No homes currently for sale</p>
          <p className="text-sm mt-1 text-secondary">
            Check "For Sale" and leave "RMHP" unchecked in Spaces to list homes here
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-md">
          <SpaceTable
            spaces={forSaleSpaces}
            onEdit={setEditingSpace}
            onPreview={setPreviewingSpace}
            showCheckboxes={false}
          />
        </div>
      )}

      <EditSpaceModal
        space={editingSpace}
        isOpen={!!editingSpace}
        onClose={() => setEditingSpace(null)}
        onSave={onUpdateSpace}
      />

      <SpacePreviewModal
        space={previewingSpace}
        isOpen={!!previewingSpace}
        onClose={() => setPreviewingSpace(null)}
      />
    </div>
  );
}