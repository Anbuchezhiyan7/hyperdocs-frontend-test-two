'use client';

import leadMagnetLibraryApi, { LeadMagnetLibraryItem, LeadMagnetLibraryPayload } from '@/api/lead-magnet-library.api';
import { useSendData } from '@/config/query.config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const QUERY_KEY = 'lead-magnet-library';

export const useLeadMagnetLibraryService = () => {
    const queryClient = useQueryClient();

    const {
        data: magnetsRaw,
        isLoading: isFetchingMagnets,
        refetch: refetchMagnets,
    } = useQuery<any>({
        queryKey: [QUERY_KEY],
        queryFn: () => leadMagnetLibraryApi.getAll(),
        staleTime: 0,
    });

    // Normalise: backend may return [] directly, or { data: [] }, { items: [] }, { results: [] }
    const magnets: LeadMagnetLibraryItem[] = Array.isArray(magnetsRaw)
        ? magnetsRaw
        : Array.isArray(magnetsRaw?.data)
        ? magnetsRaw.data
        : Array.isArray(magnetsRaw?.items)
        ? magnetsRaw.items
        : Array.isArray(magnetsRaw?.results)
        ? magnetsRaw.results
        : [];

    const {
        mutateAsync: createMagnet,
        isPending: isCreating,
    } = useSendData<LeadMagnetLibraryPayload>({
        fn: (payload) => leadMagnetLibraryApi.create(payload),
        invalidateKey: [QUERY_KEY],
        success: () => toast.success('Lead magnet created!'),
        error: () => toast.error('Failed to create lead magnet'),
    });

    const {
        mutateAsync: updateMagnet,
        isPending: isUpdating,
    } = useSendData<{ id: string; payload: Partial<LeadMagnetLibraryPayload> }>({
        fn: ({ id, payload }) => leadMagnetLibraryApi.update(id, payload),
        invalidateKey: [QUERY_KEY],
        success: () => toast.success('Lead magnet updated!'),
        error: () => toast.error('Failed to update lead magnet'),
    });

    const {
        mutateAsync: deleteMagnet,
        isPending: isDeleting,
    } = useSendData<{ id: string }>({
        fn: ({ id }) => leadMagnetLibraryApi.delete(id),
        invalidateKey: [QUERY_KEY],
        success: () => toast.success('Lead magnet deleted!'),
        error: () => toast.error('Failed to delete lead magnet'),
    });

    return {
        magnets: magnets ?? [],
        isFetchingMagnets,
        refetchMagnets,
        createMagnet,
        isCreating,
        updateMagnet,
        isUpdating,
        deleteMagnet,
        isDeleting,
    };
};
