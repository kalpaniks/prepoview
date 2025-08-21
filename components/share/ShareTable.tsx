/**
 * Share management table component
 * @fileoverview Displays and manages active repository shares in a table format
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Trash2,
  ExternalLink,
  Copy,
  GitBranch,
  Users,
} from 'lucide-react';
import type { Share, Repository } from '@/types/share';
import {
  getTimeUntilExpiration,
  getViewsUsagePercentage,
  getShareStatusVariant,
  formatDate
} from '@/utils/share/helpers';

interface ShareTableProps {
  /** Array of shares to display */
  shares: Share[];
  /** Array of repositories for additional context */
  repositories: Repository[];
  /** Callback when share is deleted */
  onDeleteShare: (shareId: number) => void;
  /** Callback when share link is copied */
  onCopyShareLink: (shareLink: string) => void;
}

/**
 * Empty State Component
 * Shown when there are no shares to display
 */
function EmptyState() {
  return (
    <div className="text-center py-8">
      <Users className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
      <h3 className="font-medium mb-1">No shares yet</h3>
      <p className="text-sm text-muted-foreground">
        Search for a repository above to create your first share
      </p>
    </div>
  );
}

/**
 * Share Actions Component
 * Action buttons for each share row (copy, open, delete)
 */
function ShareActions({
  share,
  onCopyLink,
  onDelete
}: {
  share: Share;
  onCopyLink: (link: string) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex translate-x-2 items-center justify-end gap-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onCopyLink(share.shareLink)}
        className="h-8 w-8 p-0"
        title="Copy share link"
      >
        <Copy className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => window.open(share.shareLink, '_blank')}
        className="h-8 w-8 p-0"
        title="Open share link"
      >
        <ExternalLink className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onDelete(share.id)}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        title="Revoke share"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

/**
 * Usage Progress Component
 * Shows view count progress bar
 */
function UsageProgress({ share }: { share: Share }) {
  const percentage = getViewsUsagePercentage(share.viewCount, share.viewLimit);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">
        {share.viewCount}/{share.viewLimit === 1000 ? '∞' : share.viewLimit}
      </span>
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Repository Info Component
 * Shows repository name and language in table cell
 */
function RepositoryInfo({
  repositoryName,
  repositories
}: {
  repositoryName: string;
  repositories: Repository[];
}) {
  const repository = repositories.find(r => r.name === repositoryName);

  return (
    <div className="flex items-center gap-2">
      <GitBranch className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="font-medium text-sm">{repositoryName}</div>
        <div className="text-xs text-muted-foreground">
          {repository?.language || 'Unknown'}
        </div>
      </div>
    </div>
  );
}

/**
 * Share Table Component
 * Main table component for displaying and managing repository shares
 */
export default function ShareTable({
  shares,
  repositories,
  onDeleteShare,
  onCopyShareLink
}: ShareTableProps) {
  if (shares.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Shares</CardTitle>
              <CardDescription>
                Monitor and manage your repository sharing activity
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">
              0 active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Active Shares</CardTitle>
            <CardDescription>
              Monitor and manage your repository sharing activity
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {shares.filter(s => s.status === 'active').length} active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Repository</TableHead>
                <TableHead>Shared with</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shares.map((share) => (
                <TableRow key={share.id} className="group">
                  <TableCell>
                    <RepositoryInfo
                      repositoryName={share.repositoryName}
                      repositories={repositories}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{share.sharedWith}</div>
                  </TableCell>
                  <TableCell>
                    <UsageProgress share={share} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getShareStatusVariant(share)}
                      className="text-xs"
                    >
                      {share.status === 'expired'
                        ? 'Expired'
                        : getTimeUntilExpiration(share.expiresAt)
                      }
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(share.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ShareActions
                      share={share}
                      onCopyLink={onCopyShareLink}
                      onDelete={onDeleteShare}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
