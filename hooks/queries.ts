'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchGithubProfile, fetchUserRepos } from '@/lib/api/user';
import { createShare, fetchUserShares } from '@/lib/api/share';
import { CreateShareRequest } from '@/types/share';

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

export function useCreateShareMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (share: CreateShareRequest) => createShare(share),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
    },
  });
}

export function useGithubProfileQuery() {
  return useQuery({
    queryKey: ['githubProfile'],
    queryFn: fetchGithubProfile,
  });
}
