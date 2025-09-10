'use client';
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
import { Trash2, ExternalLink, Copy, GitBranch, Users } from 'lucide-react';
import type { Share, Repository } from '@/types/share';
import {
  getTimeUntilExpiration,
  getViewsUsagePercentage,
  getShareStatusVariant,
  // formatDate,
} from '@/utils/share/helpers';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import ShareDialog from './ShareDialog';

interface ShareTableProps {
  shares: Share[];
  repositories: Repository[];
  onDeleteShare: (id: string) => void;
  isLoading: boolean;
  isFetching: boolean;
}

function EmptyState() {
  return (
    <div className="py-8 text-center">
      <Users className="text-muted-foreground/50 mx-auto mb-3 h-8 w-8" />
      <h3 className="mb-1 font-medium">No shares yet</h3>
      <p className="text-muted-foreground text-sm">
        Search for a repository above to create your first share
      </p>
    </div>
  );
}

function ShareActions({
  share,
  onCopyLink,
  onDeleteShare,
  onEditShare,
}: {
  share: Share;
  onCopyLink: (link: string) => void;
  onDeleteShare: (id: string) => void;
  onEditShare: (share: Share) => void;
}) {
  return (
    <div className="flex translate-x-2 items-center justify-end gap-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onCopyLink(`${window.location.origin}/share/${share.id}`)}
        className="h-8 w-8 p-0"
        title="Copy share link"
      >
        <Copy className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => window.open(`${window.location.origin}/share/${share.id}`, '_blank')}
        className="h-8 w-8 p-0"
        title="Open share link"
      >
        <ExternalLink className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onEditShare(share)}
        className="h-8 w-8 p-0"
        title="Edit share"
      >
        Edit
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onDeleteShare(share.id)}
        className="text-destructive hover:text-destructive h-8 w-8 p-0"
        title="Revoke share"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}

function UsageProgress({ share }: { share: Share }) {
  const percentage = getViewsUsagePercentage(share.viewCount, share.viewLimit);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">
        {share.viewCount}/{share.viewLimit === 1000 ? '∞' : share.viewLimit}
      </span>
      <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function RepositoryInfo({
  repositoryName,
  repositories,
}: {
  repositoryName: string;
  repositories: Repository[];
}) {
  const repository = repositories.find((r) => r.name === repositoryName);

  return (
    <div className="flex items-center gap-2">
      <GitBranch className="text-muted-foreground h-4 w-4" />
      <div>
        <div className="text-sm font-medium">{repositoryName}</div>
        <div className="text-muted-foreground text-xs">{repository?.language || 'Unknown'}</div>
      </div>
    </div>
  );
}

export default function ShareTable({
  shares,
  repositories,
  onDeleteShare,
  isLoading,
  isFetching,
}: ShareTableProps) {
  const [editingShare, setEditingShare] = useState<Share | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCopyShareLink = useCallback((shareLink: string) => {
    try {
      navigator.clipboard.writeText(shareLink);
      toast.success('Link copied', { description: 'Share link copied to clipboard' });
    } catch {
      toast.error('Failed to copy link');
    }
  }, []);

  const handleDeleteShare = useCallback(
    (shareId: string) => {
      onDeleteShare(shareId);
    },
    [onDeleteShare]
  );

  const handleEditShare = useCallback((share: Share) => {
    setEditingShare(share);
    setIsEditOpen(true);
  }, []);

  if (shares.length === 0) {
    return (
      <Card className="bg-card/40 border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Shares</CardTitle>
              <CardDescription>Monitor and manage your repository sharing activity</CardDescription>
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
    <Card className="bg-card/40 border-border/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Shares</CardTitle>
            <CardDescription>Monitor your repository sharing activity</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {shares.filter((s) => s.status === 'active').length} active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isFetching && !isLoading ? (
          <div className="bg-primary/60 absolute inset-x-0 top-0 h-px animate-pulse" aria-hidden />
        ) : null}
        <div className="border-border/60 rounded-sm border px-4 sm:px-6">
          <Table>
            <TableHeader className="px-6">
              <TableRow>
                <TableHead>Repository</TableHead>
                <TableHead>Shared with</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="px-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="hover:bg-transparent">
                      <TableCell colSpan={6}>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : shares.map((share) => (
                    <TableRow key={share.id} className="group">
                      <TableCell>
                        <RepositoryInfo
                          repositoryName={share.repoName}
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
                        <Badge variant={getShareStatusVariant(share)} className="text-xs">
                          {share.status === 'expired'
                            ? 'Expired'
                            : getTimeUntilExpiration(share.expiresAt)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(share.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <ShareActions
                          share={share}
                          onCopyLink={handleCopyShareLink}
                          onDeleteShare={handleDeleteShare}
                          onEditShare={handleEditShare}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <ShareDialog
        editingShare={editingShare}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </Card>
  );
}
