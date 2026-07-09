import { deleteRequest, getRequest, postRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

export const categoriesApi = {
    handleGetAllCategories: async (search?: string) => {
        const params = search ? `?search=${search}` : '';
        return getRequest(`${apiPath.categories.base}${params}`).then(res => res.data?.items);
    },
    handleGetCategoryById: async (id: string) =>
        await getRequest(apiPath.categories.id(id)).then(res => res.data),
    handleCreateCategory: async (payload: any) =>
        await postRequest(apiPath.categories.base, payload).then(res => res.data),
    handleUpdateCategory: async (id: string, payload: any) =>
        await putRequest(apiPath.categories.id(id), payload).then(res => res.data),
    handleDeleteCategory: async (ids: string[]) =>
        await deleteRequest(apiPath.categories.base, { category_ids: ids }).then(res => res.data),
};
