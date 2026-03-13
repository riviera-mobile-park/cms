// useSpaces.ts
// Client-side hook for fetching and managing space data with localStorage cache

'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Space } from '@/data/spaces';
import { fetchSpaces, createSpace as apiCreateSpace, patchSpace, type SpaceScope } from '@/lib/client/spacesApi';
import { toErrorMessage } from '@/lib/utils/error';
import {
  getCachedSpaces,
  setCachedSpaces,
  addCachedSpace,
  updateCachedSpace,
} from '@/lib/utils/localStorageCache';

/**
 * Custom hook for managing spaces data with localStorage caching.
 * Loads from cache first (instant), then fetches from API if cache is empty.
 * All mutations update both API and cache to keep them in sync.
 * 
 * @param scope - Filter scope: 'all', 'for-sale', or 'rmhp-owned'
 * @returns Spaces data, loading state, and CRUD handlers
 */
export function useSpaces(scope: SpaceScope = 'all') {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  // Load spaces on mount - try cache first, then API
  useEffect(() => {
    const loadSpaces = async () => {
      try {
        setLoading(true);

        // Try cache first for instant load
        const cached = getCachedSpaces();
        if (cached && cached.length > 0) {
          setSpaces(cached);
          setLoading(false);
          return; // Don't fetch from API if cache exists
        }

        // Cache empty, fetch from API
        const data = await fetchSpaces(scope);
        setSpaces(data);
        setCachedSpaces(data); // Cache the result
      } catch (error) {
        toast.error(`Failed to load spaces: ${toErrorMessage(error)}`);
      } finally {
        setLoading(false);
      }
    };

    void loadSpaces();
  }, [scope]);

  /**
   * Create a new space and update both API and cache.
   */
  const createSpace = useCallback(async (newSpace: Omit<Space, 'id'>) => {
    try {
      const created = await apiCreateSpace(newSpace);
      
      // Update local state
      setSpaces((prev) => [...prev, created]);
      
      // Update cache
      addCachedSpace(created);
      
      toast.success('Space created successfully');
      return created;
    } catch (error) {
      toast.error(`Failed to create space: ${toErrorMessage(error)}`);
      throw error;
    }
  }, []);

  /**
   * Update a space with partial data and sync with cache.
   */
  const updateSpace = useCallback(async (updatedSpace: Space) => {
    try {
      const saved = await patchSpace(updatedSpace.id, updatedSpace);
      
      // Update local state
      setSpaces((prev) =>
        prev.map((space) => (space.id === saved.id ? saved : space))
      );
      
      // Update cache
      updateCachedSpace(saved);
      
      toast.success('Space updated successfully');
      return saved;
    } catch (error) {
      toast.error(`Failed to update space: ${toErrorMessage(error)}`);
      throw error;
    }
  }, []);

  /**
   * Manually update a specific space in the local state without API call.
   * Useful when the API call is handled elsewhere (e.g., image uploads).
   */
  const setSpace = useCallback((spaceId: string, updatedSpace: Space) => {
    setSpaces((prev) =>
      prev.map((space) => (space.id === spaceId ? updatedSpace : space))
    );
    updateCachedSpace(updatedSpace);
  }, []);

  return {
    spaces,
    loading,
    createSpace,
    updateSpace,
    setSpace,
  };
}
