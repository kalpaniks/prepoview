import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { GitHubRepositoryResponse, Repository } from '@/types/share';
import { getDecryptedTokensForUser } from '@/lib/adapter';
import prisma from '@/lib/prisma';

async function getUserRepos(accessToken: string, userId: string): Promise<Repository[]> {
  try {
    const response = await fetch(`https://api.github.com/user/repos?type=private`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 120,
        tags: [`repos-${userId}`],
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch repos: ${response.statusText}`);
    }
    const repos = await response.json();
    const formattedRepos = repos.map(
      (repo: GitHubRepositoryResponse) =>
        ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          language: repo.language,
          private: repo.private,
          size: repo.size,
          defaultBranch: repo.default_branch,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          pushedAt: repo.pushed_at,
          fullName: repo.full_name,
          url: repo.url,
          htmlUrl: repo.html_url,
          owner: {
            login: repo.owner.login,
            avatarUrl: repo.owner.avatar_url,
            type: repo.owner.type,
            userViewType: repo.owner.user_view_type,
          },
        }) as Repository
    );
    return formattedRepos;
  } catch (error) {
    console.error('Error fetching user repos:', error);
    throw new Error('Failed to fetch user repos');
  }
}

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const accessToken = session.accessToken;
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }
  const repos = await getUserRepos(accessToken, session.user.id);
  return NextResponse.json(repos);
}
