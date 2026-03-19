// route.ts (spaces)
// GET and POST endpoints for fetching and creating spaces

import { NextRequest, NextResponse } from 'next/server';
import { getSpaces, createSpace, SpaceScope, StrapiConfigError } from '@/lib/strapi/client';
import { Space, mockSpaces } from '@/data/spaces';
import {
  getCachedSpaces,
  isUpstashCacheConfigured,
  setCachedSpaces,
  invalidateSpacesCache,
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

/**
 * Filter mock spaces based on scope.
 */
function filterMockSpaces(scope: SpaceScope): Space[] {
  if (scope === 'all') {
    return mockSpaces;
  }
  if (scope === 'for-sale') {
    return mockSpaces.filter((s) => s.forSale);
  }
  if (scope === 'rmhp-owned') {
    return mockSpaces.filter((s) => s.forSale && s.byRmhp);
  }
  return mockSpaces;
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
    // Fallback to mock spaces if Strapi is not configured or fails
    console.warn('Strapi unavailable, using mock data:', toErrorMessage(error));
    const spaces = filterMockSpaces(scope);
    return NextResponse.json(
      { spaces, mock: true },
      { headers: { 'x-data-source': 'mock' } },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { space } = body as { space: Omit<Space, 'id'> };

    if (!space) {
      return NextResponse.json({ error: 'Missing space data' }, { status: 400 });
    }

    // Create space in Strapi
    const created = await createSpace(space);

    // Invalidate cache if Upstash is configured
    if (isUpstashCacheConfigured()) {
      await invalidateSpacesCache();
    }

    return NextResponse.json({ space: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}
