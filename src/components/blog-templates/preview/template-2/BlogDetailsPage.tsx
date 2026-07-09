'use client';

import React, { useEffect, useRef } from 'react';

import blogApi from '@/api/blog.api';
import NotFound from '@/components/common/NotFound';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import { useCreateEditor } from '@/hooks/use-create-editor';
import { useAppStore } from '@/store/useAppStore';
import { useTemplateStore } from '@/store/useTemplateStore';
import { transformBlogContent } from '@/utils/editor';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { useParams, usePathname } from 'next/navigation';
import BlogContent from '../../components/BlogContent';
import TableOfContents from '../../template-2/TableOfContent';
import ReadingProgress from '../../components/template2/ReadingProgress';
import { dummyBlogContent } from '../../preview/dummyBlogContent';
import { blogData } from '../../preview/dummyData';
import ArticleHeader from './ArticleHeader';
import HeroImage from './HeroImage';
import RelatedPosts from './RelatedPosts';
import SocialShare from './SocialShare';
import Navbar from '../../components/template2/Navbar';
import Footer from '../../components/Footer';
import dynamic from 'next/dynamic';

const MobileTableOfContents = dynamic(() => import('../../components/MobileTableOfContents'), {
    ssr: false,
    loading: () => null,
});



const BlogDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const contentContainerRef = useRef<HTMLDivElement>(null);
    const { setBlog } = useAppStore();
    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData(`template`);
    const blogsData = getTemplateData(`blogs`);
    const pathname = usePathname();
    const isPreview = pathname.includes('template');

    const handleGetBlogBySlug = async () => {
        const visitorId = Cookies.get('visitor_id');
        const userId = Cookies.get('user_id');
        if (isPreview) {
            const response = await blogApi.handleGetBlog(id as string);
            return response?.data;
        }
        const response = await blogApi.handleGetBlogBySlug(id, visitorId || null, userId || null);
        return response?.blog;
    };

    const content =
        transformBlogContent(dummyBlogContent)
            ?.slice(1)
            ?.filter((item: any) => !item?.is_ai_suggested || !item?.plugin_data_id)
            ?.map((item: any) => ({ ...item, isEditing: false })) || [];

    const editor = useCreateEditor({
        readOnly: true,
        value: content,
    });

    useEffect(() => {
        if ( dummyBlogContent?.content) {
            editor.tf.setValue(content);
        }
    }, [dummyBlogContent?.content]);

    const updateTheme = () => {
        document.documentElement.style.setProperty('--primary', template?.general?.accent_color);
    };

    useEffect(() => {
        updateTheme();
    }, [template]);

    if (!dummyBlogContent) {
        return <SpinnerLoader />;
    }

    if (!dummyBlogContent) {
        return (
            <NotFound
                title='Blog Not Found'
                message="We couldn't find the blog post you're looking for. It might have been removed or the URL might be incorrect."
            />
        );
    }

    return (
        <div ref={contentContainerRef} className='min-h-screen bg-white '>
            <Navbar />         
            <div className='max-w-6xl mx-auto'>   
            {template?.seo?.show_post_progress_bar_on_scroll || <ReadingProgress />}
            <ArticleHeader
                category={dummyBlogContent?.category?.category_name}
                date={dayjs(dummyBlogContent?.created_at).format('DD MMMM YYYY')}
                // readTime={blog.read_time}
                title={dummyBlogContent?.blog_title}
                // excerpt={blog.blog_excerpt}
                author={dummyBlogContent?.author_details as any || {}}
                isPreview={isPreview}
                description={dummyBlogContent?.blog_description}
            />
            <div className='px-4'>
                <MobileTableOfContents editor={editor} />
            </div>
{dummyBlogContent?.blog_info?.featured_image?.url &&
            <HeroImage
                src={dummyBlogContent?.blog_info?.featured_image?.url  || ''}
                alt={dummyBlogContent?.blog_title}
            />}

            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
                <div className='flex flex-col lg:flex-row gap-4'>
                    <aside className='hidden lg:block lg:w-80 lg:flex-shrink-0 order-2 lg:order-1'>
                        <TableOfContents editor={editor} />
                    </aside>

                    <div className='flex-1 order-1 lg:order-2 min-w-0'>
                        {/* <BlogContent editor={editor} /> */}
                        <BlogContent value={dummyBlogContent?.content} />
                    </div>
                </div>
                {!template?.seo?.hide_social_sharing_icons && <SocialShare isPreview />}
                <RelatedPosts posts={blogData as any || []} isLoading={false} />
            </div>
            </div>
             <Footer isPreviewMode={true} />
        </div>
    );
};

export default BlogDetailsPage;
