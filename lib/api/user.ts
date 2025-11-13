import { PaginatedRepositories } from '@/types/share';

export async function fetchUserRepos(
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedRepositories> {
  const response = await fetch(`/api/user/repos?page=${page}&perPage=${perPage}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user repos');
  }
  const data = await response.json();
  return data as PaginatedRepositories;
}

export async function fetchGithubProfile() {
  const response = await fetch(`/api/user/profile`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  const data = await response.json();
  return data;
}

export async function revokeGithubAccess(): Promise<void> {
  const response = await fetch(`/api/user/revoke`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || 'Failed to revoke access');
  }
}
