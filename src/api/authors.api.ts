import { deleteRequest, getRequest, putRequest, postRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

const authorApi = {
    handleCreateAuthor: async (payload: any) => await postRequest(apiPath.authors.base, payload),
    handleUpdateAuthor: async (id: string, payload: any) =>
        await putRequest(apiPath.authors.id(id), payload),
    handleDeleteAuthor: async (id: string) => (await deleteRequest(apiPath.authors.id(id))).data,
    handleGetAuthors: async () => (await getRequest(apiPath.authors.base)).data,
    handleGetAuthorById: async (id: string) =>
        await getRequest(apiPath.authors.id(id))?.then(res => res.data),
};

export default authorApi;
