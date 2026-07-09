'use client';

import AuthorView from '@/components/settings/tabs/Author/AuthorView';
import { Divider } from 'antd';
import RelatedPosts from './RelatedPosts';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import { dummyAuthor, blogData } from '../../preview/dummyData';

export const BlogAuthor = () => {

    return (
        <div className="flex flex-col py-6 items-center">
            <div className="w-[90%]">
                <div className="flex flex-col gap-2">

                    <h2 className="text-md font-bold text-gray-dark px-2 uppercase">Authors</h2>
                    <AuthorView author={dummyAuthor} isLoading={false} isPreview />
                </div>
            </div>
            <Divider />
            <div className="w-[90%] h-fit">
                <RelatedPosts posts={(blogData as any) || []} title="More blogs by this author" isPreview />
            </div>
        </div>
    );
};
