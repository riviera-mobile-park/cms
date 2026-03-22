// OurHomes.tsx
// Filtered view showing RMHP-owned homes for sale

'use client';

import { useState } from 'react';
import { Space } from '@/data/spaces';
import { SpaceTable } from '@/components/SpaceTable';
import { EditSpaceModal } from '@/components/EditSpaceModal';
import { SpacePreviewModal } from '@/components/SpacePreviewModal';
import { CardHeader } from '@/components/ui/dashboard-cards';

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
        <div className="bg-card rounded-xl overflow-hidden border border-border shadow-md">
          <CardHeader title="Our Homes for Sale" badge={ourHomes.length} />
          <SpaceTable
            spaces={ourHomes}
            onEdit={setEditingSpace}
            onPreview={setPreviewingSpace}
            showCheckboxes={false}
            showRmhpBadge={false}
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