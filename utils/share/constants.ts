/**
 * Constants and mock data for repository sharing functionality
 * @fileoverview Centralized constants for the share dashboard
 */

import type { Repository, Share, GitHubProfile } from '@/types/share';

/**
 * Language color mapping for visual indicators
 */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  Python: 'bg-green-500',
  React: 'bg-cyan-500',
  Go: 'bg-indigo-500',
  Swift: 'bg-orange-500',
  SQL: 'bg-purple-500',
  Java: 'bg-red-500',
  Shell: 'bg-gray-500',
  JavaScript: 'bg-yellow-500',
  Rust: 'bg-orange-600',
  'C++': 'bg-pink-500',
  Ruby: 'bg-red-600',
} as const;

/**
 * Default sharing configuration
 */
export const DEFAULT_SHARE_CONFIG = {
  expirationDays: '7',
  viewLimit: '10',
  maxSharesPerRepo: 10,
  maxConcurrentShares: 50,
} as const;

/**
 * Time constants for calculations
 */
export const TIME_CONSTANTS = {
  HOUR_IN_MS: 60 * 60 * 1000,
  DAY_IN_MS: 24 * 60 * 60 * 1000,
  WEEK_IN_MS: 7 * 24 * 60 * 60 * 1000,
  MONTH_IN_MS: 30 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Mock repository data for development and testing
 */
export const MOCK_REPOSITORIES: Repository[] = [
  {
    id: 1,
    name: 'private-api-service',
    description: 'Internal API service for customer management with advanced authentication',
    language: 'TypeScript',
    isPrivate: true,
    updatedAt: '2 hours ago',
    size: '2.3 MB',
    lastCommit: 'feat: add user roles validation',
    owner: 'engineering-team',
  },
  {
    id: 2,
    name: 'secret-ml-model',
    description: 'Machine learning model for predictive analytics using TensorFlow',
    language: 'Python',
    isPrivate: true,
    updatedAt: '1 day ago',
    size: '45.2 MB',
    lastCommit: 'refactor: optimize model training pipeline',
    owner: 'data-science',
  },
  {
    id: 3,
    name: 'internal-dashboard',
    description: 'Company internal dashboard and analytics built with React and D3.js',
    language: 'React',
    isPrivate: true,
    updatedAt: '3 days ago',
    size: '8.7 MB',
    lastCommit: 'fix: resolve performance issues in charts',
    owner: 'frontend-team',
  },
  {
    id: 4,
    name: 'config-manager',
    description: 'Configuration management system for microservices architecture',
    language: 'Go',
    isPrivate: true,
    updatedAt: '1 week ago',
    size: '1.2 MB',
    lastCommit: 'docs: update configuration examples',
    owner: 'platform-team',
  },
  {
    id: 5,
    name: 'mobile-payment-sdk',
    description: 'Mobile payment SDK with advanced security features',
    language: 'Swift',
    isPrivate: true,
    updatedAt: '5 days ago',
    size: '12.1 MB',
    lastCommit: 'security: implement biometric authentication',
    owner: 'mobile-team',
  },
  {
    id: 6,
    name: 'database-migrations',
    description: 'Database migration tools and scripts for production environments',
    language: 'SQL',
    isPrivate: true,
    updatedAt: '2 weeks ago',
    size: '892 KB',
    lastCommit: 'chore: add rollback procedures',
    owner: 'backend-team',
  },
  {
    id: 7,
    name: 'auth-microservice',
    description: 'Authentication microservice with OAuth 2.0 and SAML support',
    language: 'Java',
    isPrivate: true,
    updatedAt: '4 days ago',
    size: '15.7 MB',
    lastCommit: 'feat: add SAML integration',
    owner: 'security-team',
  },
  {
    id: 8,
    name: 'monitoring-scripts',
    description: 'Infrastructure monitoring and alerting automation scripts',
    language: 'Shell',
    isPrivate: true,
    updatedAt: '6 days ago',
    size: '2.8 MB',
    lastCommit: 'fix: improve error detection logic',
    owner: 'devops-team',
  },
];

/**
 * Mock share data for development and testing
 */
export const MOCK_SHARES: Share[] = [
  {
    id: 1,
    repositoryName: 'private-api-service',
    sharedWith: 'john.doe@company.com',
    expiresAt: new Date(Date.now() + 2 * TIME_CONSTANTS.DAY_IN_MS),
    viewLimit: 10,
    viewCount: 3,
    shareLink: 'https://share.repo.com/abc123',
    createdAt: new Date(Date.now() - TIME_CONSTANTS.DAY_IN_MS),
    status: 'active',
  },
  {
    id: 2,
    repositoryName: 'secret-ml-model',
    sharedWith: 'jane.smith@partner.com',
    expiresAt: new Date(Date.now() + 7 * TIME_CONSTANTS.DAY_IN_MS),
    viewLimit: 5,
    viewCount: 1,
    shareLink: 'https://share.repo.com/def456',
    createdAt: new Date(Date.now() - 3 * TIME_CONSTANTS.DAY_IN_MS),
    status: 'active',
  },
  {
    id: 3,
    repositoryName: 'mobile-payment-sdk',
    sharedWith: 'developer@startup.com',
    expiresAt: new Date(Date.now() + 6 * TIME_CONSTANTS.HOUR_IN_MS), // Expires in 6 hours
    viewLimit: 3,
    viewCount: 2,
    shareLink: 'https://share.repo.com/ghi789',
    createdAt: new Date(Date.now() - 8 * TIME_CONSTANTS.DAY_IN_MS),
    status: 'active',
  },
  {
    id: 4,
    repositoryName: 'auth-microservice',
    sharedWith: 'security@partner.org',
    expiresAt: new Date(Date.now() + 12 * TIME_CONSTANTS.HOUR_IN_MS), // Expires in 12 hours
    viewLimit: 15,
    viewCount: 8,
    shareLink: 'https://share.repo.com/jkl012',
    createdAt: new Date(Date.now() - 2 * TIME_CONSTANTS.DAY_IN_MS),
    status: 'active',
  },
];

/**
 * Mock GitHub profile for development and testing
 */
export const MOCK_GITHUB_PROFILE: GitHubProfile = {
  login: 'alexjohnson-dev',
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
  avatar_url: 'https://avatars.githubusercontent.com/u/12345678?v=4',
  bio: 'Senior Software Engineer @TechCorp • Building scalable systems • Open source enthusiast',
  company: '@TechCorp',
  location: 'San Francisco, CA',
  public_repos: 42,
  followers: 156,
  following: 89,
  created_at: '2018-03-15T10:30:00Z',
  plan: {
    name: 'Pro',
    collaborators: 50,
    private_repos: 125,
  },
};
