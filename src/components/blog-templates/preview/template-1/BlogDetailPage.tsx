'use client';

import Footer from '@/components/blog-templates/components/Footer';
import Navbar from '@/components/blog-templates/components/Navbar';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import { useCreateEditor } from '@/hooks/use-create-editor';
import { useAppStore } from '@/store/useAppStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { transformBlogContent } from '@/utils/editor';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useRef } from 'react';
import ReadingProgress from '../../components/ReadingProgress';
import { dummyBlogContent } from '../../preview/dummyBlogContent';
import Image from 'next/image';

const BlogContent = dynamic(() => import('../../components/BlogContent'), {
    ssr: false,
    loading: () => null,
});

const ShareArticle = dynamic(() => import('../../components/ShareArticle'), {
    ssr: false,
    loading: () => null,
});

const TableOfContents = dynamic(() => import('../../components/TableOfContents'), {
    ssr: false,
    loading: () => null,
});

const MobileTableOfContents = dynamic(() => import('../../components/MobileTableOfContents'), {
    ssr: false,
    loading: () => null,
});

const BlogDetailPage: React.FC = () => {
    const contentContainerRef = useRef<HTMLDivElement>(null);
    const { getTemplateData } = useTemplateStore();
    const { setBlog } = useAppStore();
    const template = getTemplateData(`template`);
    const pathname = usePathname();

    const content = useMemo(() => {
        return transformBlogContent(dummyBlogContent)
            ?.slice(1)
            ?.filter((item: any) => !item?.is_ai_suggested || !item?.plugin_data_id)
            ?.map((item: any) => ({ ...item, isEditing: false })) || [];
    }, [dummyBlogContent]);

    const editor = useCreateEditor({
        readOnly: true,
        value: content,
    });

    useEffect(() => {
        if (!dummyBlogContent?.content && editor) {
            editor.tf.setValue(content);
        }
    }, [dummyBlogContent?.content, editor]);

    useEffect(() => {
        setBlog(dummyBlogContent);
    }, [setBlog]);

    if (!dummyBlogContent) {
        return <SpinnerLoader />;
    }
    return (
        <div>
            <Navbar isPreviewMode={true} />
            <div>
                {template?.seo?.show_post_progress_bar_on_scroll && (
                    <ReadingProgress containerRef={contentContainerRef} />
                )}
                <div className="grid grid-cols-1 lg:grid-cols-12 md:px-8 px-2 h-auto ">
                    {/* Left sidebar with table of contents */}
                    <div className="lg:col-span-2 hidden lg:block sticky top-0 h-fit max-h-[85vh] overflow-y-auto no-scrollbar">
                        <TableOfContents editor={editor} isPreview />
                    </div>

                    {/* Main content */}
                    <div ref={contentContainerRef} className="lg:col-span-8 lg:px-6 px-2 border-l border-r">
                      {dummyBlogContent?.content ? (
                            <>
                                {/* <BlogContent value={dummyBlogContent?.content?.slice(0, 1)} /> */}
                                 <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-[#333333] leading-tight mb-4 mt-6">
            {dummyBlogContent?.blog_title}
          </h1>
                                <div className="flex items-center justify-between mb-8 mt-4 text-sm text-textTertiary">
                                    <div hidden={template?.seo?.hide_authors}>
                                        <span className="mr-2 font-jakarta font-semibold text-sm text-[#8F8F8F]">Author:</span>
                                        <Link
                                            href={`/admin/template/template_001/how-minimalist-ui-design-boosts-user-engagement/author`}
                                        >
                                            <span className="font-jakarta font-semibold text-sm text-[#333333] underline hover:text-black">
                                                {dummyBlogContent?.author_details?.author_name}
                                            </span>
                                        </Link>
                                    </div>
                                    <div hidden={template?.seo?.hide_post_dates}>
                                        <span className="mr-2 font-jakarta font-semibold text-sm text-[#8F8F8F]">Date:</span>
                                        <span className='font-jakarta font-semibold text-sm text-[#333333]'>
                                            {dayjs(dummyBlogContent?.created_at).format('MMM D, YYYY')}
                                        </span>
                                    </div>
                                </div>
                                
                                <MobileTableOfContents editor={editor} />

                                <div className="mb-12 rounded-sm overflow-hidden aspect-video relative">
                                    <Image
                                        fill
                                        src={dummyBlogContent?.blog_info?.featured_image?.url || '/images/placeholder/no-image.webp'}
                                        alt={dummyBlogContent?.blog_title}
                                        className="object-cover"
                                    />
                                </div>

                                <BlogContent value={dummyBlogContent?.content?.slice(1)} />

                                {/* {!template?.seo?.hide_social_sharing_icons && (
                                    <div className="lg:hidden mt-8 border-t pt-8">
                                        <ShareArticle isPreview />
                                    </div>
                                )} */}
                            </>
                        ) : (
                            <div className="min-h-[2000px] w-full bg-gray-100 animate-pulse rounded-xl" />
                        )}
                    </div>

                    {/* Right sidebar with sharing options */}
                    {!template?.seo?.hide_social_sharing_icons && (
      <div className="lg:col-span-2 sticky top-0 h-fit px-4 lg:px-2 mt-0 pt-0">
                            <ShareArticle isPreview className="pl-0 lg:pl-8"/>
                        </div>
                    )}
                </div>
            </div>
            <Footer isPreviewMode={true} />
        </div>
    );
};

export default BlogDetailPage;
