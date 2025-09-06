import { useState, useMemo } from 'react';
import type { Repository } from '@/types/share';
import { filterRepositories, sortRepositories, getUniqueLanguages } from '@/utils/share/helpers';

/**
 * Custom hook for managing repository search, filtering, and sorting
 * @param repositories - Array of repositories to search through
 * @returns Search state and setter functions
 */
export function useRepositorySearch(repositories: Repository[]) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'size'>('updated');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  /**
   * Computed filtered and sorted repositories
   * Only returns results if there's a search query (search-first UX)
   */
  const filteredAndSortedRepositories = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const filtered = filterRepositories(repositories, searchQuery, languageFilter);
    const sorted = sortRepositories(filtered, sortBy);

    return sorted;
  }, [repositories, searchQuery, sortBy, languageFilter]);

  /**
   * Available languages for filtering
   */
  const availableLanguages = useMemo(() => {
    return getUniqueLanguages(repositories);
  }, [repositories]);

  /**
   * Whether user has entered a search query
   */
  const hasSearchQuery = searchQuery.trim().length > 0;

  /**
   * Clear all search filters
   */
  const clearSearch = () => {
    setSearchQuery('');
    setLanguageFilter('all');
    setSortBy('updated');
  };

  return {
    searchQuery,
    sortBy,
    languageFilter,
    hasSearchQuery,
    filteredRepositories: filteredAndSortedRepositories,
    availableLanguages,
    setSearchQuery,
    setSortBy,
    setLanguageFilter,
    clearSearch,
  } as const;
}
