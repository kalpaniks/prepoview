import { TIME_CONSTANTS, LANGUAGE_COLORS } from './constants';
import type { Share, Repository, CreateShareRequest } from '@/types/share';

export function getTimeUntilExpiration(expiresAt?: Date | string | null): string {
  const expiry = expiresAt ? new Date(expiresAt) : null;
  const diff = expiry ? expiry.getTime() - Date.now() : 0;

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / TIME_CONSTANTS.DAY_IN_MS);
  const hours = Math.floor((diff % TIME_CONSTANTS.DAY_IN_MS) / TIME_CONSTANTS.HOUR_IN_MS);
  const minutes = Math.floor((diff % TIME_CONSTANTS.HOUR_IN_MS) / 60000);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return 'Soon';
}

export function isExpiringSoon(share: Share): boolean {
  const expiry = (share as any).expiresAt ? new Date((share as any).expiresAt) : null;
  if (!expiry) return false;
  const diff = expiry.getTime() - Date.now();
  return diff > 0 && diff < TIME_CONSTANTS.HOUR_IN_MS;
}

export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] || 'bg-gray-500';
}

export function generateShareId(length: number = 9): string {
  return Math.random().toString(36).substr(2, length);
}

export function getViewsUsagePercentage(viewCount: number, viewLimit: number): number {
  return Math.min((viewCount / viewLimit) * 100, 100);
}

// export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
//   const defaultOptions: Intl.DateTimeFormatOptions = {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   };

//   return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
// }

export function formatGitHubJoinDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function truncateEmail(email: string): string {
  return email.split('@')[0];
}

export function getShareStatusVariant(
  share: Share
): 'secondary' | 'destructive' | 'warning' | 'success' {
  const expiry = (share as any).expiresAt ? new Date((share as any).expiresAt) : null;
  const diff = expiry ? expiry.getTime() - Date.now() : 0;

  if (diff <= 0) return 'destructive';
  if (diff < TIME_CONSTANTS.HOUR_IN_MS) return 'warning';
  return 'success';
}

export function sortRepositories(
  repositories: Repository[],
  sortBy: 'name' | 'updated' | 'size'
): Repository[] {
  return [...repositories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'updated':
        return a.id - b.id;
      case 'size':
        const aSize = parseFloat(a.size.toString());
        const bSize = parseFloat(b.size.toString());
        return bSize - aSize;
      default:
        return 0;
    }
  });
}

export function filterRepositories(
  repositories: Repository[],
  searchQuery: string,
  languageFilter: string
): Repository[] {
  let filtered = repositories;
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        // repo.description.toLowerCase().includes(query) ||
        repo.language?.toLowerCase().includes(query) ||
        repo.owner.login.toLowerCase().includes(query)
    );
  }

  if (languageFilter !== 'all') {
    filtered = filtered.filter((repo) => repo.language === languageFilter);
  }

  return filtered;
}

export function getUniqueLanguages(repositories: Repository[]): string[] {
  const languages = Array.from(new Set(repositories.map((repo) => repo.language)));
  return languages.sort();
}

export interface FormattedShare extends Share {
  formattedExpiryDate: string;
  isExpired: boolean;
  isExpiringSoon: boolean;
  remainingViews: number;
}

export function validateShareRequest(data: CreateShareRequest): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.repoOwner?.trim()) {
    errors.push('Repository owner is required');
  }

  if (!data.repoName?.trim()) {
    errors.push('Repository name is required');
  }

  if (!data.sharedWith?.trim()) {
    errors.push('Email address is required');
  } else if (!isValidEmail(data.sharedWith)) {
    errors.push('Invalid email address');
  }

  if (data.expirationDays < 1 || data.expirationDays > 365) {
    errors.push('Expiration days must be between 1 and 365');
  }

  if (data.viewLimit < 1 || data.viewLimit > 1000) {
    errors.push('View limit must be between 1 and 1000');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function formatShareForDisplay(share: Share): FormattedShare {
  const now = new Date();
  const expiryDate = new Date(share.expiresAt);
  const isExpired = expiryDate < now;
  const isExpiringSoon =
    !isExpired && expiryDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days

  return {
    ...share,
    formattedExpiryDate: expiryDate.toLocaleDateString(),
    isExpired,
    isExpiringSoon,
    remainingViews: Math.max(0, share.viewLimit - share.viewCount),
  };
}

export function calculateShareExpiry(expirationDays: number): Date {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expirationDays);
  return expiryDate;
}

export function generateShareLink(shareId: string): string {
  return `${window.location.origin}/share/${shareId}`;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isShareActive(share: Share): boolean {
  const now = new Date();
  const expiryDate = new Date(share.expiresAt);

  return share.status === 'active' && expiryDate > now && share.viewCount < share.viewLimit;
}
