'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchGithubProfile, fetchUserRepos } from '@/lib/api/user';
import { queryKeys } from '@/lib/queryKeys';

export function useReposQuery(page: number = 1, perPage: number = 10) {
  return useQuery({
    queryKey: [...queryKeys.repos, page, perPage],
    queryFn: () => fetchUserRepos(page, perPage),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useGithubProfileQuery() {
  return useQuery({
    queryKey: queryKeys.githubProfile,
    queryFn: fetchGithubProfile,
    staleTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  });
}
