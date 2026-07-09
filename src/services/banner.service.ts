import bannersApi from '@/api/banner.api';
import { useSendData } from '@/config/query.config';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

const useBannerService = (id?: string, bannerId?: string) => {
    const invalidateKey = ['banners', 'banner', bannerId || ''];
    const params = useParams();
    const blogId = (params?.id as string) || id;

    const handleCreateBanner = async () => {
        try {
            const res = await bannersApi.handleCreateBanner(blogId as string);
            if (res) {
                return res;
            }
            return null;
        } catch (error: any) {
            console.log(error?.data?.detail, 'RESPONSE ERROR');
            toast.error(error?.data?.detail || 'Error creating banner');
        }
    };

    const {
        mutateAsync: handleUpdateBanner,
        isPending: isUpdatingBanner,
        isError: isUpdatingBannerError,
    } = useSendData({
        fn: ({ bannerId, banner }: { bannerId: string; banner: any }) =>
            bannersApi.handleUpdateBanner(bannerId, {
                ...banner,
                blog_id: blogId,
            }),
        invalidateKey: [...invalidateKey, 'active_subscription'],
        error: (error: any) => {
            console.log('ERROR', error);
            toast.error('Error updating banner');
        },
    });

    const { mutate: handleGetAllBanners, isPending: isGettingAllBanners } = useSendData({
        fn: () => bannersApi.handleGetAllBanners(),
        invalidateKey,
    });

    const {
        mutate: handleDeleteBanner,
        isPending: isDeletingBanner,
        isError: isDeletingBannerError,
    } = useSendData({
        fn: ({ bannerId }: { bannerId: string }) => bannersApi.handleDeleteBanner(bannerId),
        invalidateKey,
        error: (error: any) => {
            console.log('ERROR', error);
            toast.error('Error deleting banner');
        },
    });

    return {
        handleCreateBanner,
        handleUpdateBanner,
        handleDeleteBanner,
        isLoading: isUpdatingBanner || isGettingAllBanners || isDeletingBanner,
        isDeletingBanner,
        isError: isUpdatingBannerError || isDeletingBannerError,
    };
};

export default useBannerService;
