import { CreateShareRequest, Share } from '@/types/share';

export async function fetchUserShares() {
  const response = await fetch(`/api/user/shares`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user shares');
  }
  const data = await response.json();
  const now = Date.now();
  return data.map((s: Share) => {
    const createdAt = new Date(s.createdAt);
    const expiresAt = s.expiresAt ? new Date(s.expiresAt) : null;
    const viewCount = typeof s.viewCount === 'number' ? s.viewCount : 0;
    const viewLimit = typeof s.viewLimit === 'number' && s.viewLimit > 0 ? s.viewLimit : 1000;
    const expired = !!(expiresAt && expiresAt.getTime() <= now);
    const overLimit = viewCount >= viewLimit;
    const status: 'active' | 'expired' | 'revoked' = expired || overLimit ? 'expired' : 'active';

    return {
      ...s,
      createdAt,
      expiresAt,
      viewCount,
      viewLimit,
      status,
    } as Share;
  }) as Share[];
}

export async function createShare(share: CreateShareRequest): Promise<string> {
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
  return data.shareId as string;
}

export async function updateShare(id: string, updates: Partial<Share>) {
  const { expiresAt, viewLimit } = updates;
  const response = await fetch(`/api/share`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, expiresAt, viewLimit }),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to update share');
  }
  const data = await response.json();
  return data as Share;
}

export async function deleteShare(shareId: string) {
  const response = await fetch(`/api/share?shareId=${shareId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete share');
  }
  return response.json();
}

export async function fetchShare(shareId: string) {
  const response = await fetch(`/api/share?shareId=${shareId}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch share');
  }
  const data = await response.json();
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
  } as Share;
}

export async function deleteAllShares() {
  const response = await fetch(`/api/user/shares`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete all shares');
  }
  return response.json();
}
