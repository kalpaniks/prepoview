/**
 * Repository Sharing Dashboard Page
 * @fileoverview Main page component for the repository sharing dashboard
 */

'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

// Organized imports from our new structure
import { useRepositorySearch, useShareManagement } from '@/hooks/share';
import { Sidebar, RepositorySearchSection, ShareDialog, ShareTable } from '@/components/share';
import { MOCK_REPOSITORIES, MOCK_SHARES, MOCK_GITHUB_PROFILE } from '@/utils/share';
import type { Repository } from '@/types/share';

/**
 * Dashboard Header Component
 * Header section with title and global actions
 */
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

/**
 * Main Share Dashboard Page Component
 * Orchestrates the entire sharing dashboard experience
 */
export default function SharePage() {
  // Dialog state
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Custom hooks for state management
  const shareManagement = useShareManagement(MOCK_SHARES);
  const repositorySearch = useRepositorySearch(MOCK_REPOSITORIES);

  /**
   * Handles repository sharing workflow
   */
  const handleShareRepository = useCallback(
    (repository: Repository, email: string, expirationDays: number, viewLimit: number) => {
      shareManagement.createShare(repository, email, expirationDays, viewLimit);

      toast.success('Repository shared successfully', {
        description: `${repository.name} has been shared with ${email}`,
      });
    },
    [shareManagement.createShare]
  );

  /**
   * Handles share deletion with confirmation toast
   */
  const handleDeleteShare = useCallback(
    (shareId: number) => {
      shareManagement.deleteShare(shareId);
      toast.success('Share revoked', {
        description: 'Repository access has been revoked',
      });
    },
    [shareManagement.deleteShare]
  );

  /**
   * Handles copying share link to clipboard
   */
  const handleCopyShareLink = useCallback((shareLink: string) => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied', {
      description: 'Share link copied to clipboard',
    });
  }, []);

  /**
   * Opens share dialog for a specific repository
   */
  const openShareDialog = useCallback((repository: Repository) => {
    setSelectedRepo(repository);
    setIsShareDialogOpen(true);
  }, []);

  /**
   * Closes share dialog and resets state
   */
  const closeShareDialog = useCallback(() => {
    setIsShareDialogOpen(false);
    setSelectedRepo(null);
  }, []);

  /**
   * Handles revoking all shares with confirmation
   */
  const handleRevokeAllShares = useCallback(() => {
    shareManagement.revokeAllShares();
    toast.error('All shares revoked', {
      description: 'All active shares have been invalidated',
    });
  }, [shareManagement.revokeAllShares]);

  return (
    <div className="bg-background flex h-screen">
      {/* Enhanced Sidebar with GitHub Profile */}
      <Sidebar profile={MOCK_GITHUB_PROFILE} analytics={shareManagement.analytics} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader onRevokeAll={handleRevokeAllShares} />

        {/* Main Content */}
        <div className="flex-1 space-y-6 overflow-auto p-6">
          {/* Repository Search Section */}
          <RepositorySearchSection
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

          {/* Active Shares Table */}
          <ShareTable
            shares={shareManagement.shares}
            repositories={MOCK_REPOSITORIES}
            onDeleteShare={handleDeleteShare}
            onCopyShareLink={handleCopyShareLink}
          />
        </div>
      </div>

      {/* Share Configuration Dialog */}
      <ShareDialog
        repository={selectedRepo}
        isOpen={isShareDialogOpen}
        onClose={closeShareDialog}
        onShare={handleShareRepository}
      />
    </div>
  );
}
