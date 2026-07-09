import { deleteRequest, getRequest, postRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

export const tagsApi = {
    handleGetAllTags: async (search?: string) => {
        const params = search ? `?search=${search}` : '';
        return getRequest(`${apiPath.tags.base}${params}`).then(res => res.data?.items);
    },
    handleGetTagById: async (id: string) =>
        await getRequest(apiPath.tags.id(id)).then(res => res.data),
    handleCreateTag: async (payload: any) =>
        await postRequest(apiPath.tags.base, payload).then(res => res.data),
    handleUpdateTag: async (id: string, payload: any) =>
        await putRequest(apiPath.tags.id(id), payload).then(res => res.data),
    handleDeleteTag: async (ids: string[]) =>
        await deleteRequest(apiPath.tags.base, { tag_ids: ids }).then(res => res.data),
};
