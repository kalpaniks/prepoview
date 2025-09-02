/**
 * Type definitions for repository sharing functionality
 * @fileoverview Centralized type definitions for the share dashboard
 */

/**
 * Represents a private repository that can be shared
 */
export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  language: string;
  private: boolean;
  url: string;
  htmlUrl: string;
  owner: {
    login: string;
    avatarUrl: string;
    type: string;
    userViewType: string;
  };
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date;
  size: number;
  defaultBranch: string;
}

export interface GitHubRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  private: boolean;
  url: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
    type: string;
    user_view_type: string;
  };
  created_at: Date;
  updated_at: Date;
  pushed_at: Date;
  size: number;
  default_branch: string;
}
/**
 * Represents a repository share with access controls
 */
export interface Share {
  id: number;
  repoName: string;
  sharedWith: string;
  expiresAt: Date;
  viewLimit: number;
  viewCount: number;
  shareLink: string;
  createdAt: Date;
  status: 'active' | 'expired' | 'revoked';
}

export interface CreateShareRequest {
  repoOwner: string;
  repoName: string;
  sharedWith: string;
  expirationDays: number;
  viewLimit: number;
}
/**
 * GitHub profile information from GitHub API
 */
export interface GitHubProfile {
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  company: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  plan: {
    name: string;
    collaborators: number;
    private_repos: number;
  };
}

/**
 * Analytics data for the sharing dashboard
 */
export interface ShareAnalytics {
  activeShares: number;
  totalViews: number;
  expiringSoon: number;
  thisWeekShares: number;
  recentActivity: Share[];
}

/**
 * Repository search and filter state
 */
export interface RepositorySearchState {
  searchQuery: string;
  sortBy: 'name' | 'updated' | 'size';
  languageFilter: string;
  hasSearchQuery: boolean;
  filteredRepositories: Repository[];
  availableLanguages: string[];
}

/**
 * Share creation form data
 */
export interface ShareFormData {
  email: string;
  expirationDays: string;
  viewLimit: string;
}

/**
 * Props for repository-related components
 */
export interface RepositoryComponentProps {
  repository: Repository;
  onShare: (repository: Repository) => void;
}

/**
 * Props for share management components
 */
export interface ShareComponentProps {
  share: Share;
  onDelete: (shareId: number) => void;
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
