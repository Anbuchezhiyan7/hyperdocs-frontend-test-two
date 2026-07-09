import { getRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

export interface NewsletterTemplateAPI {
    template_id: string;
    template_name: string;
    title: string;
    button_text: string;
    description: string;
    right_panel_heading: string | null;
    right_panel_subtext: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const newsletterApi = {
    getAllTemplates: (): Promise<NewsletterTemplateAPI[]> =>
        getRequest(apiPath.newsletter.templates).then(res => res?.data?.data),

    updateTemplate: (payload: Omit<NewsletterTemplateAPI, 'created_at' | 'updated_at'>): Promise<NewsletterTemplateAPI> =>
        putRequest(apiPath.newsletter.templates, payload).then(res => res?.data?.data),

    getConfigStatus: (): Promise<boolean> =>
        getRequest(apiPath.newsletter.configStatus).then(res => {
            // Handle both { data: { is_newsletter_configured } } and { data: { data: { is_newsletter_configured } } }
            const d = res?.data?.data ?? res?.data;
            return d?.is_newsletter_configured ?? false;
        }),

    setConfigStatus: (enabled: boolean): Promise<void> =>
        putRequest(`${apiPath.newsletter.configStatus}?is_newsletter_configured=${enabled}`, {}).then(() => undefined),
};

export default newsletterApi;
