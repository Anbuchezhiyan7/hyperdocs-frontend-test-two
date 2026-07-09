import { getRequest, postRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

const templatesApi = {
    handleGetTemplates: async () =>
        await getRequest(apiPath.templates.base)?.then(res => res?.data),
    handleSelectTemplate: async (payload: any) =>
        await postRequest(apiPath.templates.id('select_template'), payload)?.then(res => res?.data),
    handleUpdateTemplate: async (template_id: string, payload: any) =>
        await putRequest(apiPath.templates.id(template_id), payload)?.then(res => res?.data),
    handleGetAllBlogs: async (user_id: string) =>
        await getRequest(apiPath.templates.custom(user_id, 'all_blogs'))?.then(res => res?.data),
    handleGetBlog: async (id: string) =>
        await getRequest(apiPath.templates.custom(id, 'blog'))?.then(res => res?.data),
    handleGetAllTags: async (user_id: string) =>
        await getRequest(apiPath.templates.custom(user_id, 'tags'))?.then(res => res?.data),
    handleGetAllCategories: async (user_id: string) =>
        await getRequest(apiPath.templates.custom(user_id, 'all_categories'))?.then(
            res => res?.data
        ),
    handleGetTemplateDetails: async (id: string) =>
        await getRequest(apiPath.templates.custom(id, 'details'))?.then(res => res?.data),
    handleGetTemplateByUser: async (user_id: string) =>
        await getRequest(apiPath.templates.custom(user_id, 'user_template'))?.then(
            res => res?.data
        ),
    handleGetCategorizedBlogs: async (category_id: string) =>
        await getRequest(apiPath.templates.custom(category_id, 'category'))?.then(res => res?.data),
    handleGetAuthorDetails: async (author_id: string) =>
        await getRequest(apiPath.templates.custom(author_id, 'author_details'))?.then(
            res => res?.data
        ),
    handleGetBlogsByAuthor: async (author_id: string) =>
        await getRequest(apiPath.templates.custom(author_id, 'author_id_by_blog'))?.then(
            res => res?.data
        ),
};

export default templatesApi;
