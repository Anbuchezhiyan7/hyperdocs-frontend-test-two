import infographsApi from '@/api/infograph.api';
import { useSendData } from '@/config/query.config';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const useInfographService = (infograph_id?: string) => {
    const params = useParams();
    const blogId = params.id as string;
    const invalidateKey = ['infographs', 'infograph', infograph_id || ''];
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateInfograph = async () => {
        try {
            setIsLoading(true);
            const res = await infographsApi.handleCreateInfograph(blogId as string);
            if (res) {
                return res;
            }
            return null;
        } catch (error) {
            console.log('ERROR', error);
            toast.error('Error creating infograph');
        } finally {
            setIsLoading(false);
        }
    };

    const {
        mutate: handleUpdateInfograph,
        mutateAsync: handleUpdateInfographAsync,
        isPending: isUpdatingInfograph,
        isError: isUpdatingInfographError,
    } = useSendData({
        fn: ({ infographId, infograph }: { infographId: string; infograph: any }) =>
            infographsApi.handleUpdateInfograph(infographId, {
                ...infograph,
                blog_id: blogId,
            }),
        invalidateKey: [...invalidateKey, 'active_subscription'],
        error: (error: any) => {
            console.log('ERROR', error);
            toast.error('Error updating infograph');
        },
    });

    const { mutate: handleGetAllInfographs, isPending: isGettingAllInfographs } = useSendData({
        fn: () => infographsApi.handleGetAllInfographs(),
        invalidateKey,
    });

    const {
        mutate: handleDeleteInfograph,
        isPending: isDeletingInfograph,
        isError: isDeletingInfographError,
    } = useSendData({
        fn: ({ infographId }: { infographId: string }) =>
            infographsApi.handleDeleteInfograph(infographId),
        invalidateKey,
        error: (error: any) => {
            console.log('ERROR', error);
            toast.error('Error deleting infograph');
        },
    });

    return {
        handleCreateInfograph,
        handleUpdateInfograph,
        handleUpdateInfographAsync,
        handleDeleteInfograph,
        isLoading:
            isUpdatingInfograph || isGettingAllInfographs || isDeletingInfograph || isLoading,
        isDeletingInfograph,
        isError: isUpdatingInfographError || isDeletingInfographError,
    };
};

export default useInfographService;
