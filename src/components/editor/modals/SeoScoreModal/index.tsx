import { useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import DynamicLoader from '@/components/common/Loader/DynamicLoader';
import RightPannel from '@/components/common/SidePanel';
import SeoTrackCard from '@/components/common/SeoTrackCard';
import ProgressBar from '@/components/common/ProgressBar';
import { useEditorRef } from '@udecode/plate/react';
import useBlogService from '@/services/blog.service';
import { toast } from 'react-hot-toast';
import blogApi from '@/api/blog.api';
import { useParams } from 'next/navigation';
import { insertSuggestion } from '@/utils/editor';
import { Spinner } from '@/components/plate-ui/spinner';
import { useSuggestionService } from '@/services/suggestion.service';
import { seoLoader } from '@/constants/loader';
import { Button } from 'antd';
import { SparkleIcon, CoinsIcon } from '@/assets/icons';
import { queryClient } from '@/config/query.config';
import { getSeoFeatureCredit, useCreditPricing } from '@/hooks/use-credit-pricing';

const META_TYPES = ['meta_title', 'meta_description'];

// Helper function to transform nested SEO suggestions data into flat array
const transformAllSuggestions = (suggestionsData: any): Array<any> => {
    const result: Array<any> = [];

    // Handle meta types separately - they're not included in the result array
    // They'll be handled separately in the main function

    Object.entries(suggestionsData).forEach(([key, value]: [string, any]) => {
        // Skip meta types as they're handled separately
        if (META_TYPES.includes(key)) {
            return;
        }

        // Handle arrays (introduction, subheadings)
        if (Array.isArray(value)) {
            value.forEach((item: any) => {
                result.push({
                    ...item,
                    suggestion_type: key,
                });
            });
        }
        // Handle single objects
        else if (value && typeof value === 'object') {
            result.push({
                ...value,
                suggestion_type: key,
            });
        }
    });

    // Sort by after_line to ensure proper insertion order (title/H1 with after_line: 0 should be first)
    result.sort((a, b) => {
        const aLine = Array.isArray(a.after_line) ? a.after_line[0] : (a.after_line ?? 0);
        const bLine = Array.isArray(b.after_line) ? b.after_line[0] : (b.after_line ?? 0);
        return aLine - bLine;
    });

    // Ensure title (H1) is always at the front if it exists
    const titleIndex = result.findIndex(item => item.suggestion_type === 'title' || item.type === 'h1');
    if (titleIndex > 0) {
        const titleItem = result.splice(titleIndex, 1)[0];
        result.unshift(titleItem);
    }

    return result;
};

// Types that require element IDs
const PLUGIN_TYPES_WITH_IDS = ['poll', 'info_graph', 'banner', 'lead_magnet', 'faq'];
const TYPE_TO_ID_MAP: Record<string, string> = {
    poll: 'poll_id',
    info_graph: 'infograph_id',
    banner: 'banner_id',
    lead_magnet: 'lead_magnet_id',
    faq: 'faq_id',
};

// Helper function to normalize suggestion type for API (always use API-expected format)
const normalizeSuggestionTypeForAPI = (suggestionType: string): string => {
    // API expects 'info_graph', not 'infograph'
    if (suggestionType === 'infograph') {
        return 'info_graph';
    }
    return suggestionType;
};

// Helper function to normalize suggestion type key (for data lookup)
const normalizeSuggestionTypeKey = (suggestionType: string): string[] => {
    // Try both 'info_graph' and 'infograph' for data lookup (suggestions data might use either)
    const normalized = normalizeSuggestionTypeForAPI(suggestionType);
    if (normalized === 'info_graph') {
        return ['info_graph', 'infograph'];
    }
    return [normalized];
};

// Helper function to build accept list payload
const buildAcceptListPayload = (
    blogId: string,
    notPassedBreakdowns: Array<any>,
    suggestionsData: any
): Array<any> => {
    const payload: Array<any> = [];

    notPassedBreakdowns.forEach((card: any) => {
        const rawSuggestionType = card?.key;
        // Normalize suggestion type for API (infograph -> info_graph)
        const suggestionType = normalizeSuggestionTypeForAPI(rawSuggestionType);
        const payloadItem: any = {
            blog_id: blogId,
            suggestion_type: suggestionType,
            accept: true,
        };

        // Add element ID for plugin types
        if (PLUGIN_TYPES_WITH_IDS.includes(suggestionType)) {
            const idField = TYPE_TO_ID_MAP[suggestionType];
            // Try multiple keys for data lookup (suggestions data might use different key variations)
            const dataKeys = normalizeSuggestionTypeKey(suggestionType);
            let suggestionItem = null;

            // Try each key until we find the data
            for (const key of dataKeys) {
                if (suggestionsData?.[key]) {
                    suggestionItem = suggestionsData[key];
                    break;
                }
            }

            // Extract ID from suggestion data
            if (suggestionItem) {
                const pluginId = suggestionItem?.data_plugin_id || suggestionItem?.id;
                if (pluginId) {
                    payloadItem[idField] = pluginId;
                }
            }
        }

        payload.push(payloadItem);
    });

    return payload;
};

export default function SEOScore() {
    const [mode, setMode] = useQueryState('mode');
    const [suggestionType, setSuggestionType] = useQueryState('suggestion_type');
    const [type, setType] = useQueryState('type');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingSEO, setIsCheckingSEO] = useState(false);
    const { blog, handleBlogFieldChange } = useAppStore();
    const { handleCreateSEOSuggestion, isError, isCreatingSEOSuggestion, updateBlog } = useBlogService();
    const blogId = useParams()?.id;
    const editor = useEditorRef();
    const { checkIfCanUseAI, handleAcceptOrDeclineSuggestion } = useSuggestionService();
    const { data: creditPricing } = useCreditPricing();

    const seo_score = useMemo(() => {
        return blog?.seo_score
            ? JSON.parse(blog?.seo_score as any)
            : JSON.parse(localStorage.getItem('seo_score') as any);
    }, [blog]);

    useEffect(() => {
        if (seo_score) {
            setIsLoading(false);
        }
    }, [seo_score]);

    // Calculate items that need suggestions and total credits
    const applyAllData = useMemo(() => {
        if (!seo_score?.breakdown) return { notPassedItems: [], totalCredits: 0 };

        const notPassedItems = Object.values(seo_score.breakdown).filter(
            (card: any) => !card?.isPassed && card?.showAIButton
        );
        const totalCredits = notPassedItems.reduce(
            (sum: number, card: any) => sum + getSeoFeatureCredit(creditPricing, card?.key),
            0
        );

        return { notPassedItems, totalCredits };
    }, [creditPricing, seo_score]);

    // Get active subscription for credit check
    const activeSubscription = queryClient.getQueryData<ActiveSubscription>([
        'active_subscription',
    ]) as ActiveSubscription;
    
    const availableCredits = activeSubscription?.total_ai_credits || 0;

    // Check if user has enough credits for Apply All
    const hasEnoughCredits = availableCredits >= applyAllData.totalCredits;

    const handleGetSEOSuggestion = async (key: string, type?: string) => {
        if (!checkIfCanUseAI()) {
            return;
        }
        setIsLoading(true);
        setIsCheckingSEO(true);

        try {
            const notPassedBreakdowns = Object.values(seo_score?.breakdown)?.filter(
                (card: any) => !card?.isPassed && card?.showAIButton
            );
            if (notPassedBreakdowns?.length > 0) {
                await handleCreateSEOSuggestion({
                    blog_id: blogId,
                    placeholders: notPassedBreakdowns?.map((result: any) => result?.key),
                }).then(async () => {
                    if (type === 'apply_all') {
                        // await blogApi.handleAcceptAllSEOSuggestion(blogId as string);
                        return;
                    } else {
                        return;
                    }
                });
            }
            const suggestions = await blogApi.handleGetSEOSuggestion(blogId as string, key);

            console.log('SUGGESTIONS handleGetSEOSuggestion', suggestions);

            // Handle 'apply_all' case
            if (type === 'apply_all' && key === 'all') {
                // Handle meta types separately - auto-save via API without opening modal
                if (suggestions?.meta_title || suggestions?.meta_description) {
                    const metaData = {
                        ...blog?.blog_info?.custom_meta_data,
                        ...(suggestions?.meta_title && {
                            title: suggestions.meta_title.content,
                        }),
                        ...(suggestions?.meta_description && {
                            description: suggestions.meta_description.content,
                        }),
                    };

                    // Update local state
                    handleBlogFieldChange('blog_info', {
                        ...blog?.blog_info,
                        custom_meta_data: metaData,
                    });

                    // Auto-save meta data via API
                    await updateBlog({
                        blog_info: {
                            ...blog?.blog_info,
                            custom_meta_data: metaData,
                        },
                    });

                    // Accept meta suggestions
                    if (suggestions?.meta_title) {
                        await handleAcceptOrDeclineSuggestion({
                            blog_id: blogId as string,
                            suggestion_type: 'meta_title',
                            accept: true,
                        });
                    }
                    if (suggestions?.meta_description) {
                        await handleAcceptOrDeclineSuggestion({
                            blog_id: blogId as string,
                            suggestion_type: 'meta_description',
                            accept: true,
                        });
                    }
                }

                // Transform and apply all other suggestions
                const transformedSuggestions = transformAllSuggestions(suggestions);
                if (transformedSuggestions.length > 0) {
                    // Ensure title (H1) is inserted first by processing it separately if it exists
                    const titleSuggestion = transformedSuggestions.find(
                        item => item.suggestion_type === 'title' || item.type === 'h1'
                    );
                    const otherSuggestions = transformedSuggestions.filter(
                        item => item.suggestion_type !== 'title' && item.type !== 'h1'
                    );
                    
                    // Insert and auto-accept title first if it exists
                    if (titleSuggestion) {
                        await insertSuggestion(editor as any, [titleSuggestion], titleSuggestion.suggestion_type || 'title');
                        // Auto-accept title suggestion via API
                        // await handleAcceptOrDeclineSuggestion({
                        //     blog_id: blogId as string,
                        //     suggestion_type: 'title',
                        //     accept: true,
                        // });
                    }
                    
                    // Then insert all other suggestions
                    if (otherSuggestions.length > 0) {
                        await insertSuggestion(editor as any, otherSuggestions, 'all');
                    }
                }
                
                // Build and send accept list payload
                const acceptListPayload = buildAcceptListPayload(
                    blogId as string,
                    notPassedBreakdowns,
                    suggestions
                );
                if (acceptListPayload.length > 0) {
                    await blogApi.handleAcceptAllSEOSuggestionList(acceptListPayload);
                }

                // Refresh subscription/credits after Apply All
                await queryClient.invalidateQueries({ queryKey: ['active_subscription'] });

                setMode(null);
                return;
            }

            if (META_TYPES.includes(key)) {
                const modifiedKey = key === 'meta_title' ? 'title' : 'description';
                handleBlogFieldChange('blog_info', {
                    ...blog?.blog_info,
                    custom_meta_data: {
                        ...blog?.blog_info?.custom_meta_data,
                        [modifiedKey]: suggestions?.content,
                    },
                });
                setType('custom_meta_data');
                setSuggestionType(key);
                return;
            }

            console.log('SUGGESTIONS', suggestions);
            await insertSuggestion(
                editor as any,
                Array.isArray(suggestions) ? suggestions : [suggestions],
                key
            );
            setMode(null);
        } catch (error: any) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setIsCheckingSEO(false);
        }
    };

    return (
        <RightPannel
            header="SEO Best Practice"
            open={mode === 'seo-score'}
            onClose={() => setMode(null)}
            bodyClassName="[&_.ant-drawer-body]:!py-0"
        >
            {isCheckingSEO && <DynamicLoader loaderData={seoLoader} />}
            {isLoading || isCreatingSEOSuggestion ? (
                <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                    <Spinner className="w-10 h-10" />
                </div>
            ) : (
                <>
                    <div className="sticky top-0 z-50 bg-white pt-3 pb-2 border-b border-gray-100">
                        <ProgressBar percent={seo_score?.percentageScore || 0} />
                        {applyAllData.notPassedItems.length > 0 && (
                            <div className="mt-2 px-2">
                                <Button
                                    type="primary"
                                    size="middle"
                                    onClick={() => handleGetSEOSuggestion('all', 'apply_all')}
                                    className="w-full !h-8 !text-sm font-medium rounded-md"
                                    icon={<SparkleIcon className="w-3.5 h-3.5" />}
                                    disabled={isLoading || isCreatingSEOSuggestion || !hasEnoughCredits}
                                >
                                    <span className="flex items-center gap-1.5">
                                        Apply All
                                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                                            <CoinsIcon className="h-3 w-3" />
                                            {applyAllData.totalCredits}
                                        </span>
                                    </span>
                                </Button>
                            </div>
                        )}
                    </div>
                    {seo_score?.breakdown &&
                        Object.values(seo_score?.breakdown)?.map((card: any) => (
                            <SeoTrackCard
                                key={card?.condition}
                                label={card?.condition}
                                current={card?.currentValue || 0}
                                score={card?.score}
                                isDone={card?.isPassed}
                                onViewSuggestions={() => handleGetSEOSuggestion(card?.key)}
                                showAIButton={card?.showAIButton}
                                isLoading={isLoading}
                                credits={getSeoFeatureCredit(creditPricing, card?.key)}
                            />
                        ))}
                </>
            )}
        </RightPannel>
    );
}
