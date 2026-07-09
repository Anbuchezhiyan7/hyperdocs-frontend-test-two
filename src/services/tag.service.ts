import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tagsApi } from '@/api/tags.api';

export const useTagService = () => {
    const queryClient = useQueryClient();

    const { mutateAsync: handleCreateTag, isPending: isCreating } = useMutation({
        mutationFn: tagsApi.handleCreateTag,
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['tags'] });
            toast.success('Tag created successfully');
            return data; // Return the created tag data
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create tag');
        },
    });

    const { mutateAsync: handleUpdateTag, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) =>
            tagsApi.handleUpdateTag(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            toast.success('Tag updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update tag');
        },
    });

    const { mutateAsync: handleDeleteTag, isPending: isDeleting } = useMutation({
        mutationFn: tagsApi.handleDeleteTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            toast.success('Tag deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete tag');
        },
    });

    return {
        handleCreateTag,
        handleUpdateTag,
        handleDeleteTag,
        isLoading: isCreating || isUpdating || isDeleting,
        isError: false,
    };
};
