// uploadImage.ts
// Browser-to-S3 upload using presigned URLs

interface PresignApiResponse {
  uploadUrl?: string;
  imageKey?: string;
  publicUrl?: string;
  method?: string;
  headers?: Record<string, string>;
}

export interface UploadImageOptions {
  file: File;
  endpoint?: string;
  keyPrefix?: string;
}

export interface UploadImageResult {
  imageKey: string;
  imageUrl: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upload an image file directly to cloud storage using a pre-signed URL.
 * 
 * Process:
 * 1. Request a presigned URL from the API endpoint
 * 2. Upload file bytes directly to S3/R2 using the presigned URL
 * 3. Return the object key and public URL for storage in Strapi
 * 
 * @param options - Upload configuration
 * @returns Image key and public URL
 */
export async function uploadImage({
  file,
  endpoint = '/api/images/presign',
  keyPrefix = 'images',
}: UploadImageOptions): Promise<UploadImageResult> {
  // Step 1: Request presigned URL
  const presignResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      keyPrefix,
    }),
  });

  if (!presignResponse.ok) {
    const details = await presignResponse.text();
    throw new Error(details || `Presign request failed with status ${presignResponse.status}`);
  }

  const payload = (await presignResponse.json()) as PresignApiResponse;
  if (!payload.uploadUrl || !payload.imageKey) {
    throw new Error('Presign API did not return uploadUrl and imageKey');
  }

  // Step 2: Upload file to S3 using presigned URL
  const method = (payload.method || 'PUT').toUpperCase();
  const uploadHeaders = new Headers(payload.headers || {});

  if (!uploadHeaders.has('Content-Type')) {
    uploadHeaders.set('Content-Type', file.type || 'application/octet-stream');
  }

  const uploadResponse = await fetch(payload.uploadUrl, {
    method,
    headers: uploadHeaders,
    body: file,
  });

  if (!uploadResponse.ok) {
    const details = await uploadResponse.text();
    throw new Error(details || `Direct upload failed with status ${uploadResponse.status}`);
  }

  // Step 3: Return image metadata
  return {
    imageKey: payload.imageKey,
    imageUrl: payload.publicUrl || payload.imageKey,
  };
}
