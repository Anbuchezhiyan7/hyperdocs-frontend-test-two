import { getRequest, postRequest, putRequest, deleteRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';
import { queryClient } from '@/config/query.config';

const blogApi = {
    handleCreateBlog: async (blog: BlogCreatePayload) =>
        postRequest(apiPath.blog.base, blog)?.then(res => res?.data),
    handleUpdateBlog: async (blogId: string, blog: any) =>
        putRequest(apiPath.blog.id(blogId), blog)?.then(res => res?.data),
    handleGetBlog: async (blogId: string) => {
        const res = await getRequest(apiPath.blog.id(blogId));
        return res;
    },
    handleGetAllBlogs: async (filters?: any) => {
        const params = new URLSearchParams();
        console.log('filtersssss', filters);
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null) {
                console.log('key', key);
                console.log('value', value);
                params.append(key, Array.isArray(value) ? value.join(',') : (value as string));
            }
        });
        return getRequest(`${apiPath.blog.base}?${params.toString()}`)?.then(res => res?.data);
    },
    handleDeleteBlog: async (blogId: string) => deleteRequest(apiPath.blog.id(blogId)),
    handleEnhanceBlog: async (blogId: string, content: string, isDemoBlogs?: boolean) =>
        postRequest(apiPath.blog.enhance(blogId), { content: content, is_demo_blogs: isDemoBlogs ?? false })?.then(res => {
            queryClient.invalidateQueries({ queryKey: ['active_subscription'] });
            return res?.data;
        }),
    handleCreateSEOSuggestion: async (payload: any) =>
        await postRequest(apiPath.blog.seo(''), payload)?.then(res => res?.data),
    handleAcceptAllSEOSuggestion: async (blogId: string) => 
        putRequest(apiPath.blog.accept_all_seo, { blog_id: blogId })?.then(res => res?.data),
    handleGetSEOSuggestion: async (blogId: string, key: string) =>
        getRequest(apiPath.blog.seo(blogId, key))?.then(res => res?.data),
    handleRejectSEOSuggestion: async (blogId: string, key: string, id: string) =>
        deleteRequest(apiPath.blog.seo_reject(blogId, key, id))?.then(res => res?.data),
    handleGetKeywordsFromTitle: async (title: string) =>
        postRequest(apiPath.blog.keywords(title))?.then(res => res?.data),
    handleGetBlogBySlug: async (
        slug: string,
        visitor_id?: string | null,
        user_id?: string | null
    ) =>
        await postRequest(apiPath.blog.slug(slug), {
            visitor_id: visitor_id,
            user_id: user_id,
        })?.then(res => res?.data),
    handleValidateAndUpdateSlug: async (payload: any) =>
        await putRequest(apiPath.blog.validate_slug, payload)?.then(res => res?.data),
    handleGetBlogInfo: async (blogId: string) =>
        await getRequest(apiPath.blog.info(blogId))?.then(res => res?.data),
    handleUpdateSeoScore: async (blogId: string, seo_score: number) =>
        await putRequest(apiPath.blog.update_seo_score(blogId, seo_score), {})?.then(res => res?.data),
    handleCanonicalUrl: async (blogId: string, canonical_url: string) =>
        await putRequest(apiPath.blog.canonical(blogId), { canonical_url: canonical_url })?.then(res => res?.data),
    handleAcceptAllSEOSuggestionList: async (payload: any) =>   
        await putRequest(apiPath.blog.accept_all_seo_suggestion, payload)?.then(res => res?.data),
    handleGetDemoContent: async () =>
        await getRequest(apiPath.blog.onboarding_demo)?.then(res => res?.data),
};

export default blogApi;
