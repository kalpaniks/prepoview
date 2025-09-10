import { useEffect, useMemo, useState } from 'react';
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
import type { Repository, Share } from '@/types/share';
import { DEFAULT_SHARE_CONFIG } from '@/utils/share/constants';
import { useCreateShare, useUpdateShare } from '@/hooks/use-share-management';

interface ShareDialogProps {
  repository?: Repository | null; // create mode when provided
  editingShare?: Share | null; // update mode when provided
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
      {repository.description && (
        <p className="text-muted-foreground mt-1 text-xs">{repository.description}</p>
      )}
    </div>
  );
}

export default function ShareDialog({
  repository = null,
  editingShare = null,
  isOpen,
  onClose,
}: ShareDialogProps) {
  const isEditMode = !!editingShare;
  const createMutation = useCreateShare();
  const updateMutation = useUpdateShare();

  const [recipientName, setRecipientName] = useState('');
  const [days, setDays] = useState<string>(String(DEFAULT_SHARE_CONFIG.expirationDays));
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('0');
  const [viewLimitInput, setViewLimitInput] = useState<string>(
    String(DEFAULT_SHARE_CONFIG.viewLimit)
  );

  useEffect(() => {
    if (isEditMode && editingShare) {
      const now = Date.now();
      const expiresAt = editingShare.expiresAt ? new Date(editingShare.expiresAt) : null;
      const remaining = expiresAt ? Math.max(0, expiresAt.getTime() - now) : 0;
      const d = Math.floor(remaining / (24 * 60 * 60 * 1000));
      const h = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const m = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      setDays(String(d));
      setHours(String(h));
      setMinutes(String(m));
      setViewLimitInput(String(editingShare.viewLimit));
      setRecipientName(editingShare.sharedWith || '');
    }
  }, [isEditMode, editingShare]);

  const calculateExpirationDate = (d: number, h: number, m: number) => {
    const expirationDate = new Date(
      Date.now() + d * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000 + m * 60 * 1000
    );
    return expirationDate;
  };

  const isCreateFormValid = !!(recipientName.trim() && repository);
  const disabled = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async () => {
    const d = Number(days);
    const h = Number(hours);
    const m = Number(minutes);
    const expiresAt = calculateExpirationDate(d, h, m);
    const viewLimit = Number(viewLimitInput);

    if (isEditMode && editingShare) {
      updateMutation.mutate({
        id: editingShare.id,
        updates: { expiresAt: expiresAt, viewLimit },
      });
      return;
    }

    if (!repository || !isCreateFormValid) return;

    const payload = {
      repoOwner: repository.owner.login,
      repoName: repository.name,
      expiresAt,
      viewLimit,
      sharedWith: recipientName.trim(),
    };
    // @ts-expect-error - TODO: fix this
    createMutation.mutate(payload);
  };

  const handleClose = () => {
    if (disabled) return;
    setRecipientName('');
    setDays(String(DEFAULT_SHARE_CONFIG.expirationDays));
    setHours('0');
    setMinutes('0');
    setViewLimitInput(String(DEFAULT_SHARE_CONFIG.viewLimit));
    onClose();
  };

  const title = isEditMode ? 'Update Share' : 'Share Repository';
  const description = isEditMode
    ? `Adjust settings for share ${editingShare?.repoName}`
    : `Configure sharing settings for "${repository?.name}"`;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="recipient">Enter Recipient Name</Label>
              <Input
                id="recipient"
                type="text"
                placeholder="Recipient name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full"
                disabled={disabled}
              />
            </div>
          )}

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
                  disabled={disabled}
                  placeholder="Days"
                  className="w-20"
                />
                <span>:</span>
                <Input
                  inputMode="numeric"
                  type="number"
                  min={0}
                  max={23}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  disabled={disabled}
                  placeholder="Hours"
                  className="w-20"
                />
                <span>:</span>
                <Input
                  inputMode="numeric"
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  disabled={disabled}
                  placeholder="Minutes"
                  className="w-20"
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
                disabled={disabled}
                placeholder="e.g. 5"
              />
            </div>
          </div>
          {!isEditMode && repository && <RepositoryPreview repository={repository} />}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={disabled}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isEditMode ? disabled : !isCreateFormValid || disabled}
            className="min-w-[120px]"
          >
            {disabled
              ? isEditMode
                ? 'Saving...'
                : 'Creating...'
              : isEditMode
                ? 'Save Changes'
                : 'Create Share'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
