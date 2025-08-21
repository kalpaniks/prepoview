/**
 * Custom hook for managing repository shares and analytics
 * @fileoverview Handles share creation, deletion, and analytics calculations
 */

import { useState, useMemo, useCallback } from 'react';
import type { Share, Repository, ShareAnalytics } from '@/types/share';
import { generateShareId, isExpiringSoon, TIME_CONSTANTS } from '@/utils/share/helpers';

/**
 * Custom hook for managing repository shares with analytics
 * @param initialShares - Initial array of shares
 * @returns Share management state and functions
 */
export function useShareManagement(initialShares: Share[]) {
  const [shares, setShares] = useState<Share[]>(initialShares);

  /**
   * Creates a new repository share
   * @param repository - Repository to share
   * @param email - Recipient email address
   * @param expirationDays - Number of days until expiration
   * @param viewLimit - Maximum number of views allowed
   * @returns The created share
   */
  const createShare = useCallback(
    (repository: Repository, email: string, expirationDays: number, viewLimit: number) => {
      const newShare: Share = {
        id: Date.now(), // Better ID generation for demo
        repositoryName: repository.name,
        sharedWith: email,
        expiresAt: new Date(Date.now() + expirationDays * TIME_CONSTANTS.DAY_IN_MS),
        viewLimit,
        viewCount: 0,
        shareLink: `https://share.repo.com/${generateShareId()}`,
        createdAt: new Date(),
        status: 'active',
      };

      setShares((prev) => [newShare, ...prev]); // Add to beginning for recent-first order
      return newShare;
    },
    []
  );

  /**
   * Deletes a share by ID
   * @param shareId - ID of the share to delete
   */
  const deleteShare = useCallback((shareId: number) => {
    setShares((prev) => prev.filter((share) => share.id !== shareId));
  }, []);

  /**
   * Revokes all active shares
   */
  const revokeAllShares = useCallback(() => {
    setShares([]);
  }, []);

  /**
   * Updates view count for a share
   * @param shareId - ID of the share to update
   */
  const incrementViewCount = useCallback((shareId: number) => {
    setShares((prev) =>
      prev.map((share) =>
        share.id === shareId ? { ...share, viewCount: share.viewCount + 1 } : share
      )
    );
  }, []);

  /**
   * Extends expiration date for a share
   * @param shareId - ID of the share to extend
   * @param additionalDays - Number of additional days
   */
  const extendShareExpiration = useCallback((shareId: number, additionalDays: number) => {
    setShares((prev) =>
      prev.map((share) =>
        share.id === shareId
          ? {
              ...share,
              expiresAt: new Date(
                share.expiresAt.getTime() + additionalDays * TIME_CONSTANTS.DAY_IN_MS
              ),
              status: 'active' as const,
            }
          : share
      )
    );
  }, []);

  /**
   * Computed analytics data
   */
  const analytics: ShareAnalytics = useMemo(() => {
    const activeShares = shares.filter((share) => share.status === 'active');
    const totalViews = shares.reduce((acc, share) => acc + share.viewCount, 0);
    const expiringSoon = shares.filter(isExpiringSoon).length;

    const thisWeekShares = shares.filter(
      (share) => share.createdAt.getTime() > Date.now() - TIME_CONSTANTS.WEEK_IN_MS
    ).length;

    const recentActivity = shares
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return {
      activeShares: activeShares.length,
      totalViews,
      expiringSoon,
      thisWeekShares,
      recentActivity,
    };
  }, [shares]);

  /**
   * Filtered share lists for different views
   */
  const sharesByStatus = useMemo(
    () => ({
      active: shares.filter((share) => share.status === 'active'),
      expired: shares.filter((share) => share.status === 'expired'),
      revoked: shares.filter((share) => share.status === 'revoked'),
    }),
    [shares]
  );

  return {
    // State
    shares,
    analytics,
    sharesByStatus,

    // Actions
    createShare,
    deleteShare,
    revokeAllShares,
    incrementViewCount,
    extendShareExpiration,
  } as const;
}
