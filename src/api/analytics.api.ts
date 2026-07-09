import { getRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';
import { BASE_URL } from '@/constants/definitions';

const analyticsApi = {
    handleGetOverview: async (range: AnalyticsRange): Promise<AnalyticsOverview> =>
        getRequest(apiPath.analytics.overview(range))?.then(res => res?.data),

    handleGetPages: async (params?: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<AnalyticsPagesResponse> =>
        getRequest(apiPath.analytics.pages(params))?.then(res => res?.data),

    /**
     * Fire-and-forget page view beacon. Intentionally NOT routed through the
     * shared axios instance / React Query so it stays fully decoupled from the
     * existing APIs — it can never block or interfere with page rendering.
     *
     * Uses fetch with `keepalive` (not sendBeacon) so the JSON content-type and
     * CORS preflight are handled cleanly cross-origin, and the backend can parse
     * the request body. Errors are swallowed silently.
     */
    handleTrackPageView: (payload: {
        user_id: string;
        path: string;
        title?: string;
        visitor_id?: string;
    }) => {
        const url = `${BASE_URL}/api/v1/analytics/pageview`;
        const body = JSON.stringify({
            user_id: payload.user_id,
            path: payload.path,
            title: payload.title ?? '',
            visitor_id: payload.visitor_id ?? '',
        });

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
            // No credentials — public endpoint, keeps it decoupled from auth.
        }).catch(() => {});
    },
};

export default analyticsApi;
