import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories.api';
import { toast } from 'sonner';

export const useCategoryService = () => {
    const queryClient = useQueryClient();

    const { mutateAsync: handleCreateCategory, isPending: isCreating } = useMutation({
        mutationFn: categoriesApi.handleCreateCategory,
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully');
            return data; // Return the created category data
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create category');
        },
    });

    const { mutateAsync: handleUpdateCategory, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) =>
            categoriesApi.handleUpdateCategory(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update category');
        },
    });

    const { mutateAsync: handleDeleteCategory, isPending: isDeleting } = useMutation({
        mutationFn: categoriesApi.handleDeleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete category');
        },
    });

    return {
        handleCreateCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        isLoading: isCreating || isUpdating || isDeleting,
        isError: false,
    };
};
