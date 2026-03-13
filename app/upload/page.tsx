// page.tsx (upload)
// Image upload page - uploads to S3 and assigns to spaces

'use client';

import { Upload } from '@/components/pages/Upload';
import { useSpaces } from '@/lib/hooks/useSpaces';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/aws/uploadImage';
import { appendSpaceImages } from '@/lib/client/spacesApi';
import { toErrorMessage } from '@/lib/utils/error';

export default function UploadPage() {
  const { spaces, setSpace } = useSpaces('all');

  const handleImagesAssigned = async (spaceId: string, images: File[]) => {
    try {
      const uploaded = await Promise.all(
        images.map((file) => uploadImage({ file, keyPrefix: 'spaces' })),
      );

      const imageUrls = uploaded.map((item) => item.imageUrl);
      const updated = await appendSpaceImages(spaceId, imageUrls);

      setSpace(spaceId, updated);

      const label = updated.spaceNumber || 'the space';
      toast.success(
        `Added ${images.length} photo${images.length !== 1 ? 's' : ''} to ${label}`,
      );
    } catch (error) {
      const message = toErrorMessage(error);
      toast.error(`Upload failed: ${message}`);
      throw error;
    }
  };

  return <Upload spaces={spaces} onImagesAssigned={handleImagesAssigned} />;
}
