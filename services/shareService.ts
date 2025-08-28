import { CreateShareRequest, Share } from '@/types/share';


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

/**
 * Calculates expiry date based on days
 */
export function calculateShareExpiry(expirationDays: number): Date {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expirationDays);
  return expiryDate;
}

/**
 * Generates a share link
 */
export function generateShareLink(shareId: string): string {
  return `${window.location.origin}/share/${shareId}`;
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if a share is active
 */
export function isShareActive(share: Share): boolean {
  const now = new Date();
  const expiryDate = new Date(share.expiresAt);

  return share.status === 'active' && expiryDate > now && share.viewCount < share.viewLimit;
}
