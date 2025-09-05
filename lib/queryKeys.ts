export const queryKeys = {
  githubProfile: ['githubProfile'] as const,
  repos: ['repos'] as const,
  shares: ['shares'] as const,
  share: (id: string | number) => ['share', String(id)] as const,
};
