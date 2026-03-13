// page.tsx (spaces)
// All spaces management view

'use client';

import { Spaces } from '@/components/pages/Spaces';
import { useSpaces } from '@/lib/hooks/useSpaces';
import { Space } from '@/data/spaces';
import { patchSpace } from '@/lib/client/spacesApi';
import { toast } from 'sonner';
import { toErrorMessage } from '@/lib/utils/error';

export default function SpacesPage() {
  const { spaces, createSpace, updateSpace, setSpace } = useSpaces('all');

  const handleSaveSpace = async (space: Space) => {
    // Check if it's a new space (temp ID) or existing space
    const isNewSpace = space.id.startsWith('local-') || space.id.startsWith('temp-');
    
    if (isNewSpace) {
      // Remove the temp ID before creating
      const { id, ...spaceWithoutId } = space;
      await createSpace(spaceWithoutId);
    } else {
      await updateSpace(space);
    }
  };

  const handleToggleForSale = async (id: string, value: boolean) => {
    const current = spaces.find((space) => space.id === id);
    if (!current) return;

    const patch: Partial<Space> = {
      forSale: value,
      byRmhp: value ? current.byRmhp : false,
    };

    try {
      const saved = await patchSpace(id, patch);
      setSpace(id, saved);
    } catch (error) {
      toast.error(`Failed to update For Sale: ${toErrorMessage(error)}`);
    }
  };

  const handleToggleByRmhp = async (id: string, value: boolean) => {
    try {
      const saved = await patchSpace(id, { byRmhp: value });
      setSpace(id, saved);
    } catch (error) {
      toast.error(`Failed to update RMHP flag: ${toErrorMessage(error)}`);
    }
  };

  return (
    <Spaces
      spaces={spaces}
      onSaveSpace={handleSaveSpace}
      onToggleForSale={handleToggleForSale}
      onToggleByRmhp={handleToggleByRmhp}
    />
  );
}
