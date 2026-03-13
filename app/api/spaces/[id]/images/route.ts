// route.ts (spaces/[id]/images)
// POST endpoint for appending images to a space

import { NextRequest, NextResponse } from 'next/server';
import { appendSpaceImages, StrapiConfigError } from '@/lib/strapi/client';
import { invalidateSpacesCache } from '@/lib/server/upstashCache';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toErrorMessage(error: unknown): string {
  if (error instanceof StrapiConfigError) {
    return `${error.message}. Set placeholder values in .env.local for Strapi.`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown server error';
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = (await request.json()) as { images?: string[] };
    
    if (!Array.isArray(body.images) || body.images.length === 0) {
      return NextResponse.json(
        { error: 'Request body must include a non-empty `images` array.' },
        { status: 400 },
      );
    }

    // Filter out invalid image URLs
    const images = body.images.filter((item) => typeof item === 'string' && item.trim());
    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No valid image values were provided.' },
        { status: 400 },
      );
    }

    const { id } = await params;
    const space = await appendSpaceImages(id, images);
    
    // Invalidate cache after successful image append
    await invalidateSpacesCache();

    return NextResponse.json({ space });
  } catch (error) {
    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}
