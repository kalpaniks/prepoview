/**
 * Share creation dialog component
 * @fileoverview Modal dialog for configuring repository sharing settings
 */

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

interface ShareDialogProps {
  /** Repository to share (null when dialog is closed) */
  repository: Repository | null;
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Callback when share is created */
  onShare: (repo: Repository, email: string, expirationDays: number, viewLimit: number) => void;
}

/**
 * Repository Preview Component
 * Shows repository details in the share dialog
 */
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

/**
 * Share Dialog Component
 * Modal for configuring repository sharing with validation
 */
export default function ShareDialog({ repository, isOpen, onClose, onShare }: ShareDialogProps) {
  const [shareEmail, setShareEmail] = useState('');
  const [expirationDays, setExpirationDays] = useState(DEFAULT_SHARE_CONFIG.expirationDays);
  const [viewLimit, setViewLimit] = useState(DEFAULT_SHARE_CONFIG.viewLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates email format
   */
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /**
   * Handles form submission
   */
  const handleShare = async () => {
    if (!repository || !shareEmail.trim() || !isValidEmail(shareEmail.trim())) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const viewLimitNumber = viewLimit === 'unlimited' ? 1000 : Number.parseInt(viewLimit);
    onShare(repository, shareEmail.trim(), Number.parseInt(expirationDays), viewLimitNumber);

    // Reset form
    setShareEmail('');
    setExpirationDays(DEFAULT_SHARE_CONFIG.expirationDays);
    setViewLimit(DEFAULT_SHARE_CONFIG.viewLimit);
    setIsSubmitting(false);
    onClose();
  };

  /**
   * Handles dialog close with form reset
   */
  const handleClose = () => {
    if (!isSubmitting) {
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
          <DialogDescription>
            Configure sharing settings for "{repository?.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
            {shareEmail.trim() && !isValidEmail(shareEmail.trim()) && (
              <p className="text-xs text-destructive">Please enter a valid email address</p>
            )}
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiration">Access Duration</Label>
              <Select
                value={expirationDays}
                onValueChange={setExpirationDays}
                disabled={isSubmitting}
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
              <Select
                value={viewLimit}
                onValueChange={setViewLimit}
                disabled={isSubmitting}
              >
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

          {/* Repository Preview */}
          {repository && <RepositoryPreview repository={repository} />}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={!isFormValid || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Creating...' : 'Create Share'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
