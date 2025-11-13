import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, GitBranch } from 'lucide-react';
import type { Repository } from '@/types/share';
import RepositorySearchResult from './RepositorySearchResult';
import { Skeleton } from '../ui/skeleton';

interface AllRepositoriesListProps {
  repositories: Repository[];
  onRepositoryShare: (repository: Repository) => void;
  isLoading: boolean;
  isFetching: boolean;
  page: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  languageFilter: string;
}

function PaginationControls({
  page,
  hasMore,
  onPageChange,
  isLoading,
}: {
  page: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}) {
  return (
    <div className="border-border/60 flex items-center justify-between border-t pt-4">
      <div className="text-muted-foreground text-sm">Page {page}</div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || isLoading}
          className="border-border/60"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasMore || isLoading}
          className="border-border/60"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="border-border/60 flex items-center justify-between rounded-md border p-4"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex items-center gap-2">
              <GitBranch className="text-muted-foreground h-4 w-4 shrink-0" />
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <Skeleton className="mb-1 h-4 w-32" />
              <Skeleton className="mb-2 h-3 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ languageFilter }: { languageFilter: string }) {
  return (
    <div className="py-8 text-center">
      <GitBranch className="text-muted-foreground/50 mx-auto mb-3 h-8 w-8" />
      <h3 className="mb-1 font-medium">No repositories found</h3>
      <p className="text-muted-foreground text-sm">
        {languageFilter !== 'all'
          ? `No repositories found with language filter: ${languageFilter}`
          : 'No repositories available'}
      </p>
    </div>
  );
}

export default function AllRepositoriesList({
  repositories,
  onRepositoryShare,
  isLoading,
  isFetching,
  page,
  hasMore,
  onPageChange,
  languageFilter,
}: AllRepositoriesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Loading repositories...</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (repositories.length === 0) {
    return <EmptyState languageFilter={languageFilter} />;
  }

  return (
    <div className="space-y-4">
      <div className="mb-3 flex items-center justify-between">
        {isFetching && (
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span
              className="bg-muted/70 inline-block h-3 w-3 animate-pulse rounded-full"
              aria-live="polite"
            />
            Updating...
          </div>
        )}
      </div>

      <div className="space-y-2">
        {repositories.map((repo) => (
          <RepositorySearchResult key={repo.id} repository={repo} onShare={onRepositoryShare} />
        ))}
      </div>

      <PaginationControls
        page={page}
        hasMore={hasMore}
        onPageChange={onPageChange}
        isLoading={isLoading || isFetching}
      />
    </div>
  );
}
