import { NextRequest, NextResponse } from 'next/server';
import { getShareDetails } from '@/lib/share';
import { getTree } from '@/lib/github';
import { getDecryptedTokensForUser } from '@/lib/adapter';
import prisma from '@/lib/prisma';


type GitHubGitTreeItem = {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
};

type TreeCacheEntry = {
  data: { tree: GitHubGitTreeItem[] };
  expiresAt: number;
  inflight?: Promise<{ tree: GitHubGitTreeItem[] }>;
};

const treeCache = new Map<string, TreeCacheEntry>();
const TREE_CACHE_TTL_MS = 60_000;

function makeTreeCacheKey(shareId: string): string {
  return `tree:${shareId}`;
}

async function getCachedTreeForShare(
  shareId: string,
  fetcher: () => Promise<{ tree: GitHubGitTreeItem[] }>
): Promise<{ tree: GitHubGitTreeItem[] }> {
  const key = makeTreeCacheKey(shareId);
  const now = Date.now();
  const existing = treeCache.get(key);

  if (existing && existing.data && existing.expiresAt > now) {
    return existing.data;
  }

  if (existing?.inflight) {
    return existing.inflight;
  }

  const inflight = fetcher()
    .then((data) => {
      treeCache.set(key, { data, expiresAt: Date.now() + TREE_CACHE_TTL_MS });
      return data;
    })
    .finally(() => {
      const latest = treeCache.get(key);
      if (latest) {
        delete latest.inflight;
        treeCache.set(key, latest);
      }
    });

  treeCache.set(key, { data: { tree: [] }, expiresAt: 0, inflight });
  return inflight;
}

function getImmediateChildrenForPath(
  tree: GitHubGitTreeItem[],
  parentPath: string | null
): GitHubGitTreeItem[] {
  const prefix = parentPath ? parentPath.replace(/\/+$/, '') + '/' : '';
  const children = tree.filter((item) => {
    if (!prefix) {
      return !item.path.includes('/');
    }
    if (!item.path.startsWith(prefix)) return false;
    const rest = item.path.slice(prefix.length);
    return rest.length > 0 && !rest.includes('/');
  });
  return children;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const directoryPath = req.nextUrl.searchParams.get('path');

  if (!shareId) {
    return NextResponse.json({ error: 'Share ID is required' }, { status: 400 });
  }

   try {
    const share = await getShareDetails(shareId);
    if (share.expiresAt && share.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Share is expired' }, { status: 403 });
    }
    if (share.viewLimit && share.viewCount >= share.viewLimit) {
      return NextResponse.json({ error: 'Share view limit reached' }, { status: 403 });
    }

    const tokens = await getDecryptedTokensForUser(prisma, share.userId, 'github');

    if (!tokens?.access_token) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    const treeResponse = await getCachedTreeForShare(shareId, () =>
      getTree(share.repoName, share.repoOwner, tokens.access_token as string)
    );

    const treeItems = Array.isArray((treeResponse as any)?.tree)
      ? ((treeResponse as any).tree as GitHubGitTreeItem[])
      : [];

    const immediateChildren = getImmediateChildrenForPath(
      treeItems,
      directoryPath && directoryPath !== '/' ? directoryPath : null
    );

    const transformedData = immediateChildren.map((item) => ({
      name: item.path.split('/').pop() as string,
      path: item.path,
      type: item.type === 'blob' ? 'file' : 'dir',
      sha: item.sha,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching repository tree:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch repository tree',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
