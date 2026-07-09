import aiSuggestionsApi from '@/api/ai-suggestions.api';
import { queryClient, useSendData } from '@/config/query.config';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';

export const useSuggestionService = () => {
    const activeSubscription = queryClient.getQueryData<ActiveSubscription>([
        'active_subscription',
    ]) as ActiveSubscription;
    const [modelType, setModelType] = useQueryState('model-type');

    const checkIfCanUseAI = () => {
        if (activeSubscription?.total_ai_credits <= 0) {
            toast.error('You have no AI credits left');
            setModelType('pricing');
            return false;
        }
        return true;
    };

    const {
        mutateAsync: handleAcceptOrDeclineSuggestion,
        isPending: isLoading,
        isError,
    } = useSendData({
        fn: aiSuggestionsApi.handleAcceptOrDeclineSuggestion,
        success: (data: any) => {
            console.log("🚀 ~ useSuggestionService ~ data:", data)
            toast.success(data?.data?.message || 'Suggestion accepted or declined successfully');
        },
        invalidateKey: ['active_subscription'],
        error: (err: any) => {
            toast.error(err?.response?.data?.message || err?.message || 'Failed to accept or decline suggestion');
        },
    });

    return { handleAcceptOrDeclineSuggestion, isLoading, isError, checkIfCanUseAI };
};
