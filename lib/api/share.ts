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
  const response = await fetch(`/api/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(share),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to create share');
  }
  const data = await response.json();
  return data as Share;
}

export async function updateShare(id: string, updates: Partial<Share>) {
  const response = await fetch(`/api/share/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to update share');
  }
  const data = await response.json();
  return data as Share;
}

export async function deleteShare(id: number) {
  const response = await fetch(`/api/share/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete share');
  }
}

export async function fetchShare(id: string) {
  const response = await fetch(`/api/share/${id}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch share');
  }
  const data = await response.json();
  return data as Share;
}
