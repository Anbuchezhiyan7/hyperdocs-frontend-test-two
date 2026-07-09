import { getRequest, deleteRequest, postRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

const faqsApi = {
    handleCreateFAQ: (blogId: string) =>
        postRequest(apiPath.faqs.base, { blog_id: blogId })?.then(res => res?.data),
    handleUpdateFAQ: (faqId: string, faq: any) =>
        putRequest(apiPath.faqs.id(faqId), faq)?.then(res => res?.data),
    handleDeleteFAQ: (faqId: string) =>
        deleteRequest(apiPath.faqs.id(faqId))?.then(res => res?.data),
    handleGetFAQ: (faqId: string) => getRequest(apiPath.faqs.id(faqId))?.then(res => res?.data),
    handleCreateSchemaMarkup: (blogId: string) =>
        postRequest(apiPath.faqs.create_schema_markup(blogId), {})?.then(res => res?.data),
    handleRemoveSchemaMarkup: (blogId: string) =>
        putRequest(apiPath.faqs.remove_schema_markup(blogId), {})?.then(res => res?.data),
};

export default faqsApi;
