// route.ts (spaces/[id])
// PATCH endpoint for updating individual spaces

import { NextRequest, NextResponse } from 'next/server';
import { StrapiConfigError, updateSpace } from '@/lib/strapi/client';
import { Space } from '@/data/spaces';
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = (await request.json()) as { space?: Partial<Space> };
    
    if (!body.space || typeof body.space !== 'object') {
      return NextResponse.json(
        { error: 'Request body must include a `space` object.' },
        { status: 400 },
      );
    }

    const { id } = await params;
    const space = await updateSpace(id, body.space);
    
    // Invalidate cache to ensure fresh data on next fetch
    await invalidateSpacesCache();

    return NextResponse.json({ space });
  } catch (error) {
    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}
