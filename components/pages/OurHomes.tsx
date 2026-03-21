// OurHomes.tsx
// Filtered view showing RMHP-owned homes for sale

'use client';

import { useState } from 'react';
import { Space } from '@/data/spaces';
import { SpaceTable } from '@/components/SpaceTable';
import { EditSpaceModal } from '@/components/EditSpaceModal';
import { SpacePreviewModal } from '@/components/SpacePreviewModal';

interface OurHomesProps {
  spaces: Space[];
  onUpdateSpace: (space: Space) => void;
}

export function OurHomes({ spaces, onUpdateSpace }: OurHomesProps) {
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [previewingSpace, setPreviewingSpace] = useState<Space | null>(null);

  const ourHomes = spaces.filter((space) => space.forSale && space.byRmhp);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="heading text-3xl mb-1 text-foreground">Our Homes for Sale</h1>
        <p className="text-sm text-secondary">
          Mobile homes owned and sold directly by Riviera Mobile Home Park
        </p>
      </div>

      {ourHomes.length === 0 ? (
        <div className="bg-card rounded-xl p-8 text-center border border-border shadow-md">
          <p className="text-base text-secondary">No RMHP-owned homes currently for sale</p>
          <p className="text-sm mt-1 text-secondary">
            Check both "For Sale" and "RMHP" in the Spaces section to list homes here
          </p>
        </div>
      ) : (
<<<<<<< HEAD
        <>
          {/* Table View */}
          <div className="bg-white rounded-xl" style={{ border: '1px solid #D7E3E7', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <SpaceTable
              spaces={ourHomes}
              onEdit={setEditingSpace}
              onPreview={setPreviewingSpace}
              showCheckboxes={false}
              showRmhpBadge={false}
            />
          </div>

          {/* Mobile Card View - only for xs screens */}
          <div className="md:hidden space-y-2">
            {ourHomes.map((space) => (
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
=======
        <div className="bg-card rounded-xl overflow-hidden border border-border shadow-md">
          <SpaceTable
            spaces={ourHomes}
            onEdit={setEditingSpace}
            onPreview={setPreviewingSpace}
            showCheckboxes={false}
            showRmhpBadge={false}
          />
        </div>
>>>>>>> e5f8df0881d8fac0010d7a8ae508087201a2d75c
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