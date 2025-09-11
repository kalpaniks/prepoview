'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Shield, Menu } from 'lucide-react';
import { useRepositorySearch } from '@/hooks/use-repository-search';
import { useShareManagement } from '@/hooks/use-share-management';
import Sidebar from '@/components/share/Sidebar';
import RepositorySearchSection from '@/components/share/RepositorySearchSection';
import ShareDialog from '@/components/share/ShareDialog';
import ShareTable from '@/components/share/ShareTable';
import ConfirmationDialog from '@/components/share/ConfirmationDialog';
import type { Repository } from '@/types/share';
import { useGithubProfileQuery, useReposQuery } from '@/hooks/queries';
import { useShareAnalytics } from '@/hooks/use-share-analytics';
import { revokeGithubAccess } from '@/lib/api/user';
import { signOut } from 'next-auth/react';
import { useMobile } from '@/hooks/use-mobile';

function DashboardHeader({
  onRevokeAll,
  isDeletingAllShares,
  onOpenSidebar,
}: {
  onRevokeAll: () => void;
  isDeletingAllShares: boolean;
  onOpenSidebar: () => void;
}) {
  return (
    <div className="border-border/60 bg-card/40 border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={onOpenSidebar} aria-label="Open sidebar">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRevokeAll}
            className="text-destructive hover:text-destructive"
            disabled={isDeletingAllShares}
          >
            <Shield className="mr-2 h-4 w-4" />
            Revoke Access Token
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isConfirmRevokeAllOpen, setIsConfirmRevokeAllOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMobile();
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

  useEffect(() => {
    if (!isMobile) setIsSidebarOpen(false);
  }, [isMobile]);

  const openShareDialog = useCallback((repository: Repository) => {
    setSelectedRepo(repository);
    setIsShareDialogOpen(true);
  }, []);

  const closeShareDialog = useCallback(() => {
    setIsShareDialogOpen(false);
    setSelectedRepo(null);
  }, []);

  const handleRevokeAllShares = useCallback(() => {
    setIsConfirmRevokeAllOpen(true);
  }, []);

  const confirmRevokeAllShares = useCallback(async () => {
    try {
      await revokeGithubAccess();
      setIsConfirmRevokeAllOpen(false);
      await signOut({ callbackUrl: '/' });
    } catch (e) {}
  }, []);

  return (
    <div className="bg-background flex h-screen">
      <div className="w-0 md:w-72 md:flex-shrink-0">
        <Sidebar
          profile={githubProfile}
          analytics={analytics}
          isLoading={isGithubProfileLoading}
          isFetching={isGithubProfileFetching}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          onRevokeAll={handleRevokeAllShares}
          isDeletingAllShares={shareManagement.isDeletingAllShares}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

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

      <ConfirmationDialog
        isOpen={isConfirmRevokeAllOpen}
        onClose={() => setIsConfirmRevokeAllOpen(false)}
        onConfirm={confirmRevokeAllShares}
        isLoading={false}
        title="Revoke GitHub Access Token?"
        description="This will remove the stored GitHub credentials and sign you out. You can reconnect later from login."
        confirmLabel="Revoke & Sign Out"
        cancelLabel="Cancel"
      />
    </div>
  );
}
