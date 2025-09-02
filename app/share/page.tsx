'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useRepositorySearch } from '@/hooks/useRepositorySearch';
import { useShareManagement } from '@/hooks/useShareManagement';
import { Sidebar, RepositorySearchSection, ShareDialog, ShareTable } from '@/components/share';
import type { Repository } from '@/types/share';
import { useGithubProfileQuery, useReposQuery } from '@/hooks/queries';
import { useShareAnalytics } from '@/hooks/useShareAnalytics';

function DashboardHeader({ onRevokeAll }: { onRevokeAll: () => void }) {
  return (
    <div className="border-border bg-card/30 border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Repository Sharing</h1>
          <p className="text-muted-foreground text-sm">
            Share private repositories securely with external collaborators
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRevokeAll}
            className="text-destructive hover:text-destructive"
          >
            <Shield className="mr-2 h-4 w-4" />
            Revoke All
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { data: repos, isLoading: isReposLoading, isError: isReposError } = useReposQuery();
  const shareManagement = useShareManagement();
  const repositorySearch = useRepositorySearch(repos ?? []);
  const { data: githubProfile } = useGithubProfileQuery();

  const analytics = useShareAnalytics(shareManagement.shares);

  const handleShareRepository = useCallback(
    (repository: Repository, email: string, expirationDays: number, viewLimit: number) => {
      shareManagement.createShare({
        repoOwner: repository.owner.login,
        repoName: repository.name,
        sharedWith: email,
        expirationDays: expirationDays,
        viewLimit: viewLimit,
      });
      toast.success('Repository shared successfully', {
        description: `${repository.name} has been shared with ${email}`,
      });
    },
    [shareManagement]
  );

  const openShareDialog = useCallback((repository: Repository) => {
    setSelectedRepo(repository);
    setIsShareDialogOpen(true);
  }, []);

  const closeShareDialog = useCallback(() => {
    setIsShareDialogOpen(false);
    setSelectedRepo(null);
  }, []);

  const handleRevokeAllShares = useCallback(() => {
    toast.error('All shares revoked', {
      description: 'All active shares have been invalidated',
    });
  }, []);

  return (
    <div className="bg-background flex h-screen">
      <Sidebar profile={githubProfile} analytics={analytics} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onRevokeAll={handleRevokeAllShares} />

        <div className="flex-1 space-y-6 overflow-auto p-6">
          <RepositorySearchSection
            isLoading={isReposLoading}
            isError={isReposError}
            searchQuery={repositorySearch.searchQuery}
            onSearchChange={repositorySearch.setSearchQuery}
            sortBy={repositorySearch.sortBy}
            onSortChange={repositorySearch.setSortBy}
            languageFilter={repositorySearch.languageFilter}
            onLanguageFilterChange={repositorySearch.setLanguageFilter}
            availableLanguages={repositorySearch.availableLanguages}
            hasSearchQuery={repositorySearch.hasSearchQuery}
            filteredRepositories={repositorySearch.filteredRepositories}
            onRepositoryShare={openShareDialog}
          />

          <ShareTable shares={shareManagement.shares} repositories={repos ?? []} />
        </div>
      </div>

      <ShareDialog
        repository={selectedRepo}
        isOpen={isShareDialogOpen}
        onClose={closeShareDialog}
      />
    </div>
  );
}
