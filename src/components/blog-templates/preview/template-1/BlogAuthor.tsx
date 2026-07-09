'use client';

import templatesApi from '@/api/templates.api';
import AuthorView from '@/components/settings/tabs/Author/AuthorView';
import { useQuery } from '@tanstack/react-query';
import { Divider } from 'antd';
import { useParams } from 'next/navigation';
import BlogSection from '../../components/BlogSection';
import { dummyAuthor ,blogData} from '../../preview/dummyData';

export const BlogAuthor = () => {

    return (
        <div className="w-screen flex flex-col items-center mt-10">
            <div className="md:w-[75%] w-full px-4">
                <AuthorView author={dummyAuthor} isLoading={false} isPreview />
            </div>
            <Divider />
            <div className="md:w-[75%] w-full px-4">
                <BlogSection
                    showSeeAll={false}
                    title="More Blogs by This Author"
                    blogs={blogData as any || []}
                    isLoading={false}
                    pageType="featured"
                    isPreview
                    showMostPopular={false}
                />
            </div>
        </div>
    );
};
