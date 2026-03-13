// route.ts (images/presign)
// POST endpoint for generating S3 presigned URLs

import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_SIGNER_URL = 'https://your-upload-signer.example.com/presign';

interface PresignRequestBody {
  filename?: string;
  contentType?: string;
  keyPrefix?: string;
}

interface PresignResponseBody {
  uploadUrl?: string;
  imageKey?: string;
  key?: string;
  publicUrl?: string;
  url?: string;
  error?: string;
  method?: string;
  headers?: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getSignerConfig() {
  const signerUrl = process.env.UPLOAD_SIGNER_URL?.trim() || DEFAULT_SIGNER_URL;
  const signerToken = process.env.UPLOAD_SIGNER_TOKEN?.trim();

  return {
    signerUrl,
    signerToken,
    isPlaceholder: signerUrl.includes('your-upload-signer.example.com'),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const { signerUrl, signerToken, isPlaceholder } = getSignerConfig();

  // Check if signer URL is configured
  if (isPlaceholder) {
    return NextResponse.json(
      {
        error:
          'UPLOAD_SIGNER_URL is still a placeholder. Point it to your S3/R2 presign service.',
      },
      { status: 501 },
    );
  }

  const body = (await request.json()) as PresignRequestBody;
  if (!body.filename) {
    return NextResponse.json(
      { error: 'Missing `filename` in request body.' },
      { status: 400 },
    );
  }

  // Build request to external signer service
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (signerToken) {
    headers.set('Authorization', `Bearer ${signerToken}`);
  }

  const signerResponse = await fetch(signerUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      filename: body.filename,
      contentType: body.contentType,
      keyPrefix: body.keyPrefix,
    }),
    cache: 'no-store',
  });

  const text = await signerResponse.text();
  let payload: PresignResponseBody = {};

  try {
    payload = JSON.parse(text) as PresignResponseBody;
  } catch {
    payload = {};
  }

  // Handle signer service errors
  if (!signerResponse.ok) {
    return NextResponse.json(
      {
        error:
          payload?.error ||
          text ||
          `Signer request failed (${signerResponse.status}).`,
      },
      { status: signerResponse.status },
    );
  }

  // Validate required fields in response
  const uploadUrl = payload.uploadUrl;
  const imageKey = payload.imageKey || payload.key;
  if (!uploadUrl || !imageKey) {
    return NextResponse.json(
      {
        error:
          'Signer response must include `uploadUrl` and `imageKey` (or `key`).',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    uploadUrl,
    imageKey,
    publicUrl: payload.publicUrl || payload.url || imageKey,
    method: payload.method || 'PUT',
    headers: payload.headers || {},
  });
}
