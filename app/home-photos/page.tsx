// page.tsx (home-photos)
// Home photos management page - view and delete space images

'use client';

import { HomePhotosSection } from '@/components/HomePhotosSection';
import { useSpaces } from '@/lib/hooks/useSpaces';
import { toast } from 'sonner';
import { removeSpaceImage } from '@/lib/client/spacesApi';
import { toErrorMessage } from '@/lib/utils/error';

export default function HomePhotosPage() {
  const { spaces, setSpace } = useSpaces('all');

  const handleDeleteImage = async (spaceId: string, imageUrl: string) => {
    try {
      const updated = await removeSpaceImage(spaceId, imageUrl);
      setSpace(spaceId, updated);
      toast.success('Image deleted successfully');
    } catch (err) {
      const msg = toErrorMessage(err);
      toast.error(`Failed to delete image: ${msg}`);
    }
  };

  return <HomePhotosSection spaces={spaces} onDeleteImage={handleDeleteImage} />;
}
