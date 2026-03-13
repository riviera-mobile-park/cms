// localStorageCache.ts
// Client-side localStorage cache for spaces to reduce API calls

import { Space } from '@/data/spaces';

const CACHE_KEY = 'rmhp-spaces-cache';

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Get all cached spaces from localStorage
 */
export function getCachedSpaces(): Space[] | null {
  if (!isBrowser()) return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error('Failed to get cached spaces:', error);
    return null;
  }
}

/**
 * Save entire spaces array to localStorage cache
 */
export function setCachedSpaces(spaces: Space[]): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(spaces));
  } catch (error) {
    console.error('Failed to cache spaces:', error);
  }
}

/**
 * Add a new space to the cache
 */
export function addCachedSpace(space: Space): void {
  if (!isBrowser()) return;

  try {
    const cached = getCachedSpaces() || [];
    const updated = [...cached, space];
    setCachedSpaces(updated);
  } catch (error) {
    console.error('Failed to add cached space:', error);
  }
}

/**
 * Update a single space in the cache
 */
export function updateCachedSpace(space: Space): void {
  if (!isBrowser()) return;

  try {
    const cached = getCachedSpaces() || [];
    const updated = cached.map((s) => (s.id === space.id ? space : s));
    setCachedSpaces(updated);
  } catch (error) {
    console.error('Failed to update cached space:', error);
  }
}

/**
 * Remove a space from the cache
 */
export function deleteCachedSpace(id: string): void {
  if (!isBrowser()) return;

  try {
    const cached = getCachedSpaces() || [];
    const updated = cached.filter((s) => s.id !== id);
    setCachedSpaces(updated);
  } catch (error) {
    console.error('Failed to delete cached space:', error);
  }
}

/**
 * Clear all cached spaces
 */
export function clearCachedSpaces(): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear cached spaces:', error);
  }
}
