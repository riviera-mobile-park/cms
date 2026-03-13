// useSpaces.ts
// Client-side hook for fetching and managing space data

'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Space } from '@/data/spaces';
import { fetchSpaces, patchSpace, type SpaceScope } from '@/lib/client/spacesApi';
import { toErrorMessage } from '@/lib/utils/error';

/**
 * Custom hook for managing spaces data with automatic fetching and mutations.
 * Provides a clean interface for loading and updating space records.
 * 
 * @param scope - Filter scope: 'all', 'for-sale', or 'rmhp-owned'
 * @returns Spaces data, loading state, and update handlers
 */
export function useSpaces(scope: SpaceScope = 'all') {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  // Load spaces on mount
  useEffect(() => {
    const loadSpaces = async () => {
      try {
        setLoading(true);
        const data = await fetchSpaces(scope);
        setSpaces(data);
      } catch (error) {
        toast.error(`Failed to load spaces: ${toErrorMessage(error)}`);
      } finally {
        setLoading(false);
      }
    };

    void loadSpaces();
  }, [scope]);

  /**
   * Update a space with partial data and optimistically update the UI.
   */
  const updateSpace = useCallback(async (updatedSpace: Space) => {
    try {
      const saved = await patchSpace(updatedSpace.id, updatedSpace);
      setSpaces((prev) =>
        prev.map((space) => (space.id === saved.id ? saved : space))
      );
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
  }, []);

  return {
    spaces,
    loading,
    updateSpace,
    setSpace,
  };
}
