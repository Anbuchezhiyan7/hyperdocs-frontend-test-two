import { getRequest, deleteRequest, postRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

const bannersApi = {
    handleCreateBanner: (blogId: string) =>
        postRequest(apiPath.banners.base, { blog_id: blogId })?.then(res => res?.data),
    handleUpdateBanner: (bannerId: string, banner: any) =>
        putRequest(apiPath.banners.id(bannerId), banner)?.then(res => res?.data),
    handleDeleteBanner: (bannerId: string) =>
        deleteRequest(apiPath.banners.id(bannerId))?.then(res => res?.data),
    handleGetBanner: (bannerId: string) =>
        getRequest(apiPath.banners.id(bannerId))?.then(res => res?.data),
    handleGetAllBanners: () => getRequest(apiPath.banners.base)?.then(res => res?.data),
};

export default bannersApi;
