// spacesApi.ts
// Client-side API functions for space CRUD operations

import { Space } from '@/data/spaces';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SpaceScope = 'all' | 'for-sale' | 'rmhp-owned';

interface SpacesResponse {
  spaces: Space[];
}

interface SpaceResponse {
  space: Space;
}

interface ApiErrorResponse {
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse API response and extract data or throw error with meaningful message.
 */
async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  let message = `Request failed with status ${response.status}`;

  try {
    const payload = (await response.json()) as ApiErrorResponse;
    if (payload.error) {
      message = payload.error;
    }
  } catch {
    // Keep default message when response is not JSON
  }

  throw new Error(message);
}

// ─────────────────────────────────────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch spaces from the API with optional filtering.
 * @param scope - Filter: 'all', 'for-sale', or 'rmhp-owned'
 * @returns Array of space records
 */
export async function fetchSpaces(scope: SpaceScope = 'all'): Promise<Space[]> {
  const response = await fetch(`/api/spaces?scope=${scope}`, {
    cache: 'no-store',
  });

  const payload = await parseResponse<SpacesResponse>(response);
  return payload.spaces;
}

/**
 * Update a space with partial data.
 * @param id - Space ID
 * @param space - Partial space data to update
 * @returns Updated space record
 */
export async function patchSpace(
  id: string,
  space: Partial<Space>,
): Promise<Space> {
  const response = await fetch(`/api/spaces/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ space }),
  });

  const payload = await parseResponse<SpaceResponse>(response);
  return payload.space;
}

/**
 * Append image URLs to a space's existing images array.
 * @param id - Space ID
 * @param images - Array of image URLs to append
 * @returns Updated space record with new images
 */
export async function appendSpaceImages(
  id: string,
  images: string[],
): Promise<Space> {
  const response = await fetch(
    `/api/spaces/${encodeURIComponent(id)}/images`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ images }),
    },
  );

  const payload = await parseResponse<SpaceResponse>(response);
  return payload.space;
}
