import leadMagnetsApi from '@/api/lead-magnet.api';
import { queryClient, useSendData } from '@/config/query.config';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const useLeadMagnetService = (leadMagnetId?: string | null) => {
    const params = useParams();
    const blogId = params.id as string;
    const invalidateKey = ['lead-magnets', 'lead_magnet', leadMagnetId || ''];
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateLeadMagnet = async () => {
        setIsLoading(true);
        try {
            const res = await leadMagnetsApi.handleCreateLeadMagnet(blogId as string);
            if (res) {
                await queryClient.invalidateQueries({ queryKey: ['lead-magnets'] });
                return res;
            }
            return null;
        } catch (error) {
            console.log('ERROR', error);
            toast.error('Error creating lead magnet');
        } finally {
            setIsLoading(false);
        }
    };

    const {
        mutateAsync: handleUpdateLeadMagnet,
        isPending: isUpdatingLeadMagnet,
        isError: isUpdatingLeadMagnetError,
    } = useSendData({
        fn: ({ leadMagnetId, leadMagnet }: { leadMagnetId: string; leadMagnet: any }) =>
            leadMagnetsApi.handleUpdateLeadMagnet(leadMagnetId, leadMagnet),
        invalidateKey: ['lead-magnet', leadMagnetId as string],
        error: (error: any) => {
            console.log('ERROR', error);
            toast.error('Error updating lead magnet');
        },
    });

    const { data: updatedLeadMagnet, isLoading: isGettingLeadMagnet } = useQuery({
        queryKey: ['lead-magnet', leadMagnetId],
        queryFn: () => leadMagnetsApi.handleGetLeadMagnet(leadMagnetId as string),
        enabled: !!leadMagnetId && leadMagnetId !== 'new',
    });

    const {
        mutateAsync: handleDeleteLeadMagnet,
        isPending: isDeletingLeadMagnet,
        isError: isDeletingLeadMagnetError,
    } = useSendData({
        fn: ({ leadMagnetId }: { leadMagnetId: string }) =>
            leadMagnetsApi.handleDeleteLeadMagnet(leadMagnetId),
        invalidateKey,
        error: (error: any) => {
            console.log('ERROR', error);
            toast.error('Error deleting lead magnet');
        },
    });

    const {
        mutateAsync: handleStoreBlogLeads,
        isPending: isStoringBlogLeads,
        isError: isStoringBlogLeadsError,
    } = useSendData({
        fn: ({ details }: { details: any }) => leadMagnetsApi.handleStoreBlogLeadMagnet(details),
        invalidateKey,
        success: (data: any) => {
            console.log('DATAsssssssssssss', data);
            toast.success('Form submitted successfully!');
        },
        error: (error: any) => {
            console.log('ERROR', error);
            toast.error('Error storing blog leads');
        },
    });

    const {
        mutateAsync: handleGenerateAIPDF,
        isPending: isGeneratingAIPDF,
        isError: isGeneratingAIPDFError,
    } = useSendData({
        fn: ({ leadMagnetId }: { leadMagnetId: string }) =>
            leadMagnetsApi.handleGenerateAIPDF(leadMagnetId),
        invalidateKey: ['lead-magnet', leadMagnetId as string],
        success: (data: any) => {
            toast.success('AI PDF generated successfully!');
        },
        error: (error: any) => {
            if (error?.status === 402 && error?.data?.detail?.includes('Insufficient credits')) {
                toast.error('Insufficient credits');
            } else {
                toast.error('Error generating AI PDF');
            }
        },
    });

    return {
        handleCreateLeadMagnet,
        handleUpdateLeadMagnet,
        handleDeleteLeadMagnet,
        handleStoreBlogLeads,
        handleGenerateAIPDF,
        leadMagnet: updatedLeadMagnet,
        isCreatingLeadMagnet: isLoading,
        isGeneratingAIPDF,
        isLoading:
            isGeneratingAIPDF ||
            isUpdatingLeadMagnet ||
            isGettingLeadMagnet ||
            isDeletingLeadMagnet ||
            isStoringBlogLeads ||
            isLoading,
        isDeletingLeadMagnet,
        isError:
            isGeneratingAIPDFError ||
            isUpdatingLeadMagnetError ||
            isDeletingLeadMagnetError ||
            isStoringBlogLeadsError,
    };
};

export default useLeadMagnetService;
