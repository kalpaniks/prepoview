import { TIME_CONSTANTS, LANGUAGE_COLORS } from './constants';
import type { Share, Repository } from '@/types/share';

/**
 * Calculates time remaining until expiration in human-readable format
 * @param expiresAt - The expiration date
 * @returns Human-readable time remaining or "Expired"
 */
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

/**
 * Checks if a share is expiring within 1 hour
 * @param share - The share to check
 * @returns True if expiring within 1 hour
 */
export function isExpiringSoon(share: Share): boolean {
  const expiry = (share as any).expiresAt ? new Date((share as any).expiresAt) : null;
  if (!expiry) return false;
  const diff = expiry.getTime() - Date.now();
  return diff > 0 && diff < TIME_CONSTANTS.HOUR_IN_MS;
}

/**
 * Gets the appropriate color class for a programming language
 * @param language - The programming language
 * @returns Tailwind CSS background color class
 */
export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] || 'bg-gray-500';
}

/**
 * Generates a random share ID for demo purposes
 * @param length - Length of the generated ID
 * @returns Random alphanumeric string
 */
export function generateShareId(length: number = 9): string {
  return Math.random().toString(36).substr(2, length);
}

/**
 * Calculates the percentage of views used for a share
 * @param viewCount - Current number of views
 * @param viewLimit - Maximum number of views allowed
 * @returns Percentage as a number between 0 and 100
 */
export function getViewsUsagePercentage(viewCount: number, viewLimit: number): number {
  return Math.min((viewCount / viewLimit) * 100, 100);
}

/**
 * Formats a date for display in the dashboard
 * @param date - The date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
// export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
//   const defaultOptions: Intl.DateTimeFormatOptions = {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   };

//   return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
// }

/**
 * Formats GitHub join date for profile display
 * @param dateString - ISO date string from GitHub API
 * @returns Formatted date like "March 2018"
 */
export function formatGitHubJoinDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Truncates email for display purposes
 * @param email - Full email address
 * @returns Username part of the email (before @)
 */
export function truncateEmail(email: string): string {
  return email.split('@')[0];
}

/**
 * Determines the badge variant based on share expiration proximity
 * - expired: destructive (red)
 * - < 1 hour: warning (amber)
 * - >= 1 hour: success (green)
 */
export function getShareStatusVariant(
  share: Share
): 'secondary' | 'destructive' | 'warning' | 'success' {
  const expiry = (share as any).expiresAt ? new Date((share as any).expiresAt) : null;
  const diff = expiry ? expiry.getTime() - Date.now() : 0;

  if (diff <= 0) return 'destructive';
  if (diff < TIME_CONSTANTS.HOUR_IN_MS) return 'warning';
  return 'success';
}

/**
 * Sorts repositories based on the specified criteria
 * @param repositories - Array of repositories to sort
 * @param sortBy - Sort criteria
 * @returns Sorted array of repositories
 */
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

/**
 * Filters repositories based on search query and language filter
 * @param repositories - Array of repositories to filter
 * @param searchQuery - Search query string
 * @param languageFilter - Language filter ('all' for no filter)
 * @returns Filtered array of repositories
 */
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

/**
 * Gets unique languages from repository array
 * @param repositories - Array of repositories
 * @returns Sorted array of unique languages
 */
export function getUniqueLanguages(repositories: Repository[]): string[] {
  const languages = Array.from(new Set(repositories.map((repo) => repo.language)));
  return languages.sort();
}
