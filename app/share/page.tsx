'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Shield,
  Clock,
  Users,
  GitBranch,
  Star,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for repositories
const mockRepositories = [
  {
    id: 1,
    name: 'private-api-service',
    description: 'Internal API service for customer management',
    language: 'TypeScript',
    stars: 12,
    isPrivate: true,
    updatedAt: '2 hours ago',
  },
  {
    id: 2,
    name: 'secret-ml-model',
    description: 'Machine learning model for predictive analytics',
    language: 'Python',
    stars: 8,
    isPrivate: true,
    updatedAt: '1 day ago',
  },
  {
    id: 3,
    name: 'internal-dashboard',
    description: 'Company internal dashboard and analytics',
    language: 'React',
    stars: 15,
    isPrivate: true,
    updatedAt: '3 days ago',
  },
  {
    id: 4,
    name: 'config-manager',
    description: 'Configuration management system',
    language: 'Go',
    stars: 5,
    isPrivate: true,
    updatedAt: '1 week ago',
  },
];

// Mock data for active shares
const mockShares = [
  {
    id: 1,
    repositoryName: 'private-api-service',
    sharedWith: 'john.doe@company.com',
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    viewLimit: 10,
    viewCount: 3,
    shareLink: 'https://share.repo.com/abc123',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 2,
    repositoryName: 'secret-ml-model',
    sharedWith: 'jane.smith@partner.com',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    viewLimit: 5,
    viewCount: 1,
    shareLink: 'https://share.repo.com/def456',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

export default function SharePage() {
  const [shares, setShares] = useState(mockShares);
  const [selectedRepo, setSelectedRepo] = useState<(typeof mockRepositories)[0] | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [expirationDays, setExpirationDays] = useState('7');
  const [viewLimit, setViewLimit] = useState('10');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  // Use next-themes for production-ready theme management
  const { theme, setTheme, resolvedTheme } = useTheme();

  const handleShareRepository = () => {
    if (!selectedRepo || !shareEmail) return;

    const newShare = {
      id: shares.length + 1,
      repositoryName: selectedRepo.name,
      sharedWith: shareEmail,
      expiresAt: new Date(Date.now() + Number.parseInt(expirationDays) * 24 * 60 * 60 * 1000),
      viewLimit: Number.parseInt(viewLimit),
      viewCount: 0,
      shareLink: `https://share.repo.com/${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    setShares([...shares, newShare]);
    setIsShareDialogOpen(false);
    setShareEmail('');
    setSelectedRepo(null);

    toast.success('Repository shared successfully', {
      description: `${selectedRepo.name} has been shared with ${shareEmail}`,
    });
  };

  const handleDeleteShare = (shareId: number) => {
    setShares(shares.filter((share) => share.id !== shareId));
    toast.success('Share deleted', {
      description: 'The repository share has been revoked',
    });
  };

  const handleCopyShareLink = (shareLink: string) => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied', {
      description: 'Share link has been copied to clipboard',
    });
  };

  const handleRevokeAccessToken = () => {
    // Clear all shares when access token is revoked
    setShares([]);
    toast.error('Access token revoked', {
      description: 'All active shares have been invalidated',
    });
  };

  const getTimeUntilExpiration = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Expired';
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold">Repository Sharing Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Securely share your private repositories with controlled access and time limits
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <Button
              variant="destructive"
              onClick={handleRevokeAccessToken}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Revoke Access Token
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Private Repositories</CardTitle>
              <GitBranch className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockRepositories.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Shares</CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shares.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {shares.reduce((acc, share) => acc + share.viewCount, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Clock className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  shares.filter(
                    (share) => share.expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Repository List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Private Repositories</CardTitle>
            <CardDescription>
              Select a repository to share with external collaborators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {mockRepositories.map((repo) => (
                <Card key={repo.id} className="hover:border-primary/50 border-2 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{repo.name}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Private
                      </Badge>
                    </div>
                    <CardDescription>{repo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          {repo.language}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {repo.stars}
                        </span>
                        <span>Updated {repo.updatedAt}</span>
                      </div>
                      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedRepo(repo)}>
                            Share
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Share Repository</DialogTitle>
                            <DialogDescription>
                              Share "{selectedRepo?.name}" with controlled access and time limits
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="colleague@company.com"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="expiration">Expiration</Label>
                              <Select value={expirationDays} onValueChange={setExpirationDays}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 day</SelectItem>
                                  <SelectItem value="3">3 days</SelectItem>
                                  <SelectItem value="7">1 week</SelectItem>
                                  <SelectItem value="14">2 weeks</SelectItem>
                                  <SelectItem value="30">1 month</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="viewLimit">View Limit</Label>
                              <Select value={viewLimit} onValueChange={setViewLimit}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 view</SelectItem>
                                  <SelectItem value="5">5 views</SelectItem>
                                  <SelectItem value="10">10 views</SelectItem>
                                  <SelectItem value="25">25 views</SelectItem>
                                  <SelectItem value="100">100 views</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleShareRepository} disabled={!shareEmail}>
                              Create Share Link
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Shares Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Shares</CardTitle>
            <CardDescription>
              Manage your active repository shares and monitor access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shares.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No active shares yet</p>
                <p className="text-sm">Share a repository to see it here</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repository</TableHead>
                    <TableHead>Shared With</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Expires In</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shares.map((share) => (
                    <TableRow key={share.id}>
                      <TableCell className="font-medium">{share.repositoryName}</TableCell>
                      <TableCell>{share.sharedWith}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>
                            {share.viewCount}/{share.viewLimit}
                          </span>
                          <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
                            <div
                              className="bg-primary h-full rounded-full transition-all"
                              style={{
                                width: `${(share.viewCount / share.viewLimit) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            share.expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {getTimeUntilExpiration(share.expiresAt)}
                        </Badge>
                      </TableCell>
                      <TableCell>{share.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyShareLink(share.shareLink)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(share.shareLink, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteShare(share.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
