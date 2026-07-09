'use client';

import React from 'react';
import blogApi from '@/api/blog.api';
import { useSendData } from '@/config/query.config';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { useEditorState } from '@udecode/plate/react';
import { transformBlogContent } from '@/utils/editor';
import { DOMAIN_URL } from '@/constants/definitions';
import { analyzeSeoScore } from '@/utils/seo-score';
import extractKeywords from '@/utils/seo-score/keywords';
import { useQueryState } from 'nuqs';

import { clearCacheByTag } from '@/actions/revalidate';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { apiUpdateProductTour } from '@/api/auth';

interface BlogInfo {
    [key: string]: string | number | boolean | null | undefined | BlogInfo;
}

const SKIP_SEO_CHECK_KEYS = ['schema_markup'];

const useBlogService = (id?: string) => {
    const router = useRouter();
    const params = useParams();
    const blogId = (params?.id as string) || id;
    const { blog, setBlog, settings, handleBlogFieldChange } = useAppStore();
    const editor = useEditorState();
    const [type, setType] = useQueryState('model-type');
    const { isActive: isOnboarding } = useOnboardingStore();

    const isValidInfo = (key: keyof BlogInfo) => {
        if (!blog?.blog_info) return false;
        const value = (blog?.blog_info as any)?.[key];
        if (value) {
            return true;
        }
        return false;
    };

    const isPublishable = (): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        // Check only the required fields: author details, category, tags, slug URL
        // if (!blog?.author_details) errors.push('Author is missing');

        return { isValid: errors.length === 0, errors };
    };

    const { mutate: enhanceBlog, isPending: isEnhancingBlog } = useSendData({
        fn: () => blogApi.handleEnhanceBlog(blogId as string, blog?.content, isOnboarding),
        success: data => {
            editor.tf.setValue(
                transformBlogContent({
                    ...blog,
                    content: data?.enhanced_content,
                })
            );
            toast.success('Blog enhanced successfully');
            // Notify onboarding layer that enhancement is complete
            window.dispatchEvent(new CustomEvent('onboarding:enhance-complete', { detail: data }));
            if (isOnboarding) {
                apiUpdateProductTour()?.catch(e => console.error('Failed to update product tour:', e));
            }
        },
        error: error => {
            if (error?.status === 402 && error?.data?.detail?.includes('Insufficient credits')) {
                toast.error('Insufficient credits');
                setType('pricing');
            } else if (error.status === 403) {
                toast.error(error.data.detail);
                setType('pricing');
            } else {
                toast.error('Failed to enhance blog');
            }
            if (isOnboarding) {
                apiUpdateProductTour()?.catch(e => console.error('Failed to update product tour:', e));
            }
        },
    });


    const handleGetSeoScore = async (blogData: any) => {
        const keywords = blogData?.seo_focus_keyword
            ? [blogData?.seo_focus_keyword]
            : extractKeywords(blogData?.content || '') || [];
        const seoScore = await analyzeSeoScore(blogData as any, keywords, blogData?.blog_title)
            ?.percentageScore;
        console.log('seoScore', seoScore);
        handleBlogFieldChange('seo_score', parseInt(seoScore.toFixed(0)));
    };

    const { mutateAsync: updateBlog, isPending: isUpdatingBlog } = useSendData({
        // Only PUT what the caller passes. Auto-injecting blog_title from the
        // store caused every partial update to overwrite the server title with
        // stale store data before GET had hydrated.
        fn: (data: any) =>
            blogApi.handleUpdateBlog(blogId as string, data),
        success: () => {
            // Immediately wipe the 1-hour cache for the public pages
            clearCacheByTag('blogs');
        },
        error: error => toast.error('Failed to update blog'),
        invalidateKey: ['blogs', 'blog_info'],
    });

    const { mutateAsync: deleteBlog, isPending: isDeletingBlog } = useSendData({
        fn: () => blogApi.handleDeleteBlog(blogId as string),
        success: () => {
            clearCacheByTag('blogs');
            router.push('/admin/blogs', { scroll: false });
        },
        error: error => toast.error('Failed to delete blog'),
        invalidateKey: ['blogs', 'remaining-blogs'],
    });

    const {
        mutateAsync: handleCreateSEOSuggestion,
        isPending: isCreatingSEOSuggestion,
        isError: isCreatingSEOSuggestionError,
    } = useSendData({
        fn: (payload: any) => blogApi.handleCreateSEOSuggestion(payload),
        success: data => {
            console.log(data);
        },
        error: error => {
            if (error?.status === 402 && error?.data?.detail?.includes('Insufficient credits')) {
                toast.error('Insufficient credits');
                setType('pricing');
            } else if (error.status === 403) {
                toast.error(error.data.detail);
                setType('pricing');
            } else {
                toast.error('Failed to create SEO suggestion');
            }
        },
    });

    const generatePublishedURL = (slug: string) => {
        const domainSettings = settings?.domain as any;
        if (!domainSettings) return `${DOMAIN_URL}/${slug}`;

        const { main_domain, sub_domain, sub_folder, sub_folder_domain, default: defaultDomain } = domainSettings;

        if (main_domain) {
            return `${main_domain}/${slug}`;
        }
        if (sub_domain) {
            return `${sub_domain}/${slug}`;
        }
        if (sub_folder && sub_folder_domain) {
            const path = sub_folder.startsWith('/') ? sub_folder : `/${sub_folder}`;
            const cleanDomain = sub_folder_domain.endsWith('/') ? sub_folder_domain.slice(0, -1) : sub_folder_domain;
            return `${cleanDomain}${path}/${slug}`;
        }
        if (defaultDomain) {
            return `${defaultDomain}/${slug}`;
        }

        return `${DOMAIN_URL}/${slug}`;
    };

    return React.useMemo(() => ({
        enhanceBlog,
        isEnhancingBlog,
        isDeletingBlog,
        updateBlog,
        deleteBlog,
        isUpdatingBlog,
        handleCreateSEOSuggestion,
        isCreatingSEOSuggestion,
        isError: isCreatingSEOSuggestionError,
        isPublishable,
        isValidInfo,
        generatePublishedURL,
        handleGetSeoScore,
    }), [
        enhanceBlog,
        isEnhancingBlog,
        isDeletingBlog,
        updateBlog,
        deleteBlog,
        isUpdatingBlog,
        handleCreateSEOSuggestion,
        isCreatingSEOSuggestion,
        isCreatingSEOSuggestionError,
        isPublishable,
        isValidInfo,
        generatePublishedURL,
        handleGetSeoScore,
    ]);
};

export default useBlogService;
