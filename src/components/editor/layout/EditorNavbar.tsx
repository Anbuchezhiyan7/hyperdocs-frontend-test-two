'use client';

import { useState } from 'react';
import { Button, Modal, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
    EyeIcon,
    InfoIcon,
    TimeClockIcon,
    UnpublishIcon,
    LeadMagnet,
    TrashIcon,
    SparkleIcon,
    CoinsIcon,
} from '@/assets/icons';
import { useQueryState } from 'nuqs';
import { useAppStore } from '@/store/useAppStore';
import useBlogService from '@/services/blog.service';
import { useParams, useRouter } from 'next/navigation';
import SuggestionLoader from '@/components/common/Loader/SuggestionLoader';
import { Input } from '@/components/common/Input';
import RightModel from '@/components/modals/PublishModal';
import DropdownMenu from '@/components/common/DropdownMenu';
import PublishContent from './PublishContent';
import ConfirmContent from './ConfirmContent';
import { ChevronLeft, Eye, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';
import extractKeywords from '@/utils/seo-score/keywords';
import { analyzeSeoScore } from '@/utils/seo-score';
import blogApi from '@/api/blog.api';
import { queryClient, useSendData } from '@/config/query.config';
import { useSuggestionService } from '@/services/suggestion.service';
import { useTemplateStore } from '@/store/useTemplateStore';
import UnPublishModal from '../modals/UnPublishModal';
import faqsApi from '@/api/faq.api';
import { cleanSpecialCharacters, convertToUrlFriendly } from '@/utils/format/string';
import DynamicLoader from '@/components/common/Loader/DynamicLoader';
import { enhancerLoader, enhancerNote, seoLoader } from '@/constants/loader';
import { extractPercentageScore } from '@/utils/seo-score';
import {
    createStyledHTMLForPublish,
    createCompleteHTMLDocument,
    downloadHTMLFile,
} from '@/utils/html-serializer';
import { clearCacheByTag } from '@/actions/revalidate';
import { getSeoFeatureCredit, useCreditPricing } from '@/hooks/use-credit-pricing';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { validateBlogContent } from '@/components/editor/helper/helper';

const EditorNavbar = () => {
    const [paramMode, setParamMode] = useQueryState('mode');
    const blogId = useParams().id;
    const router = useRouter();
    const [publishModalOpen, setPublishModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingSEO, setIsCheckingSEO] = useState(false);
    const [isUnacceptedAIModalOpen, setIsUnacceptedAIModalOpen] = useState(false);
    const [validationModalOpen, setValidationModalOpen] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [modelType, setModelType] = useQueryState('model-type');
    const [type, setType] = useQueryState('type');
    const { checkIfCanUseAI } = useSuggestionService();
    const { setTemplateData } = useTemplateStore();
    const [isEnhanceHovered, setIsEnhanceHovered] = useState(false);
    const { blog, setBlog, handleBlogFieldChange, settings, user, hasContentChanged } = useAppStore();
    const {
        enhanceBlog,
        isEnhancingBlog,
        deleteBlog,
        updateBlog,
        isUpdatingBlog,
        isPublishable,
        isError,
        handleCreateSEOSuggestion,
        isCreatingSEOSuggestion,
        generatePublishedURL,
    } = useBlogService(blogId as string);
    const [isPublishing, setIsPublishing] = useState(false);

    const { data: creditPricing } = useCreditPricing();
    const enhanceCredits = getSeoFeatureCredit(creditPricing, 'enhance_blog');
    const seoScoreCredits = getSeoFeatureCredit(creditPricing, 'seo_score');

    // ── Onboarding integration ───────────────────────────────────────────────
    const { isActive: isOnboarding, phase: onboardingPhase, setPhase: setOnboardingPhase, completeOnboarding } = useOnboardingStore();

    const handleEnhanceBlog = async () => {
        if (!checkIfCanUseAI()) {
            return;
        }

        const validation = validateBlogContent(blog?.content || []);
        if (validation !== true) {
            setValidationMessage(validation);
            setValidationModalOpen(true);
            return;
        }

        // During onboarding, signal the phase change then call the real API
        if (isOnboarding) {
            setOnboardingPhase('enhance-wait');
        }
        enhanceBlog(JSON.stringify(blog?.content));
    };

    const percentageScore =
        typeof blog?.seo_score === 'number'
            ? blog?.seo_score
            : extractPercentageScore(blog?.seo_score);

    const isPublished = blog?.blog_status && blog?.blog_status === 'published';

    const handlePublishError = (error: any) => {
        console.log('ERROR', error?.status);
        if (error?.status === 400 && error?.data?.detail?.unfilled_settings) {
            toast.error('Please fill the required settings to create a blog');
            setModelType('settings');
            setType(error?.data?.detail?.unfilled_settings[0]);
            // router.push(`/settings?type=${error?.data?.detail?.unfilled_settings[0]}`);
            return;
        }
        toast.error('Failed to publish blog');
    };

    const handlePublishSuccess = () => {
        setPublishModalOpen(false);
        setConfirmModalOpen(true);
        // Advance onboarding to view-blog step and mark tour complete
        if (isOnboarding && onboardingPhase === 'publish-wait') {
            completeOnboarding();
            setOnboardingPhase('view-blog');
        }
    };

    const {
        mutateAsync: publishBlog,
        isPending: isPublishingBlog,
        isError: isPublishError,
    } = useSendData({
        fn: (data: any) => blogApi.handleUpdateBlog(blogId as string, data),
        error: handlePublishError,
    });

    const handlePublish = async () => {
        const { isValid, errors } = isPublishable();
        if (!isValid) {
            toast.error(Array.isArray(errors) ? errors?.[0] : errors);
            setPublishModalOpen(false);
            setParamMode('post_info');
            return;
        }
        setIsPublishing(true);

        await faqsApi
            .handleCreateSchemaMarkup(blogId as string)
            .then(async () => {
                await publishBlog({
                    blog_status: 'published',
                })
                    .then(async res => {
                        if (res) {
                            setBlog(res);
                        }
                        await queryClient.invalidateQueries({
                            queryKey: ['blog', blogId as string],
                        });
                        if (!res?.blog_info?.canonical_url) {
                            let replacedBlogTitle = convertToUrlFriendly(res?.blog_title);
                            let canonicalUrl = generatePublishedURL(res?.blog_info?.slug_url || replacedBlogTitle || '');
                            await blogApi
                                .handleCanonicalUrl(blogId as string, `https://${canonicalUrl}`)
                                .then(async () => {
                                    await queryClient.invalidateQueries({
                                        queryKey: ['blog', blogId as string],
                                    });
                                    toast.success('Canonical URL created successfully');
                                })
                                .catch(() => {
                                    setIsPublishing(false);
                                });
                        }
                        
                        // Clear the cache ONLY after all related data (schema, canonical url) are saved
                        await clearCacheByTag('blogs');

                        handlePublishSuccess();
                    })
                    .catch(() => {
                        setIsPublishing(false);
                    });
            })
            .catch(err => {
                toast.error('Failed to create schema markup');
                if (err.status === 400) {
                    handlePublishError(err);
                    if (!err?.data?.detail?.unfilled_settings) {
                        queryClient.invalidateQueries({ queryKey: ['blog_info'] }).then(() => {
                            setType('slug_url');
                        });
                    }
                }
                setIsPublishing(false);
            });

        if (isError) {
            setIsPublishing(false);
            return;
        }
        setIsPublishing(false);
    };

    const handleBack = () => {
        router.replace('/admin/blogs');
    };

    const handleSchedulePost = () => {
        if (hasUnacceptedSuggestions(blog?.content || [])) {
            setIsUnacceptedAIModalOpen(true);
            return;
        }
        setParamMode('schedule');
    };

    const hasUnacceptedSuggestions = (content: any[]): boolean => {
        if (!content || !Array.isArray(content)) return false;
        for (const node of content) {
            if (node.is_ai_suggested === true) {
                return true;
            }
            if (node.children && hasUnacceptedSuggestions(node.children)) {
                return true;
            }
        }
        return false;
    };

    const handlePublishModal = async (e: any) => {
        const validation = validateBlogContent(blog?.content || []);
        if (validation !== true) {
            setValidationMessage(validation);
            setValidationModalOpen(true);
            return;
        }

        if (hasUnacceptedSuggestions(blog?.content || [])) {
            setIsUnacceptedAIModalOpen(true);
            return;
        }

        if (isPublished && !hasContentChanged) {
            setConfirmModalOpen(true);
        } else {
            handlePublish();
        }
    };

    const handleUnpublishModal = () => {
        setParamMode('unpublish');
    };

    const handleUnpublishBlog = async () => {
        if (isPublished) {
            await faqsApi.handleRemoveSchemaMarkup(blogId as string);
            await publishBlog({
                blog_status: 'draft',
            });
            if (isPublishError) {
                toast.error('Failed to unpublish blog');
                return;
            }
            handleBlogFieldChange('blog_status', 'draft');
            toast.success('Blog unpublished successfully');
            queryClient.invalidateQueries({ queryKey: ['blog', blogId as string] });

            await clearCacheByTag('blogs');
            
            setConfirmModalOpen(false);
            return;
        }
    };

    const handleSEOCheck = async () => {
        const validation = validateBlogContent(blog?.content || []);
        if (validation !== true) {
            setValidationMessage(validation);
            setValidationModalOpen(true);
            return;
        }

        setIsCheckingSEO(true);
        try {
            const blogTitle = cleanSpecialCharacters(blog?.blog_title || '');
            setIsLoading(true);
            const keywordsFromTitle = await blogApi
                .handleGetKeywordsFromTitle(blogTitle)
                .then(res => res?.data)
                .catch(err => {
                    toast.error('Failed to get keywords from title');
                    return [];
                });

            const keywords = extractKeywords(blog?.blog_title || '');
            const seoScore: any = analyzeSeoScore(
                blog as any,
                keywordsFromTitle?.keywords || keywords,
                settings?.domain
            );
            const notPassedBreakdowns = Object.values(seoScore?.breakdown)?.filter(
                (card: any) => !card?.isPassed && card?.showAIButton
            );

            localStorage.setItem('seo_score', JSON.stringify(seoScore));

            handleBlogFieldChange('seo_score', JSON.stringify(seoScore));

            let score = extractPercentageScore(seoScore);
            let roundedScore = Math.round(score);
            await blogApi.handleUpdateSeoScore(blogId as string, roundedScore);

            if (!isError && !isCreatingSEOSuggestion) {
                queryClient.invalidateQueries({ queryKey: ['active_subscription'] });
                setParamMode('seo-score');
            }
        } catch (error: any) {
            if (error?.status === 402 && error?.data?.detail?.includes('Insufficient credits')) {
                toast.error('Insufficient credits');
                setModelType('pricing');
            } else {
                toast.error('Failed to check SEO score');
            }
        } finally {
            setIsLoading(false);
            setIsCheckingSEO(false);
        }
    };

    const publishedURL = generatePublishedURL(blog?.blog_info?.slug_url || '');

    const getBlogHTML = async () => {
        try {
            const html = await createStyledHTMLForPublish(blog?.content || []);
            console.log(html, 'html from getBlogHTML with utility function');
            return html;
        } catch (error) {
            console.error('Error serializing HTML:', error);
            return '';
        }
    };

    // Utility function to get HTML content that can be used elsewhere
    const exportBlogHTML = async () => {
        try {
            const completeHTML = await createCompleteHTMLDocument(
                blog?.content || [],
                blog?.blog_title || 'Blog'
            );

            if (completeHTML) {
                downloadHTMLFile(completeHTML, `${blog?.blog_title || 'blog'}.html`);
                toast.success('HTML exported successfully');
            } else {
                toast.error('Failed to generate HTML');
            }
        } catch (error) {
            console.error('Error exporting HTML:', error);
            toast.error('Failed to export HTML');
        }
    };

    const handleView = () => {
        window.open(`https://${publishedURL}`, '_blank');
    };

    const handlePreview = (e?: React.MouseEvent) => {
        // Prevent any default link/button behavior
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const id = (blogId as string) || blog?.blog_id;

        if (!id) {
            toast.error('Blog ID missing. Please save the blog first.');
            return;
        }

        const previewData = {
            blog,
            settings,
            template_tag: user?.template_tag,
            user_template: user,
        };

        try {
            localStorage.setItem(`preview_data_${id}`, JSON.stringify(previewData));

            // Navigate to preview in the same tab
            router.push(`/preview/${id}`);
        } catch (error) {
            console.error('Preview error:', error);
            toast.error('Failed to launch preview');
        }
    };

    const dropdownItems: MenuProps['items'] = [
        {
            key: 'preview',
            label: (
                <div className="flex items-center gap-2" onClick={handlePreview}>
                    <span className="text-[#333] text-[14px] font-[600] flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        Preview Blog
                    </span>
                </div>
            ),
        },
        {
            key: 'export-html',
            label: (
                <div className="flex items-center gap-2" onClick={exportBlogHTML}>
                    <span className="text-[#333] text-[14px] font-[600] flex items-center gap-2">
                        <Download className="h-5 w-5 text-primary" />
                        Export HTML
                    </span>
                </div>
            ),
        },
        {
            key: 'trash',
            label: (
                <div className="flex items-center gap-2">
                    <span
                        className="text-[#DC3545] text-[14px] font-[600] flex items-center gap-2"
                        onClick={() => deleteBlog(blog?.blog_id)}
                    >
                        <TrashIcon className="h-5 w-5" />
Delete Blog Post            </span>
                </div>
            ),
        },
    ];

    return (
        <>
            <style>{`
                .coins-icon-white svg path {
                    fill: white !important;
                }
                .clock-icon-white svg,
                .clock-icon-white svg path {
                    fill: white !important;
                }
            `}</style>
            {isCheckingSEO && (
                <DynamicLoader loaderData={seoLoader} title="Checking SEO score" />
            )}
            {isEnhancingBlog && (
                <DynamicLoader
                    loaderData={enhancerLoader}
                    title="Enhancing your post"
                    subTitle={enhancerNote}
                />
            )}
            <div className="w-full justify-between items-center flex flex-row px-4 h-[70px] fixed top-0 bg-white z-40  border-b-[#E0E0E0] border-[2px]  ">
                <div className="flex flex-row items-center gap-2">
                    <Button
                        onClick={handleBack}
                        className="flex items-center justify-center font-[600] text-[#333] rounded-[10px]"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Input
                        placeholder="Untitled"
                        inputType="text"
                        name="title"
                        contentEditable={false}
                        onChange={value => handleBlogFieldChange('blog_title', value as string)}
                        disabled={true}
                        value={blog?.blog_title || ''}
                        className="w-fit h-fit !mb-0"
                        inputClassName="w-fit focus:!bg-transparent truncate disabled:!bg-transparent disabled:!cursor-default disabled:!user-select-none disabled:!pointer-events-none !border-none !mt-0 !bg-transparent !border-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!border-none !font-[600] !text-[#333] active:!outline-none active:!ring-0 active:!ring-offset-0 active:!border-none !text-[18px]"
                    />
                </div>
                <div>
                    <div className="flex flex-row items-center gap-[11px]">
                        <Button
                            onClick={() => setParamMode('post_info')}
                            className="flex items-center gap-2 font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50/50 transition-all duration-200 rounded-[10px] h-[38px] px-3.5 shadow-sm"
                        >
                            <InfoIcon className="h-4 w-4 text-slate-500" />
                            Post Info
                        </Button>
                        <Button
                            disabled={isLoading || isCreatingSEOSuggestion}
                            onClick={handleSEOCheck}
                            className="flex items-center gap-2 font-semibold text-slate-700 bg-white border border-[#FF5200]/50 hover:border-[#FF5200] hover:text-[#FF5200] hover:shadow-[0_2px_8px_rgba(255,82,0,0.06)] transition-all duration-200 rounded-[10px] h-[38px] px-3 shadow-sm"
                        >
                            <span className="text-[13px] text-slate-500 font-medium">Check SEO Score:</span>
                            <span className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded-full text-[11px] ${
                                percentageScore >= 80 
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' 
                                    : percentageScore >= 50 
                                        ? 'bg-[#FFEEE5] text-[#FF5200] border border-[#FF5200]/20'
                                        : 'bg-rose-50 text-rose-600 border border-rose-200/50'
                            }`}>
                                {percentageScore}/100
                            </span>
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#FFEEE5] text-[#FF5200] rounded-full text-[11px] font-semibold border border-[#FF5200]/10">
                                <span className="inline-flex items-center [&_path]:fill-[#FF5200]">
                                    <CoinsIcon className="h-2.5 w-2.5" />
                                </span>
                                {seoScoreCredits}
                            </span>
                        </Button>
                        {isPublished && (
                            <Tooltip title="View Published Blog">
                                <Button
                                    data-tour="view-blog-btn"
                                    onClick={handleView}
                                    className="flex items-center justify-center bg-emerald-50/30 border border-emerald-200 hover:bg-emerald-50 transition-all duration-200 rounded-[10px] h-[38px] w-[38px] p-0 shadow-sm"
                                >
                                    <ExternalLink className="h-4.5 w-4.5 text-emerald-600" />
                                </Button>
                            </Tooltip>
                        )}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsEnhanceHovered(true)}
                            onMouseLeave={() => setIsEnhanceHovered(false)}
                        >
                            <Button
                                data-tour="enhance-btn"
                                type="primary"
                                className="flex items-center gap-2 font-semibold !bg-[#FF5200] hover:!bg-[#FF6215] hover:shadow-[0_4px_12px_rgba(255,82,0,0.18)] transition-all duration-200 rounded-[10px] h-[38px] px-4 shadow-sm !border-none"
                                onClick={handleEnhanceBlog}
                                loading={isEnhancingBlog}
                            >
                                <span className="flex items-center gap-2 text-white">
                                    <SparkleIcon className="h-4 w-4 text-white fill-white" />
                                    Enhance Post
                                    {/* <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-[11px] font-semibold border border-white/30 shadow-sm">
                                        <span className="inline-flex items-center coins-icon-white">
                                            <CoinsIcon className="h-2.5 w-2.5" />
                                        </span>
                                        {enhanceCredits}
                                    </span> */}
                                </span>
                            </Button>
                            
                            {isEnhanceHovered && (
                                <div className="absolute top-[46px] right-0 z-50 w-[320px] bg-white border border-[#FF5200]/25 rounded-[12px] p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* Small arrow pointing up */}
                                    <div className="absolute -top-[6px] right-[40px] w-3 h-3 bg-white border-t border-l border-[#FF5200]/25 rotate-45" />
                                    
                                    <div className="flex items-start gap-2.5">
                                        <div className="p-1.5 bg-[#FFEEE5] rounded-lg mt-0.5">
                                            <SparkleIcon className="h-4 w-4 text-[#FF5200] fill-[#FF5200]" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-800 text-[13px] mb-1 flex items-center justify-between">
                                                <span>One-Click AI Magic</span>
                                                {/* <span className="text-[10px] text-[#FF5200] bg-[#FFEEE5] px-1.5 py-0.5 rounded font-medium">Free during Beta</span> */}
                                            </div>
                                            <p className="text-[11.5px] text-slate-700 leading-[1.5] font-normal m-0">
                                                One click. Hyperblog reads your post and creates everything around it — SEO tags, banners, infographics, FAQs, polls, and a lead magnet tailored to your content.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center overflow-hidden rounded-[10px] shadow-sm hover:shadow-[0_4px_12px_rgba(255,82,0,0.15)] transition-all duration-200">
                            <Button
                                data-tour="publish-btn"
                                loading={isPublishingBlog || isPublishing}
                                type="primary"
                                className={`px-4 !h-[38px] !rounded-r-none !rounded-l-[10px] !border-none text-white font-semibold transition-all duration-200 ${
                                    isPublished && !hasContentChanged
                                        ? '!bg-emerald-600 hover:!bg-emerald-700'
                                        : '!bg-[#FF5200] hover:!bg-[#FF6215]'
                                }`}
                                onClick={e => handlePublishModal(e)}
                            >
                                {isPublished && !hasContentChanged ? 'Published' : 'Publish'}
                            </Button>
                            <div className="h-[38px] w-px bg-white/20" />
                            <Button
                                disabled={isPublished === true}
                                className={`px-3 !h-[38px] !rounded-l-none !rounded-r-[10px] !border-none flex items-center justify-center transition-all duration-200 ${
                                    isPublished && !hasContentChanged
                                        ? '!bg-emerald-600 hover:!bg-emerald-700 opacity-50 !cursor-not-allowed'
                                        : '!bg-[#FF5200] hover:!bg-[#FF6215]'
                                }`}
                                onClick={handleSchedulePost}
                            >
                                <span className="clock-icon-white">
                                    <TimeClockIcon className="h-[18px] w-[18px] text-white" />
                                </span>
                            </Button>
                        </div>
                        <DropdownMenu items={dropdownItems} />
                    </div>
                </div>
                <RightModel
                    isModalOpen={publishModalOpen}
                    onOk={handlePublish}
                    onCancel={() => setPublishModalOpen(false)}
                    headerText="Ready to publish?"
                    isLoading={isPublishingBlog || isPublishing}
                >
                    <PublishContent />
                </RightModel>

                <RightModel
                    isModalOpen={confirmModalOpen && (isPublished as boolean)}
                    onOk={handleView}
                    onCancel={() => setConfirmModalOpen(false)}
                    headerText="Blog Published"
                    footerContent="View Site"
                >
                    <ConfirmContent publishedURL={publishedURL} />
                </RightModel>

                <UnPublishModal onSubmit={handleUnpublishBlog} isLoading={isPublishingBlog} />

                <Modal
                    title="Unresolved AI Suggestions"
                    open={isUnacceptedAIModalOpen}
                    onOk={() => setIsUnacceptedAIModalOpen(false)}
                    onCancel={() => setIsUnacceptedAIModalOpen(false)}
                    okText="Got it"
                    cancelButtonProps={{ style: { display: 'none' } }}
                    centered
                    zIndex={9999}
                >
                    <p>You have unresolved AI generated contents. Please accept or reject them before publishing your blog.</p>
                </Modal>
                <Modal
                    title={<span className="text-[16px] font-[600] text-[#333]">Almost ready!</span>}
                    open={validationModalOpen}
                    onCancel={() => setValidationModalOpen(false)}
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            onClick={() => setValidationModalOpen(false)}
                            className="bg-[#FF5200] hover:!bg-[#FF5200]/90 text-white border-none shadow-none rounded-[8px] px-5 py-1.5 h-auto font-[500]"
                        >
                            Got it
                        </Button>
                    ]}
                    centered
                    zIndex={9999}
                    width={420}
                    closeIcon={<span className="text-gray-400 text-lg">✕</span>}
                >
                    <div className="pt-2 pb-6">
                        <p className="text-[#5D5D5D] text-[16px] m-0">{validationMessage}</p>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default EditorNavbar;
