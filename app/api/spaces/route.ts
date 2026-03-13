// route.ts (spaces)
// GET endpoint for fetching spaces with optional caching

import { NextRequest, NextResponse } from 'next/server';
import { getSpaces, SpaceScope, StrapiConfigError } from '@/lib/strapi/client';
import {
  getCachedSpaces,
  isUpstashCacheConfigured,
  setCachedSpaces,
} from '@/lib/server/upstashCache';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function parseScope(value: string | null): SpaceScope {
  if (value === 'for-sale' || value === 'rmhp-owned') {
    return value;
  }
  return 'all';
}

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

export async function GET(request: NextRequest) {
  const scope = parseScope(request.nextUrl.searchParams.get('scope'));

  try {
    // Try cache first if Upstash is configured
    if (isUpstashCacheConfigured()) {
      const cached = await getCachedSpaces(scope);
      if (cached) {
        return NextResponse.json(
          { spaces: cached, cached: true },
          { headers: { 'x-cache': 'HIT' } },
        );
      }
    }

    // Fetch from Strapi and cache result
    const spaces = await getSpaces(scope);
    await setCachedSpaces(scope, spaces);

    return NextResponse.json(
      { spaces, cached: false },
      { headers: { 'x-cache': 'MISS' } },
    );
  } catch (error) {
    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}
