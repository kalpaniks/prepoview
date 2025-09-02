import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

type CreateSharePayload = {
  repoOwner: string;
  repoName: string;
  expiresAt: Date;
  viewLimit: number;
  sharedWith: string;
};

export default function ShareDialog({ repository, isOpen, onClose }: ShareDialogProps) {
  const [shareEmail, setShareEmail] = useState('');
  const [days, setDays] = useState<string>(String(DEFAULT_SHARE_CONFIG.expirationDays));
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('0');
  const [viewLimitInput, setViewLimitInput] = useState<string>(
    String(DEFAULT_SHARE_CONFIG.viewLimit)
  );
  const mutateShare = useCreateShare();
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const calculateExpirationDate = (days: number, hours: number, minutes: number) => {
    const expirationDate = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000
    );
    return expirationDate;
  };

  const handleShare = async () => {
    if (!repository || !shareEmail.trim() || !isValidEmail(shareEmail.trim())) {
      return;
    }
    const Days = Number(days);
    const Hours = Number(hours);
    const Minutes = Number(minutes);
    const expiresAt = calculateExpirationDate(Days, Hours, Minutes);
    const viewLimit = Number(viewLimitInput);

    const share: CreateSharePayload = {
      repoOwner: repository.owner.login,
      repoName: repository.name,
      expiresAt,
      viewLimit,
      sharedWith: shareEmail.trim(),
    };

    // @ts-expect-error - createShare currently expects different shape; server will map expiresAt
    mutateShare.mutate(share);
  };

  const handleClose = () => {
    if (!mutateShare.isPending) {
      setShareEmail('');
      setDays(String(DEFAULT_SHARE_CONFIG.expirationDays));
      setHours('0');
      setMinutes('0');
      setViewLimitInput(String(DEFAULT_SHARE_CONFIG.viewLimit));
      onClose();
    }
  };

  const isFormValid = !!(shareEmail.trim() && isValidEmail(shareEmail.trim()));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Repository</DialogTitle>
          <DialogDescription>
            Configure sharing settings for &quot;{repository?.name}&quot;
          </DialogDescription>
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
            <div className="col-span-2 space-y-2">
              <Label>Access Duration (Days : Hours : Minutes)</Label>
              <div className="flex items-center gap-2">
                <Input
                  inputMode="numeric"
                  type="number"
                  min={0}
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  disabled={mutateShare.isPending}
                  placeholder="Days"
                  className="w-24"
                />
                <span>:</span>
                <Input
                  inputMode="numeric"
                  type="number"
                  min={0}
                  max={23}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  disabled={mutateShare.isPending}
                  placeholder="Hours"
                  className="w-24"
                />
                <span>:</span>
                <Input
                  inputMode="numeric"
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  disabled={mutateShare.isPending}
                  placeholder="Minutes"
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="viewLimit">View Limit</Label>
              <Input
                id="viewLimit"
                inputMode="numeric"
                type="number"
                min={1}
                value={viewLimitInput}
                onChange={(e) => setViewLimitInput(e.target.value)}
                disabled={mutateShare.isPending}
                placeholder="e.g. 5"
              />
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
