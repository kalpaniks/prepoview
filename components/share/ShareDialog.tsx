import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import { GitBranch } from 'lucide-react';
import type { Repository } from '@/types/share';
import { DEFAULT_SHARE_CONFIG } from '@/utils/share/constants';
import { useCreateShare } from '@/hooks/useShareManagement';

interface ShareDialogProps {
  repository: Repository | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (repo: Repository, email: string, expirationDays: number, viewLimit: number) => void;
}

function RepositoryPreview({ repository }: { repository: Repository }) {
  return (
    <div className="bg-muted/50 border-border/50 rounded-lg border p-3">
      <div className="flex items-center gap-2 text-sm">
        <GitBranch className="text-muted-foreground h-4 w-4" />
        <span className="font-medium">{repository.name}</span>
        <Badge variant="outline" className="text-xs">
          {repository.language}
        </Badge>
      </div>
      <p className="text-muted-foreground mt-1 text-xs">{repository.description}</p>
    </div>
  );
}

export default function ShareDialog({ repository, isOpen, onClose, onShare }: ShareDialogProps) {
  const [shareEmail, setShareEmail] = useState('');
  const [expirationDays, setExpirationDays] = useState(DEFAULT_SHARE_CONFIG.expirationDays);
  const [viewLimit, setViewLimit] = useState(DEFAULT_SHARE_CONFIG.viewLimit);
  const mutateShare = useCreateShare();
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleShare = async () => {
    if (!repository || !shareEmail.trim() || !isValidEmail(shareEmail.trim())) {
      return;
    }
    const share = {
      repoOwner: repository.owner.login,
      repoName: repository.name,
      expirationDays: Number.parseInt(expirationDays),
      viewLimit: Number.parseInt(viewLimit),
      sharedWith: shareEmail.trim(),
    };
    mutateShare.mutate(share);
  };

  const handleClose = () => {
    if (!mutateShare.isPending) {
      setShareEmail('');
      setExpirationDays(DEFAULT_SHARE_CONFIG.expirationDays);
      setViewLimit(DEFAULT_SHARE_CONFIG.viewLimit);
      onClose();
    }
  };

  const isFormValid = shareEmail.trim() && isValidEmail(shareEmail.trim());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Repository</DialogTitle>
          <DialogDescription>Configure sharing settings for "{repository?.name}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full"
              disabled={mutateShare.isPending}
            />
            {shareEmail.trim() && !isValidEmail(shareEmail.trim()) && (
              <p className="text-destructive text-xs">Please enter a valid email address</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiration">Access Duration</Label>
              <Select
                value={expirationDays}
                disabled={mutateShare.isPending}
              >
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

            <div className="space-y-2">
              <Label htmlFor="viewLimit">View Limit</Label>
              <Select value={viewLimit} disabled={mutateShare.isPending}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 view</SelectItem>
                  <SelectItem value="5">5 views</SelectItem>
                  <SelectItem value="10">10 views</SelectItem>
                  <SelectItem value="25">25 views</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {repository && <RepositoryPreview repository={repository} />}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={mutateShare.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={!isFormValid || mutateShare.isPending}
            className="min-w-[120px]"
          >
            {mutateShare.isPending ? 'Creating...' : 'Create Share'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
