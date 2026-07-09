import { getRequest, postRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

export const paddleApi = {
    handleGetAllPlans: async () =>
        await getRequest(apiPath.paddle.base('get_all_plans')).then(res => res.data),
    handleGetSubscription: async () =>
        await getRequest(apiPath.paddle.base('subscription')).then(res => res.data),
    handleAttemptSubscription: async (data: { pricing_id: string }) =>
        await postRequest(apiPath.paddle.base('subscription'), data).then(res => res.data),
    handleCreateSubscription: async (data: { transaction_id: string; subscription_id: string }) =>
        await putRequest(apiPath.paddle.base('subscription'), data).then(res => res.data),
    handleGetAllCredits: async () =>
        await getRequest(apiPath.paddle.base('get_all_credits')).then(res => res.data),
    handleBuyCredits: async (data: { credits: number }) =>
        await postRequest(apiPath.paddle.base('subscription'), data).then(res => res.data),
};
