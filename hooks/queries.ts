'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchGithubProfile, fetchUserRepos } from '@/lib/api/user';
import { fetchUserShares } from '@/lib/api/share';

export function useReposQuery() {
  return useQuery({
    queryKey: ['repos'],
    queryFn: fetchUserRepos,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSharesQuery() {
  return useQuery({
    queryKey: ['shares'],
    queryFn: fetchUserShares,
    staleTime: 1000 * 60 * 1,
  });
}


export function useGithubProfileQuery() {
  return useQuery({
    queryKey: ['githubProfile'],
    queryFn: fetchGithubProfile,
  });
}
