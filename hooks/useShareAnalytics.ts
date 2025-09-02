import { Share } from '@/types/share';
import { useMemo } from 'react';

export function useShareAnalytics(shares: Share[]) {
  return useMemo(() => {
    if (!shares)
      return {
        totalShares: 0,
      };
  }, [shares]);
}
