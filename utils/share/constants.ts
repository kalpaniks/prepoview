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


export const DEFAULT_SHARE_CONFIG = {
  expirationDays: '7',
  viewLimit: '10',
  maxSharesPerRepo: 10,
  maxConcurrentShares: 50,
} as const;


export const TIME_CONSTANTS = {
  HOUR_IN_MS: 60 * 60 * 1000,
  DAY_IN_MS: 24 * 60 * 60 * 1000,
  WEEK_IN_MS: 7 * 24 * 60 * 60 * 1000,
  MONTH_IN_MS: 30 * 24 * 60 * 60 * 1000,
} as const;
