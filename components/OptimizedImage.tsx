// OptimizedImage.tsx
// Next.js Image wrapper with CloudFront CDN loader

import Image, { type ImageLoader, type ImageProps } from 'next/image';
import { getImageUrl } from '@/lib/images/getImageUrl';

const DEFAULT_SIZES = '(max-width: 640px) 480px, (max-width: 1024px) 768px, (max-width: 1440px) 1200px, 1600px';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt' | 'loader'> {
  imageKey: string;
  alt: string;
}

const cloudFrontLoader: ImageLoader = ({ src, width }) => getImageUrl(src, width);

export function OptimizedImage({
  imageKey,
  alt,
  sizes = DEFAULT_SIZES,
  width = 1600,
  height = 900,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      {...props}
      src={imageKey}
      alt={alt}
      loader={cloudFrontLoader}
      sizes={sizes}
      width={width}
      height={height}
    />
  );
}
