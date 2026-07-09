import { getRequest, deleteRequest, postRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

const infographsApi = {
    handleCreateInfograph: (blogId: string) =>
        postRequest(apiPath.infographs.base, { blog_id: blogId })?.then(res => res?.data),
    handleUpdateInfograph: (infographId: string, infograph: any) =>
        putRequest(apiPath.infographs.id(infographId), infograph)?.then(res => res?.data),
    handleDeleteInfograph: (infographId: string) =>
        deleteRequest(apiPath.infographs.id(infographId))?.then(res => res?.data),
    handleGetInfograph: (infographId: string) =>
        getRequest(apiPath.infographs.id(infographId))?.then(res => res?.data),
    handleGetAllInfographs: () => getRequest(apiPath.infographs.base)?.then(res => res?.data),
};

export default infographsApi;
