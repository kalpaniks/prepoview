import { CreateShareRequest, Share } from '@/types/share';

export async function fetchUserShares() {
  const response = await fetch(`/api/user/shares`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user shares');
  }
  const data = await response.json();
  return data as Share[];
}

export async function createShare(share: CreateShareRequest) {
  const response = await fetch(`/api/user/shares`, {
    method: 'POST',
    body: JSON.stringify(share),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to create share');
  }
  const data = await response.json();
  return data as Share;
}
