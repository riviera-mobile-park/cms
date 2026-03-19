'use client';

import { useState } from 'react';
import { Space } from '@/data/spaces';
import { SpaceCard } from '@/components/SpaceCard';
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
        <h1 className="heading text-3xl mb-1" style={{ color: '#24323A' }}>Homes for Sale</h1>
        <p className="text-sm" style={{ color: '#2F6F8F' }}>
          All mobile home spaces currently available for purchase
        </p>
      </div>

      {forSaleSpaces.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center" style={{ border: '1px solid #D7E3E7', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
          <p className="text-base" style={{ color: '#2F6F8F' }}>No homes currently for sale</p>
          <p className="text-sm mt-1" style={{ color: '#2F6F8F' }}>
            Check "For Sale" and leave "RMHP" unchecked in Spaces to list homes here
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #D7E3E7', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
            <SpaceTable
              spaces={forSaleSpaces}
              onEdit={setEditingSpace}
              onPreview={setPreviewingSpace}
              showCheckboxes={false}
            />
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-2">
            {forSaleSpaces.map((space) => (
              <SpaceCard
                key={space.id}
                space={space}
                onEdit={setEditingSpace}
                onPreview={setPreviewingSpace}
                showCheckboxes={false}
              />
            ))}
          </div>
        </>
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