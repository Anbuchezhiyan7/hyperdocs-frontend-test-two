import { putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

interface AcceptOrDeclineSuggestion {
    blog_id: string;
    suggestion_type: string;
    accept: boolean;
    poll_id?: string;
    lead_magnet_id?: string;
    banner_id?: string;
    infograph_id?: string;
    faq_id?: string;
}

const aiSuggestionsApi = {
    handleAcceptOrDeclineSuggestion: async (data: AcceptOrDeclineSuggestion) =>
        await putRequest(apiPath.ai_suggestion.custom('accept_or_decline'), data),
};

export default aiSuggestionsApi;
