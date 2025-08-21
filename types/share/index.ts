/**
 * Type definitions for repository sharing functionality
 * @fileoverview Centralized type definitions for the share dashboard
 */

/**
 * Represents a private repository that can be shared
 */
export interface Repository {
  /** Unique identifier for the repository */
  id: number;
  /** Repository name */
  name: string;
  /** Repository description */
  description: string;
  /** Primary programming language */
  language: string;
  /** Whether the repository is private */
  isPrivate: boolean;
  /** Human-readable last update time */
  updatedAt: string;
  /** Repository size in human-readable format */
  size: string;
  /** Last commit message */
  lastCommit: string;
  /** Team or organization that owns the repository */
  owner: string;
}

/**
 * Represents a repository share with access controls
 */
export interface Share {
  /** Unique identifier for the share */
  id: number;
  /** Name of the shared repository */
  repositoryName: string;
  /** Email address of the recipient */
  sharedWith: string;
  /** Expiration date for the share */
  expiresAt: Date;
  /** Maximum number of views allowed */
  viewLimit: number;
  /** Current number of views */
  viewCount: number;
  /** Unique share link */
  shareLink: string;
  /** Date when the share was created */
  createdAt: Date;
  /** Current status of the share */
  status: 'active' | 'expired' | 'revoked';
}

/**
 * GitHub profile information from GitHub API
 */
export interface GitHubProfile {
  /** GitHub username */
  login: string;
  /** Display name */
  name: string;
  /** Email address */
  email: string;
  /** Avatar image URL */
  avatar_url: string;
  /** User bio */
  bio: string;
  /** Company affiliation */
  company: string;
  /** Location */
  location: string;
  /** Number of public repositories */
  public_repos: number;
  /** Number of followers */
  followers: number;
  /** Number of following */
  following: number;
  /** Account creation date */
  created_at: string;
  /** GitHub plan information */
  plan: {
    /** Plan name (Free, Pro, Team, Enterprise) */
    name: string;
    /** Number of collaborators allowed */
    collaborators: number;
    /** Number of private repositories allowed */
    private_repos: number;
  };
}

/**
 * Analytics data for the sharing dashboard
 */
export interface ShareAnalytics {
  /** Number of currently active shares */
  activeShares: number;
  /** Total views across all shares */
  totalViews: number;
  /** Number of shares expiring within 24 hours */
  expiringSoon: number;
  /** Number of shares created this week */
  thisWeekShares: number;
  /** Recent activity for timeline display */
  recentActivity: Share[];
}

/**
 * Repository search and filter state
 */
export interface RepositorySearchState {
  /** Current search query */
  searchQuery: string;
  /** Sort criteria */
  sortBy: 'name' | 'updated' | 'size';
  /** Language filter */
  languageFilter: string;
  /** Whether user has entered a search query */
  hasSearchQuery: boolean;
  /** Filtered and sorted repository results */
  filteredRepositories: Repository[];
  /** Available languages for filtering */
  availableLanguages: string[];
}

/**
 * Share creation form data
 */
export interface ShareFormData {
  /** Recipient email address */
  email: string;
  /** Expiration time in days */
  expirationDays: string;
  /** Maximum number of views */
  viewLimit: string;
}

/**
 * Props for repository-related components
 */
export interface RepositoryComponentProps {
  /** Repository data */
  repository: Repository;
  /** Callback when share button is clicked */
  onShare: (repository: Repository) => void;
}

/**
 * Props for share management components
 */
export interface ShareComponentProps {
  /** Share data */
  share: Share;
  /** Callback when share is deleted */
  onDelete: (shareId: number) => void;
  /** Callback when share link is copied */
  onCopyLink: (shareLink: string) => void;
}

/**
 * Language color mapping for visual indicators
 */
export type LanguageColorMap = Record<string, string>;

/**
 * Sort options for repository listing
 */
export type RepositorySortOption = 'name' | 'updated' | 'size';

/**
 * Share status types
 */
export type ShareStatus = 'active' | 'expired' | 'revoked';
