'use client';

import Blogs from '@/components/blogs';
import Navbar from '@/components/common/Navbar';
import { useRouter } from 'next/navigation';
import { BlogsIcon } from '@/assets/icons';
import { queryClient, useSendData } from '@/config/query.config';
import blogApi from '@/api/blog.api';
import { subscriptionApi } from '@/api/subscription.api';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { apiGetSettings } from '@/api/settings';
import NoBlogsPlaceholder from '@/components/blogs/NoblogsPlaceholder';
import { useAppStore } from '@/store/useAppStore';
import { useQueryState } from 'nuqs';
import { useMemo, useEffect, useState } from 'react';
import Head from 'next/head';
import blogimage1 from '@/assets/images/blogimage1.png';
import { Menu, Modal } from 'antd';
import { Monitor } from 'lucide-react';
import { DownloadIcon, MdArrowOutwardIcon } from '@/assets/icons';
import { useFilePicker } from 'use-file-picker';
import useImportService from '@/services/import.service';
import Button from '@/components/common/Buttons';
import Image from 'next/image';
import { DashboardOnboarding } from '@/components/onboarding';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { apiGetProductTour } from '@/api/auth';
import MobileDesktopBanner from '@/components/common/MobileDesktopBanner';

export default function BlogsPage() {
    const router = useRouter();
    const { filters, setFilters, resetFilters, setSettings } = useAppStore();
    const [searchParams, setSearchParams] = useQueryState('search');
    const { handleImport } = useImportService();
    const [isMobileWarningOpen, setIsMobileWarningOpen] = useState(false);

    // ── Onboarding: check isFirstTimeUser flag from user data ─────────────────
    const { user } = useAppStore();
    const { isActive, isCompleted, startOnboarding } = useOnboardingStore();


    useEffect(() => {
        const checkOnboardingFlow = async () => {
            const isMobile = window.innerWidth < 768;
            if (isMobile) return;
            // const isFirstTime = user?.is_new_user === true;
            if (!isCompleted && !isActive) {
                try {
                    const tourRes = await apiGetProductTour();
                    const productTourCompleted = tourRes?.data?.is_product_tour_completed;

                    if (!productTourCompleted) {
                        const res = await blogApi.handleGetDemoContent();
                        if (res?.blogContent) {
                            useOnboardingStore.getState().setDemoContent(
                                res.blogContent,
                                null
                            );
                            startOnboarding();
                        }
                    }
                } catch (e) {
                    console.error('Failed to check product tour or fetch demo content:', e);
                }
            }
        };

        checkOnboardingFlow();
    }, [user?.isFirstTimeUser, user?.is_first_time_user, isCompleted, isActive, startOnboarding]);
    // ─────────────────────────────────────────────────────────────

    useEffect(() => {
        apiGetSettings()
            .then(res => {
                if (res) {
                    setSettings(res);
                }
            })
            .catch(console.error);
    }, [setSettings]);

    const { data: activeSubscription } = useQuery<ActiveSubscription>({
        queryKey: ['active_subscription'],
        queryFn: subscriptionApi.handleGetActiveSubscription,
    });
    // Endpoint `/subscription/remaining_blogs` currently returns 404 — commented out
    // until the backend route is restored. Falls back to undefined (no client-side gate).
    const remainingBlogs: any = undefined;
    // const { data: remainingBlogs } = useQuery<any>({
    //     queryKey: ['remaining-blogs'],
    //     queryFn: subscriptionApi.handleGetRemainingBlogBlogs,
    // });

    const isFreePlan = activeSubscription?.plan_details?.plan_id === 'free_plan';
    const remainingBlogsAvailable = remainingBlogs?.remaining_blogs;
    const [modelType, setModelType] = useQueryState('model-type');

    const { sort_by, blog_status, author, categories, tags } = filters;

    const handleSuccess = (res: any) => {
        router.push(`/admin/editor/${res?.blog_id}`);
    };

    const handleError = (err: any) => {
        toast.error(err?.data?.detail || 'Something went wrong');
    };

    const {
        data: blogs,
        isLoading,
        isFetching,
    } = useQuery<Blog[]>({
        queryKey: ['blogs', sort_by, blog_status, author, categories, tags, searchParams],
        queryFn: () =>
            blogApi
                .handleGetAllBlogs({ ...filters, search: searchParams })
                ?.then(res => res?.items),
        staleTime: 0,
        gcTime: 0,
    });

    const { mutate: handleCreateBlog, isPending } = useSendData<BlogCreatePayload>({
        fn: blogApi.handleCreateBlog,
        success: handleSuccess,
        error: handleError,
        invalidateKey: ['blogs', 'remaining-blogs', 'active_subscription'],
    });

    const isFilterApplied = useMemo(() => {
        return sort_by || blog_status || author || categories || tags || searchParams;
    }, [sort_by, blog_status, author, categories, tags, searchParams]);

    const handleImportPlateJs = async (res: any) => {
        if (isFreePlan && remainingBlogsAvailable <= 0) {
            toast.error('You have no remaining blogs');
            setModelType('pricing');
            return;
        }

        const platejsContent = await handleImport(res);
        if (!platejsContent) {
            toast.error('No content found in the file');
            return;
        }
        await handleCreateBlog({
            blog_title: platejsContent.blog_title,
            content: platejsContent.content,
            blog_info: {
                slug_url: platejsContent.slug_url,
            },
        });
    };

    const { openFilePicker } = useFilePicker({
        accept: ['.docx', '.md', '.html'],
        multiple: false,
        maxFileSize: 1024 * 1024 * 10, // 10MB
        maxFiles: 1,
        onFilesSuccessfullySelected: handleImportPlateJs,
    });

    const handleImportClick = () => {
        if (window.innerWidth < 768) {
            setIsMobileWarningOpen(true);
        } else {
            openFilePicker();
        }
    };

    const dropdownMenu = (
        <Menu>
            <Menu.Item key='import' onClick={handleImportClick}>
                <div className='flex items-center gap-2'>
                    <DownloadIcon />
                    <span>Import</span>
                </div>
                <div className='text-xs text-gray-500 mt-1 '>
                    Note: Only Supports .docx, .md, .html files.
                </div>
            </Menu.Item>
        </Menu>
    );


    const extraComponent = (
        <div className='flex flex-col items-end w-full gap-2'>
            <Button
                onClick={() => setModelType('pricing')}
                size='small'
                className='bg-[#FFEEE5] text-[#FF5200] w-fit text-[8px] font-[600] !py-0.5 !h-fit rounded-[5px] px-2 flex items-center gap-1'
            >
                UPGRADE <MdArrowOutwardIcon />
            </Button>
        </div>
    );

    const handleBlogCreation = async (data: any) => {
        if (window.innerWidth < 768) {
            setIsMobileWarningOpen(true);
            return Promise.reject('Mobile editor not supported');
        }
        if (isFreePlan && remainingBlogsAvailable <= 0) {
            toast.error('You have no remaining blogs');
            setModelType('pricing');
            return Promise.reject('You have no remaining blogs');
        }
        return await handleCreateBlog(data);
    };

    return (
        <>
            <Head>
                <meta property='og:image' content={blogimage1.src} />
                <meta property='og:image:width' content='1200' />
                <meta property='og:image:height' content='630' />
                <meta property='og:type' content='website' />
                <meta property='og:title' content='Blogs title of something' />
                <meta property='og:description' content='Blogs description of something' />
            </Head>
            <div className='w-full h-full'>
                {/* First-run empty state: no blogs, nothing loading, no filters applied.
                    Only here do we hide the navbar in favor of the full-screen CTA. */}
                {(() => {
                    const isEmptyFirstRun =
                        !isLoading &&
                        !isFetching &&
                        (blogs?.length === 0 || !blogs) &&
                        !isFilterApplied;

                    if (isEmptyFirstRun) {
                        return (
                            <NoBlogsPlaceholder
                                onAction={() =>
                                    handleBlogCreation({ blog_title: 'Enter Blog Post title' })
                                }
                                isLoading={isPending}
                            />
                        );
                    }

                    return (
                        <>
                            <Navbar
                                btnLabel={isPending ? 'Creating...' : 'Create Blog Post'}
                                btnAction={() =>
                                    handleBlogCreation({ blog_title: 'Enter Blog Post title' })
                                }
                                title='Blog Post'
                                titleIcon={<BlogsIcon />}
                                isDropdown={true}
                                dropdownMenu={dropdownMenu}
                                extraComponent={isFreePlan && extraComponent}
                                hideSearch={true}
                            />
                            <Blogs
                                blogs={blogs || []}
                                isLoading={isLoading || isFetching}
                                onMobileClick={() => setIsMobileWarningOpen(true)}
                            />
                        </>
                    );
                })()}
            </div>

            {/* ── Desktop Version Warning Modal for Mobile View ── */}
            <Modal
                open={isMobileWarningOpen}
                onCancel={() => setIsMobileWarningOpen(false)}
                footer={null}
                centered
                width={400}
            >
                <div className="flex flex-col items-center text-center p-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-[#FF5200] animate-pulse">
                        <Monitor size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Desktop Version Required</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Open the Editor in your Desktop browser to access our Powerful text editor and experience the Enhance feature
                    </p>
                    <button
                        onClick={() => setIsMobileWarningOpen(false)}
                        className="w-full bg-[#FF5200] hover:bg-[#e04800] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </Modal>

            {/* ── Onboarding Layer (isolated, renders on top) ── */}
            <DashboardOnboarding />

            {/* ── Mobile Banner ── */}
            <MobileDesktopBanner />
        </>
    );
}
