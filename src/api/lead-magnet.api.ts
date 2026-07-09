import { deleteRequest, getRequest, postRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

const leadMagnetsApi = {
    handleCreateLeadMagnet: (blogId: string) =>
        postRequest(apiPath.leadMagnets.base, { blog_id: blogId })?.then(res => res?.data),
    handleGetLeadMagnet: (leadMagnetId: string) =>
        getRequest(apiPath.leadMagnets.id(leadMagnetId))?.then(res => res?.data),
    handleGetAllLeadMagnets: (blogId: string) =>
        getRequest(`${apiPath.leadMagnets.base}/all/${blogId}`)?.then(res => res?.data),
    handleUpdateLeadMagnet: (leadMagnetId: string, leadMagnet: any) =>
        putRequest(apiPath.leadMagnets.id(leadMagnetId), leadMagnet)?.then(res => res?.data),
    handleDeleteLeadMagnet: (leadMagnetId: string) =>
        deleteRequest(apiPath.leadMagnets.id(leadMagnetId))?.then(res => res?.data),
    handleGetAllLeads: (search?: string, blogId?: string) => {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('search', search);
        if (blogId) queryParams.set('blog_id', blogId);
        return getRequest(`${apiPath.leadMagnets.leads}?${queryParams.toString()}`)?.then(
            res => res?.data
        );
    },
    handleStoreBlogLeadMagnet: (details: any) =>
        postRequest(apiPath.leadMagnets.leads, details)?.then(res => res?.data),
    handleGenerateAIPDF: (leadMagnetId: string) =>
        postRequest(`${apiPath.leadMagnets.id(leadMagnetId)}/generate-ai-pdf`, {})?.then(
            res => res?.data
        ),
};

export default leadMagnetsApi;
