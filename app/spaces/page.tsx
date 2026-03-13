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
  const { spaces, updateSpace, setSpace } = useSpaces('all');

  const handleUpdateSpace = async (updatedSpace: Space) => {
    await updateSpace(updatedSpace);
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
      onUpdateSpace={handleUpdateSpace}
      onToggleForSale={handleToggleForSale}
      onToggleByRmhp={handleToggleByRmhp}
    />
  );
}
