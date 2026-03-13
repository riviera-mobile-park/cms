// getImageUrl.ts
// Generate CloudFront URLs with optional width params

export const SUPPORTED_IMAGE_WIDTHS = [480, 768, 1200, 1600] as const;

export type SupportedImageWidth = (typeof SUPPORTED_IMAGE_WIDTHS)[number];

const DEFAULT_CLOUDFRONT_DOMAIN = 'your-cloudfront-domain.cloudfront.net';

function getCloudFrontDomain(): string {
  const domain = process.env.CLOUDFRONT_DOMAIN?.trim() || DEFAULT_CLOUDFRONT_DOMAIN;
  return domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export function getImageUrl(imageKey: string, width?: number): string {
  const normalizedKey = imageKey.replace(/^\/+/, '');
  const url = new URL(`https://${getCloudFrontDomain()}/${normalizedKey}`);

  if (width) {
    url.searchParams.set('width', String(Math.round(width)));
  }

  return url.toString();
}
