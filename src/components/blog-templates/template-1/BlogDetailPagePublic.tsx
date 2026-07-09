'use client';

/**
 * PUBLIC-ONLY blog detail page for Template 1.
 *
 * This variant renders ONLY the static `visualContent` (server-serialized HTML
 * from RenderServerElements). It deliberately contains NO reference to the Plate
 * editor (BlogDetailPageWithEditor / useCreateEditor), so the public route's JS
 * bundle never pulls in @udecode/plate.
 *
 * The editor-capable component (BlogDetailPage.tsx) remains untouched and is used
 * by the dashboard/preview paths via TEMPLATE_CONFIG.
 */

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useAppStore } from '@/store/useAppStore';
import ReadingProgress from '../components/ReadingProgress';
import PublicTableOfContents from '../components/PublicTableOfContents';
import PublicMobileTableOfContents from '../components/PublicMobileTableOfContents';

const ShareArticle = dynamic(() => import('../components/ShareArticle'), {
    ssr: false,
    loading: () => null,
});

interface BlogDetailPagePublicProps {
    blog?: Blog;
    visualContent?: React.ReactNode;
}

const BlogDetailPagePublic: React.FC<BlogDetailPagePublicProps> = ({ blog, visualContent }) => {
    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData(`template`);
    const { setBlog } = useAppStore();
    const router = useRouter();
    const contentContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setBlog(blog as Blog);
    }, [setBlog]);

    const handleGetAuthorPath = () => {
        Cookie.set('author_id', blog?.author_details?.author_id || '');
        const AuthorName = (blog?.author || '').toLowerCase().replace(' ', '_');
        const AuthorDesignation =
            (blog?.author_details?.designation || '').toLowerCase().replace(' ', '_') ||
            'no_designation';
        router.push(`/blogs/author/${AuthorName}/${AuthorDesignation}`);
    };

    if (!blog) {
        return <SpinnerLoader />;
    }

    return (
        <div>
            {template?.seo?.show_post_progress_bar_on_scroll && (
                <ReadingProgress containerRef={contentContainerRef} />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 md:px-8 px-2 h-auto">
                {/* Left sidebar — Table of Contents */}
                <div className="lg:col-span-2 hidden lg:block sticky top-0 h-fit no-scrollbar">
                    <PublicTableOfContents content={blog.content} />
                </div>

                {/* Main content */}
                <div
                    ref={contentContainerRef}
                    className="lg:col-span-8 px-2 md:px-6 lg:border-l lg:border-r"
                >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-[#333333] leading-tight mb-4 mt-6">
                        {blog?.blog_title}
                    </h1>
                    <div className="flex items-center justify-between mb-8 mt-4 text-sm text-textTertiary">
                        <div hidden={template?.seo?.hide_authors}>
                            <span className="mr-2 font-jakarta font-semibold text-sm text-[#8F8F8F]">
                                Author:
                            </span>
                            <span
                                className="font-jakarta font-semibold text-sm text-[#333333] underline hover:text-black"
                                onClick={handleGetAuthorPath}
                            >
                                {blog?.author_details?.author_name}
                            </span>
                        </div>
                        <div hidden={template?.seo?.hide_post_dates}>
                            <span className="mr-2 font-jakarta font-semibold text-sm text-[#8F8F8F]">
                                Date:
                            </span>
                            <span className="font-jakarta font-semibold text-sm text-[#333333]">
                                {dayjs(blog?.created_at).format('MMM D, YYYY')}
                            </span>
                        </div>
                    </div>

                    {/* Featured banner image (native — mirrors template 2 & 3) */}
                    {(() => {
                        const fi = blog?.blog_info?.featured_image as any;
                        const featuredImageUrl: string | null =
                            (typeof fi === 'string' ? fi : fi?.url) || null;
                        return featuredImageUrl ? (
                            <div className="mb-8 overflow-hidden rounded-xl">
                                <Image
                                    src={optimizeCloudinaryImage(featuredImageUrl, 1200)}
                                    alt={blog?.blog_title || 'Banner'}
                                    width={1200}
                                    height={630}
                                    priority
                                    fetchPriority="high"
                                    className="h-auto w-full object-cover"
                                    sizes="(max-width: 1024px) 100vw, 1200px"
                                />
                            </div>
                        ) : null;
                    })()}

                    <PublicMobileTableOfContents content={blog.content} />
                    {visualContent}
                </div>

                {/* Right sidebar */}
                {!template?.seo?.hide_social_sharing_icons && (
                    <div className="lg:col-span-2 sticky top-0 h-fit px-4 lg:px-0 mt-0 pt-0">
                        <ShareArticle className="pl-0 lg:pl-8" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogDetailPagePublic;
