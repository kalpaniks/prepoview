import { NextRequest, NextResponse } from 'next/server';
import { getShareDetails, requireValidViewSession } from '@/lib/share';
import { getBaseTree } from '@/lib/github';
import { getDecryptedTokensForUser } from '@/lib/adapter';
import prisma from '@/lib/prisma';

interface GitHubTreeItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
  size?: number;
  download_url?: string;
}

async function fetchDirectoryContents(
  repoName: string,
  repoOwner: string,
  accessToken: string,
  directoryPath: string
): Promise<GitHubTreeItem[]> {
  const encodedPath = encodeURIComponent(directoryPath);
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${encodedPath}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `GitHub API error: ${response.status} - ${errorData.message || response.statusText}`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Expected directory contents to be an array');
  }

  return data as GitHubTreeItem[];
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const directoryPath = req.nextUrl.searchParams.get('path');

  if (!shareId) {
    return NextResponse.json({ error: 'Share ID is required' }, { status: 400 });
  }
  // const sessionId = req.cookies.get('viewer_session')?.value;
  // try {
  //   await requireValidViewSession(shareId, sessionId);
  // } catch {
  //   const response = NextResponse.json({ error: 'Access Denied' }, { status: 403 });
  //   response.cookies.delete('viewer_session');
  //   return response;
  // }

  try {
    const share = await getShareDetails(shareId);
    const accessToken = await getDecryptedTokensForUser(prisma, share.userId, 'github');

    if (!accessToken?.access_token) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    let githubTreeResponse: GitHubTreeItem[];

    if (directoryPath) {
      githubTreeResponse = await fetchDirectoryContents(
        share.repoName,
        share.repoOwner,
        accessToken.access_token,
        directoryPath
      );
    } else {
      githubTreeResponse = await getBaseTree(
        share.repoName,
        share.repoOwner,
        accessToken.access_token
      );
    }

    const transformedData = githubTreeResponse.map((item: GitHubTreeItem) => ({
      name: item.name,
      path: item.path,
      type: item.type === 'file' ? 'file' : 'dir',
      sha: item.sha,
    }));

    const response = NextResponse.json(transformedData);
    return response;
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
