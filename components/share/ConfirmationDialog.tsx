import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke all shares?</DialogTitle>
          <DialogDescription>
            This will permanently revoke access to all your active shares. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Revoking…' : 'Revoke All'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
