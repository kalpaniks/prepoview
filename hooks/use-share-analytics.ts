import { useMemo } from 'react';
import { TIME_CONSTANTS } from '@/utils/share/constants';
import type { Share as UiShare, ShareAnalytics } from '@/types/share';

// Accepts raw shares from API
export function useShareAnalytics(shares: any[]): ShareAnalytics {
  return useMemo(() => {
    if (!Array.isArray(shares) || shares.length === 0) {
      return {
        activeShares: 0,
        totalViews: 0,
        expiringSoon: 0,
        thisWeekShares: 0,
        recentActivity: [],
      } as ShareAnalytics;
    }

    const now = Date.now();

    const toDate = (d: any): Date | null => {
      if (!d) return null;
      const dt = new Date(d);
      return Number.isNaN(dt.getTime()) ? null : dt;
    };

    const mapToUiShare = (s: any): UiShare => {
      const createdAt = toDate(s.createdAt) ?? new Date();
      const expiresAt = toDate(s.expiresAt);
      const viewCount: number = (s.viewCount ?? s.totalShares ?? 0) as number;
      const viewLimitRaw = s.viewLimit ?? s.maxShares;
      const viewLimit: number =
        typeof viewLimitRaw === 'number' && viewLimitRaw > 0 ? viewLimitRaw : 1000;

      const expired = !!(expiresAt && expiresAt.getTime() <= now);
      const overLimit = typeof viewLimit === 'number' && viewLimit > 0 && viewCount >= viewLimit;
      const status: UiShare['status'] = expired || overLimit || s.isExpired ? 'expired' : 'active';

      return {
        id: (s.id as number) ?? Number.NaN, // used only as key in some places
        repoName: (s.repoName as string) ?? 'unknown',
        sharedWith: (s.sharedWith as string) ?? 'unknown',
        expiresAt: (expiresAt as any) ?? (null as any),
        viewLimit,
        viewCount,
        shareLink: (s.shareLink as string) ?? '',
        createdAt: createdAt as any,
        status,
      } as UiShare;
    };

    const uiShares: UiShare[] = shares.map(mapToUiShare);

    const activeShares = uiShares.filter((s) => s.status === 'active').length;
    const totalViews = uiShares.reduce((sum, s) => sum + (s.viewCount || 0), 0);
    const expiringSoon = uiShares.filter((s) => {
      const exp = s.expiresAt ? new Date(s.expiresAt).getTime() : null;
      if (!exp) return false;
      const diff = exp - now;
      return diff > 0 && diff < TIME_CONSTANTS.DAY_IN_MS; // within 24h
    }).length;
    const thisWeekShares = uiShares.filter((s) => {
      const created = s.createdAt ? new Date(s.createdAt).getTime() : 0;
      return now - created < TIME_CONSTANTS.WEEK_IN_MS;
    }).length;

    // Recent activity: latest 5 by createdAt
    const recentActivity = [...uiShares]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      activeShares,
      totalViews,
      expiringSoon,
      thisWeekShares,
      recentActivity,
    } as ShareAnalytics;
  }, [shares]);
}
