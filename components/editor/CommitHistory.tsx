'use client';
import { useEffect, useState } from 'react';
import { GitCommit, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
    avatar: string | null;
    username: string | null;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

interface CommitHistoryProps {
  shareId: string;
}

export default function CommitHistory({ shareId }: CommitHistoryProps) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCommits(1);
  }, [shareId]);

  const fetchCommits = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/share/${shareId}/commits?page=${pageNum}&per_page=30`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch commits');
      }

      const data = await response.json();
      
      if (pageNum === 1) {
        setCommits(data);
      } else {
        setCommits((prev: Commit[]) => [...prev, ...data]);
      }

      setHasMore(data.length === 30);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load commits');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    fetchCommits(page + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 7) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'just now';
    }
  };

  const getCommitMessage = (message: string) => {
    const lines = message.split('\n');
    return {
      title: lines[0],
      description: lines.slice(1).join('\n').trim(),
    };
  };

  if (loading && commits.length === 0) {
    return (
      <div className="space-y-4 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-border-default flex items-start space-x-3 border-b pb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="border-border-default bg-bg-muted text-fg-default rounded-lg border p-4">
          <p className="text-sm">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (commits.length === 0) {
    return (
      <div className="p-6">
        <div className="border-border-default bg-bg-muted text-fg-muted rounded-lg border p-8 text-center">
          <GitCommit className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="text-sm">No commits found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-fg-default text-lg font-semibold">Commit History</h2>
          <p className="text-fg-muted text-sm">{commits.length} commits</p>
        </div>

        <div className="space-y-0">
          {commits.map((commit, index) => {
            const { title, description } = getCommitMessage(commit.message);
            return (
              <div
                key={commit.sha}
                className={`border-border-default group flex items-start space-x-3 border-b py-4 last:border-b-0 ${
                  index === 0 ? 'pt-0' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  {commit.author.avatar ? (
                    <img
                      src={commit.author.avatar}
                      alt={commit.author.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="bg-bg-muted text-fg-muted flex h-10 w-10 items-center justify-center rounded-full">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1">
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fg-default hover:text-fg-accent block font-medium transition-colors"
                    >
                      {title}
                    </a>
                    {description && (
                      <p className="text-fg-muted mt-1 whitespace-pre-wrap text-sm">
                        {description}
                      </p>
                    )}
                  </div>

                  <div className="text-fg-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span className="font-medium">
                        {commit.author.username || commit.author.name}
                      </span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(commit.author.date)}</span>
                    </span>
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-fg-accent font-mono transition-colors"
                    >
                      {commit.sha.substring(0, 7)}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-6 text-center">
            <Button
              onClick={loadMore}
              disabled={loading}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {loading ? 'Loading...' : 'Load More Commits'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
