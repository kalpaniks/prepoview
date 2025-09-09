import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { queryKeys } from '@/lib/queryKeys';

export function useFetchShares() {
  return useQuery({
    queryKey: queryKeys.shares,
    queryFn: fetchUserShares,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useFetchShare(id: string) {
  return useQuery({
    queryKey: queryKeys.share(id),
    queryFn: () => fetchShare(id),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
}

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

export function useUpdateShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Share> }) =>
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

export function useDeleteShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShare(id),
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

export function useShareManagement() {
  const sharesQuery = useFetchShares();
  const createShareMutation = useCreateShare();
  const updateShareMutation = useUpdateShare();
  const deleteShareMutation = useDeleteShare();

  return {
    // State
    shares: sharesQuery.data || [],
    // Computed
    isLoading: sharesQuery.isLoading,
    isFetching: sharesQuery.isFetching,
    error: sharesQuery.error,
    // Actions
    createShare: createShareMutation.mutate,
    updateShare: updateShareMutation.mutate,
    deleteShare: deleteShareMutation.mutate,
    isCreating: createShareMutation.isPending,
    isUpdating: updateShareMutation.isPending,
    isDeleting: deleteShareMutation.isPending,
    refetch: sharesQuery.refetch,
  };
}
