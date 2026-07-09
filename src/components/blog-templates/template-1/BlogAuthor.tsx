'use client';

import templatesApi from '@/api/templates.api';
import AuthorView from '@/components/settings/tabs/Author/AuthorView';
import { useQuery } from '@tanstack/react-query';
import { Divider } from 'antd';
import Cookie from 'js-cookie';
import BlogSection from '../components/BlogSection';

export const BlogAuthor = () => {
    const author_id = Cookie.get('author_id');
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
        <div className='w-screen flex flex-col items-center mt-10'>
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
    );
};
