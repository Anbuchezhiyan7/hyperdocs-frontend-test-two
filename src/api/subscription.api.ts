import { getRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

export const subscriptionApi = {
    handleGetActiveSubscription: async () =>
        await getRequest(apiPath.subscription.custom('details'))?.then(res => res.data),
    handleGetRemainingBlogBlogs: async () =>
        await getRequest(apiPath.subscription.custom('remaining_blogs'))?.then(res => res.data),
    handleGetCreditPricing: async () =>
        await getRequest(apiPath.subscription.custom('pricing'))?.then(res => res.data),
};
