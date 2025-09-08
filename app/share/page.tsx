'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useRepositorySearch } from '@/hooks/use-repository-search';
import { useShareManagement } from '@/hooks/use-share-management';
import { Sidebar, RepositorySearchSection, ShareDialog, ShareTable } from '@/components/share';
import type { Repository } from '@/types/share';
import { useGithubProfileQuery, useReposQuery } from '@/hooks/queries';
import { useShareAnalytics } from '@/hooks/use-share-analytics';

function DashboardHeader({ onRevokeAll }: { onRevokeAll: () => void }) {
  return (
    <div className="border-border/60 bg-card/40 border-b px-6 py-4">
      <div className="flex items-center justify-end">
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
  const {
    data: repos,
    isLoading: isReposLoading,
    isFetching: isReposFetching,
    isError: isReposError,
  } = useReposQuery();
  const shareManagement = useShareManagement();
  const repositorySearch = useRepositorySearch(repos ?? []);

  const {
    data: githubProfile,
    isLoading: isGithubProfileLoading,
    isFetching: isGithubProfileFetching,
  } = useGithubProfileQuery();

  const analytics = useShareAnalytics(shareManagement.shares);

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
      <Sidebar
        profile={githubProfile}
        analytics={analytics}
        isLoading={isGithubProfileLoading}
        isFetching={isGithubProfileFetching}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onRevokeAll={handleRevokeAllShares} />

        <div className="flex-1 space-y-6 overflow-auto p-6">
          <RepositorySearchSection
            isLoading={isReposLoading}
            isFetching={isReposFetching}
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

          <ShareTable
            shares={shareManagement.shares}
            repositories={repos ?? []}
            onDeleteShare={shareManagement.deleteShare}
            isLoading={shareManagement.isLoading}
            isFetching={shareManagement.isFetching}
          />
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
