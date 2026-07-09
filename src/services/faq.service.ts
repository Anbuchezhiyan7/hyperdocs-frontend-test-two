import faqsApi from '@/api/faq.api';
import { useSendData } from '@/config/query.config';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const useFAQService = (faq_id?: string) => {
    const params = useParams();
    const blogId = params.id as string;
    const invalidateKey = ['faq', 'faq', faq_id || ''];
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateFAQ = async () => {
        try {
            setIsLoading(true);
            const res = await faqsApi.handleCreateFAQ(blogId as string);
            if (res) {
                return res;
            }
            return null;
        } catch (error) {
            console.log('ERROR', error);
            toast.error('Error creating faq');
        } finally {
            setIsLoading(false);
        }
    };

    const {
        mutate: handleUpdateFAQ,
        isPending: isUpdatingFAQ,
        isError: isUpdatingFAQError,
    } = useSendData({
        fn: ({ faqId, faq_data }: { faqId: string; faq_data: any }) =>
            faqsApi.handleUpdateFAQ(faqId, {
                faq_data,
                blog_id: blogId,
            }),
        invalidateKey,
        error: (error: any) => {
            console.log('ERROR', error);
            toast.error('Error updating faq');
        },
    });

    const {
        mutate: handleDeleteFAQ,
        isPending: isDeletingFAQ,
        isError: isDeletingFAQError,
    } = useSendData({
        fn: ({ faqId }: { faqId: string }) => faqsApi.handleDeleteFAQ(faqId),
        invalidateKey,
        error: (error: any) => {
            console.log('ERROR', error);
            toast.error('Error deleting faq');
        },
    });

    return {
        handleCreateFAQ,
        handleUpdateFAQ,
        handleDeleteFAQ,
        isLoading: isUpdatingFAQ || isDeletingFAQ || isLoading,
        isDeletingFAQ,
        isError: isUpdatingFAQError || isDeletingFAQError,
    };
};

export default useFAQService;
