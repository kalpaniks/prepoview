import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { GitHubRepositoryResponse, Repository, PaginatedRepositories } from '@/types/share';

async function getUserRepos(
  accessToken: string,
  userId: string,
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedRepositories> {
  try {
    const response = await fetch(
      `https://api.github.com/user/repos?type=all&page=${page}&per_page=${perPage}&sort=updated&direction=desc`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 120,
          tags: [`repos-${userId}`],
        },
      }
    );
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

    const linkHeader = response.headers.get('link');
    const hasMore = linkHeader?.includes('rel="next"') ?? repos.length === perPage;

    let total: number | undefined;
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
      if (lastPageMatch) {
        const lastPage = parseInt(lastPageMatch[1], 10);
        if (!hasMore) {
          total = (lastPage - 1) * perPage + repos.length;
        } else if (page === 1) {
          const lastPageResponse = await fetch(
            `https://api.github.com/user/repos?type=all&page=${lastPage}&per_page=${perPage}&sort=updated&direction=desc`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          if (lastPageResponse.ok) {
            const lastPageRepos = await lastPageResponse.json();
            total = (lastPage - 1) * perPage + lastPageRepos.length;
          }
        }
      } else if (!hasMore) {
        total = (page - 1) * perPage + repos.length;
      }
    } else if (!hasMore) {
      total = (page - 1) * perPage + repos.length;
    }

    return {
      repos: formattedRepos,
      page,
      perPage,
      hasMore,
      total,
    };
  } catch (error) {
    console.error('Error fetching user repos:', error);
    throw new Error('Failed to fetch user repos');
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const accessToken = session.accessToken;
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '10', 10);

  const result = await getUserRepos(accessToken, session.user.id, page, perPage);
  return NextResponse.json(result);
}
