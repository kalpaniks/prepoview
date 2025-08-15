import { NextRequest, NextResponse } from 'next/server';
import { getShareDetails } from '@/lib/share';
import { getBaseTree, getTree, transformGitHubTreeToNested } from '@/lib/github';
import { getDecryptedTokensForUser } from '@/lib/adapter';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const branch = req.nextUrl.searchParams.get('branch');

  if (!shareId) {
    return NextResponse.json({ error: 'Share ID is required' }, { status: 400 });
  }

  try {
    const defaultBranch = branch ?? 'main';
    const share = await getShareDetails(shareId);
    const accessToken = await getDecryptedTokensForUser(prisma, share.userId, 'github');

    if (!accessToken?.access_token) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 400 });
    }

    // Get flat tree from GitHub API
    // const githubTreeResponse = await getTree(
    //   share.repoName,
    //   share.repoOwner,
    //   accessToken.access_token,
    //   defaultBranch
    // );
    const githubTreeResponse = await getBaseTree(
      share.repoName,
      share.repoOwner,
      accessToken.access_token
    );
    // Transform flat structure to nested tree
    // const nestedTree = transformGitHubTreeToNested(githubTreeResponse.tree);

    return NextResponse.json(githubTreeResponse);
  } catch (error) {
    console.error('Error fetching repository tree:', error);
    return NextResponse.json({ error: 'Failed to fetch repository tree' }, { status: 500 });
  }
}
