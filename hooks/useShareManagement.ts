import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateShareRequest, Share } from '@/types/share';
import {
  createShare,
  updateShare,
  deleteShare,
  fetchUserShares,
  fetchShare,
} from '@/lib/api/share';
import { validateShareRequest } from '@/services/shareService';
import { toast } from 'sonner';

/**
 * Custom hook for fetching user shares
 */
export function useFetchShares() {
  return useQuery({
    queryKey: ['shares'],
    queryFn: fetchUserShares,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Custom hook for fetching a single share
 */
export function useFetchShare(id: string) {
  return useQuery({
    queryKey: ['share', id],
    queryFn: () => fetchShare(id),
    enabled: !!id,
  });
}

/**
 * Custom hook for creating a share
 */
export function useCreateShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shareData: CreateShareRequest) => {
      const validation = validateShareRequest(shareData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
      return createShare(shareData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
      toast.success('Share created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create share: ${error.message}`);
    },
  });
}

/**
 * Custom hook for updating a share
 */
export function useUpdateShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Share> }) =>
      updateShare(id, updates),
    onSuccess: (updatedShare) => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
      queryClient.setQueryData(['share', updatedShare.id.toString()], updatedShare);
      toast.success('Share updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update share: ${error.message}`);
    },
  });
}

/**
 * Custom hook for deleting a share
 */
export function useDeleteShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteShare(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['shares'] });
      queryClient.removeQueries({ queryKey: ['share', deletedId.toString()] });
      toast.success('Share deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete share: ${error.message}`);
    },
  });
}

/**
 * Custom hook for share management operations
 * Combines all share operations in one hook for convenience
 */
export function useShareManagement() {
  const sharesQuery = useFetchShares();
  const createShareMutation = useCreateShare();
  const updateShareMutation = useUpdateShare();
  const deleteShareMutation = useDeleteShare();

  return {
    shares: sharesQuery.data || [],
    isLoading: sharesQuery.isLoading,
    error: sharesQuery.error,
    createShare: createShareMutation.mutate,
    updateShare: updateShareMutation.mutate,
    deleteShare: deleteShareMutation.mutate,
    isCreating: createShareMutation.isPending,
    isUpdating: updateShareMutation.isPending,
    isDeleting: deleteShareMutation.isPending,
    refetch: sharesQuery.refetch,
  };
}
