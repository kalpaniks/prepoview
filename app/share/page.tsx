'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  GitBranch,
  Clock,
  Share2,
  Trash2,
  Copy,
  Settings,
  Shield,
  Calendar,
  Users,
  Eye,
  GitFork,
} from 'lucide-react';

// Type definitions for our data structures
interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  isPrivate: boolean;
  language: string;
  stars: number;
  forks: number;
}

interface ShareItem {
  id: string;
  repoName: string;
  repoOwner: string;
  createdAt: string;
  expiresAt?: string;
  views: number;
  shareUrl: string;
}

// Mock data for repositories (you'll replace this with real GitHub API calls)
const mockRepositories: Repository[] = [
  {
    id: '1',
    name: 'awesome-nextjs-app',
    owner: 'johndoe',
    description: 'A production-ready Next.js application with TypeScript',
    isPrivate: true,
    language: 'TypeScript',
    stars: 45,
    forks: 8,
  },
  {
    id: '2',
    name: 'react-dashboard',
    owner: 'johndoe',
    description: 'Modern React dashboard with shadcn/ui',
    isPrivate: false,
    language: 'JavaScript',
    stars: 123,
    forks: 34,
  },
  {
    id: '3',
    name: 'api-microservice',
    owner: 'johndoe',
    description: 'Scalable Node.js microservice architecture',
    isPrivate: true,
    language: 'TypeScript',
    stars: 67,
    forks: 15,
  },
];

// Mock data for active shares
const mockActiveShares: ShareItem[] = [
  {
    id: 'share_1',
    repoName: 'awesome-nextjs-app',
    repoOwner: 'johndoe',
    createdAt: '2024-01-15T10:30:00Z',
    expiresAt: '2024-01-22T10:30:00Z',
    views: 24,
    shareUrl: 'https://yourapp.com/share/share_1',
  },
  {
    id: 'share_2',
    repoName: 'react-dashboard',
    repoOwner: 'johndoe',
    createdAt: '2024-01-10T14:20:00Z',
    views: 56,
    shareUrl: 'https://yourapp.com/share/share_2',
  },
];

const DURATION_OPTIONS = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: 'never', label: 'Never Expires' },
];

export default function SharePage() {
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [activeShares, setActiveShares] = useState<ShareItem[]>(mockActiveShares);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareToDelete, setShareToDelete] = useState<string | null>(null);

  // Function to handle sharing a repository
  const handleShareRepository = async () => {
    if (!selectedRepo || !selectedDuration) {
      alert('Please select both repository and duration');
      return;
    }

    setIsLoading(true);

    // Simulate API call - you'll replace this with actual implementation
    setTimeout(() => {
      const newShare: ShareItem = {
        id: `share_${Date.now()}`,
        repoName: mockRepositories.find((r) => r.id === selectedRepo)?.name || '',
        repoOwner: mockRepositories.find((r) => r.id === selectedRepo)?.owner || '',
        createdAt: new Date().toISOString(),
        expiresAt:
          selectedDuration === 'never'
            ? undefined
            : new Date(Date.now() + getDurationInMs(selectedDuration)).toISOString(),
        views: 0,
        shareUrl: `https://yourapp.com/share/share_${Date.now()}`,
      };

      setActiveShares((prev) => [newShare, ...prev]);
      setSelectedRepo('');
      setSelectedDuration('');
      setIsLoading(false);
    }, 1000);
  };

  // Helper function to convert duration to milliseconds
  const getDurationInMs = (duration: string): number => {
    const durations: Record<string, number> = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    return durations[duration] || 0;
  };

  // Function to copy share URL to clipboard
  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    // You can add a toast notification here
  };

  // Function to delete a share
  const handleDeleteShare = async (shareId: string) => {
    setActiveShares((prev) => prev.filter((share) => share.id !== shareId));
    setDeleteDialogOpen(false);
    setShareToDelete(null);
  };

  // Function to revoke all tokens (you'll implement this)
  const handleRevokeTokens = () => {
    console.log('Revoking all GitHub tokens...');
    // Implement token revocation logic
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Share2 className="text-primary h-6 w-6" />
              <div>
                <h1 className="text-foreground text-2xl font-semibold">Repository Sharing</h1>
                <p className="text-muted-foreground text-sm">
                  Securely share your private repositories
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleRevokeTokens} className="text-destructive">
                  <Shield className="mr-2 h-4 w-4" />
                  Revoke GitHub Token
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create New Share Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>Create New Share</span>
              </CardTitle>
              <CardDescription>
                Share a repository with controlled access and expiration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Repository Selection */}
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Select Repository</label>
                <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a repository to share" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRepositories.map((repo) => (
                      <SelectItem key={repo.id} value={repo.id}>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <GitFork className="text-muted-foreground h-4 w-4" />
                            <span className="font-medium">
                              {repo.owner}/{repo.name}
                            </span>
                            {repo.isPrivate && (
                              <Badge variant="secondary" className="text-xs">
                                Private
                              </Badge>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Repository Details */}
                {selectedRepo && (
                  <div className="bg-muted mt-3 rounded-md p-3">
                    {(() => {
                      const repo = mockRepositories.find((r) => r.id === selectedRepo);
                      return repo ? (
                        <div className="space-y-2">
                          <p className="text-muted-foreground text-sm">{repo.description}</p>
                          <div className="text-muted-foreground flex items-center space-x-4 text-xs">
                            <span className="flex items-center space-x-1">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span>{repo.language}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{repo.stars}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <GitFork className="h-3 w-3" />
                              <span>{repo.forks}</span>
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Duration Selection */}
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Share Duration</label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="How long should this share be active?" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <Clock className="text-muted-foreground h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Share Button */}
              <Button
                onClick={handleShareRepository}
                disabled={!selectedRepo || !selectedDuration || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    <span>Creating Share...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-4 w-4" />
                    <span>Create Share Link</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Sharing Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-foreground text-2xl font-bold">{activeShares.length}</div>
                  <div className="text-muted-foreground text-sm">Active Shares</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-foreground text-2xl font-bold">
                    {activeShares.reduce((sum, share) => sum + share.views, 0)}
                  </div>
                  <div className="text-muted-foreground text-sm">Total Views</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Shares Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Active Shares</span>
            </CardTitle>
            <CardDescription>Manage your currently shared repositories</CardDescription>
          </CardHeader>
          <CardContent>
            {activeShares.length === 0 ? (
              <Alert>
                <Share2 className="h-4 w-4" />
                <AlertDescription>
                  No active shares yet. Create your first share above to get started.
                </AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeShares.map((share) => (
                    <TableRow key={share.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <GitBranch className="text-muted-foreground h-4 w-4" />
                          <div>
                            <div className="font-medium">
                              {share.repoOwner}/{share.repoName}
                            </div>
                            <div className="text-muted-foreground text-sm">ID: {share.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatRelativeTime(share.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        {share.expiresAt ? (
                          <Badge variant="outline" className="text-xs">
                            {formatRelativeTime(share.expiresAt)}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Never
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Eye className="text-muted-foreground h-3 w-3" />
                          <span className="text-sm">{share.views}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(share.shareUrl)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Dialog
                            open={deleteDialogOpen && shareToDelete === share.id}
                            onOpenChange={(open) => {
                              setDeleteDialogOpen(open);
                              if (!open) setShareToDelete(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShareToDelete(share.id)}
                              >
                                <Trash2 className="text-destructive h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Share</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this share? This action cannot be
                                  undone and will immediately revoke access for anyone with the
                                  link.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setDeleteDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeleteShare(share.id)}
                                >
                                  Delete Share
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
