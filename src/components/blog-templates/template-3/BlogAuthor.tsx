'use client';

import templatesApi from '@/api/templates.api';
import AuthorView from '@/components/settings/tabs/Author/AuthorView';
import { useQuery } from '@tanstack/react-query';
import { Divider } from 'antd';
import Cookie from 'js-cookie';
import BlogSection from '../components/BlogSection';
import { useTemplate3Bg } from './useTemplate3Bg';

export const BlogAuthor = () => {
    const author_id = Cookie.get('author_id');
    const bgColor = useTemplate3Bg();

    const { data: author, isLoading: isAuthorLoading } = useQuery({
        queryKey: ['author', author_id],
        queryFn: () => templatesApi.handleGetAuthorDetails(author_id as string),
        enabled: !!author_id,
        meta: { persist: true },
    });

    const { data: blogs, isLoading: isBlogsLoading } = useQuery({
        queryKey: ['author-blogs', author_id],
        queryFn: () => templatesApi.handleGetBlogsByAuthor(author_id as string),
        enabled: !!author_id,
        meta: { persist: true },
    });

    return (
        <div className='min-h-screen w-full' style={{ backgroundColor: bgColor }}>
            <div className='flex flex-col items-center pt-10'>
                <div className="md:w-[75%] w-full px-4">
                    <AuthorView author={author} isLoading={isAuthorLoading} />
                </div>
                <Divider />
                <div className="md:w-[75%] w-full px-4">
                    <BlogSection
                        showSeeAll={false}
                        title="More Blogs by This Author"
                        blogs={blogs || []}
                        isLoading={isBlogsLoading}
                        pageType="featured"
                        showMostPopular={false}
                    />
                </div>
            </div>
        </div>
    );
};
