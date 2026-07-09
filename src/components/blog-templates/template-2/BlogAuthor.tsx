'use client';

import templatesApi from '@/api/templates.api';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import AuthorView from '@/components/settings/tabs/Author/AuthorView';
import { useQuery } from '@tanstack/react-query';
import { Divider } from 'antd';
import Cookie from 'js-cookie';
import RelatedPosts from './RelatedPosts';

export const BlogAuthor = () => {
    const author_id = Cookie.get('author_id');
    const { data: author, isLoading: isAuthorLoading } = useQuery({
        queryKey: ['author', author_id],
        queryFn: () => templatesApi.handleGetAuthorDetails(author_id as string),
        enabled: !!author_id,
        meta: { persist: true },
    });

    const { data: blogs, isLoading: isBlogsLoading } = useQuery<Blog[]>({
        queryKey: ['author-blogs', author_id],
        queryFn: () => templatesApi.handleGetBlogsByAuthor(author_id as string),
        enabled: !!author_id,
        placeholderData: [],
        meta: { persist: true },
    });

    return (
        <div className='flex flex-col py-6 items-center'>
            <div className='w-[90%]'>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-md font-bold text-gray-dark px-2 uppercase'>Authors</h2>
                    <AuthorView author={author} isLoading={isAuthorLoading} />
                </div>
            </div>
            <Divider />
            <div className='w-[90%] h-fit'>
                {isBlogsLoading ? (
                    <div className='flex justify-center items-center h-full'>
                        <SpinnerLoader />
                    </div>
                ) : (
                    <RelatedPosts posts={blogs || []} title='More blogs by this author' />
                )}
            </div>
        </div>
    );
};
