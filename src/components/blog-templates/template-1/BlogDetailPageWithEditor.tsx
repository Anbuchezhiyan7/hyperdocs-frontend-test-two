'use client';

/**
 * DASHBOARD/PREVIEW ONLY — Full Plate editor with TableOfContents.
 * This file is dynamically imported so Plate never lands in the public blog page bundle.
 */

import { useCreateEditor } from '@/hooks/use-create-editor';
import { useTemplateStore } from '@/store/useTemplateStore';
import { transformBlogContent } from '@/utils/editor';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';
import ReadingProgress from '../components/ReadingProgress';
import ShareArticle from '../components/ShareArticle';

const BlogContent = dynamic(() => import('../components/BlogContent'), {
    ssr: false,
    loading: () => null,
});

const TableOfContents = dynamic(() => import('../components/TableOfContents'), {
    ssr: false,
    loading: () => null,
});

const MobileTableOfContents = dynamic(() => import('../components/MobileTableOfContents'), {
    ssr: false,
    loading: () => null,
});

interface Props {
    blog: Blog;
    template: any;
    handleGetAuthorPath: () => void;
}

const BlogDetailPageWithEditor: React.FC<Props> = ({ blog, template, handleGetAuthorPath }) => {
    const contentContainerRef = useRef<HTMLDivElement>(null);

    const content =
        transformBlogContent(blog)
            ?.slice(1)
            ?.filter((item: any) => !item?.is_ai_suggested || !item?.plugin_data_id)
            ?.map((item: any) => ({ ...item, isEditing: false })) || [];

    const editor = useCreateEditor({
        readOnly: true,
        value: content,
    });

    useEffect(() => {
        if (!blog?.content && editor) {
            editor.tf.setValue(content);
        }
    }, [blog?.content, content, editor]);

    return (
        <div>
            {template?.seo?.show_post_progress_bar_on_scroll && (
                <ReadingProgress containerRef={contentContainerRef} />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 md:px-8 px-2 h-auto">
                <div className="lg:col-span-2 hidden lg:block sticky top-0 h-fit no-scrollbar">
                    <TableOfContents editor={editor} />
                </div>
                <div
                    ref={contentContainerRef}
                    className="lg:col-span-8 px-2 md:px-6 lg:border-l lg:border-r"
                >
                    {blog?.content ? (
                        <>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-jakarta text-[#333333] leading-tight mb-4 mt-6">
                                {blog?.blog_title}
                            </h1>
                            <div className="flex items-center justify-between mb-8 mt-4 text-sm text-textTertiary">
                                <div hidden={template?.seo?.hide_authors}>
                                    <span className="mr-2 font-jakarta font-semibold text-sm text-[#8F8F8F]">Author:</span>
                                    <span
                                        className="font-jakarta font-semibold text-sm text-[#333333] underline hover:text-black"
                                        onClick={handleGetAuthorPath}
                                    >
                                        {blog?.author_details?.author_name}
                                    </span>
                                </div>
                                <div hidden={template?.seo?.hide_post_dates}>
                                    <span className="mr-2 font-jakarta font-semibold text-sm text-[#8F8F8F]">Date:</span>
                                    <span className="font-jakarta font-semibold text-sm text-[#333333]">
                                        {dayjs(blog?.created_at).format('MMM D, YYYY')}
                                    </span>
                                </div>
                            </div>
                            <MobileTableOfContents editor={editor} />
                            <BlogContent value={blog?.content?.slice(1)} />
                        </>
                    ) : (
                        <div className="min-h-[2000px] w-full bg-gray-100 animate-pulse rounded-xl" />
                    )}
                </div>
                {!template?.seo?.hide_social_sharing_icons && (
                    <div className="lg:col-span-2 sticky top-0 h-fit px-4 lg:px-0 mt-0 pt-0">
                        <ShareArticle className="pl-0 lg:pl-8" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogDetailPageWithEditor;
