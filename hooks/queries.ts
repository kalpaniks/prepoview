'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchGithubProfile, fetchUserRepos } from '@/lib/api/user';
import { queryKeys } from '@/lib/queryKeys';

export function useReposQuery() {
  return useQuery({
    queryKey: queryKeys.repos,
    queryFn: fetchUserRepos,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGithubProfileQuery() {
  return useQuery({
    queryKey: queryKeys.githubProfile,
    queryFn: fetchGithubProfile,
    staleTime: 1000 * 60 * 60,
  });
}
