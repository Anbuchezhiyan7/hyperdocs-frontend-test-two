'use client';

import React from 'react';
import DetailedBlogCard from '../../components/DetailedBlogCard'; 
import CategoriesSidebar from '../../components/CategoriesSidebar';
import SearchBar from '../../components/SearchBar';
import SocialLinks from '../../components/SocialLinks';
import FeaturedBlogSlider from '../../components/FeaturedBlogSlider';
import { useQueryState } from 'nuqs';
import templatesApi from '@/api/templates.api';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import { cn } from '@/utils/cn';
import { useTemplateStore } from '@/store/useTemplateStore';
import Cookies from 'js-cookie';
import { blogData,dummyCategories } from '../../preview/dummyData';

const OtherTopicsPage: React.FC = () => {
    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData('template');
    const user_id = Cookies.get('user_id');
    const [category] = useQueryState('category');
    const [pageType] = useQueryState('page-type');
    const [searchValue, setSearchValue] = useQueryState('search');

    const { data: categorziedBlogs, isLoading: isCategorizedBlogsLoading } = useQuery({
        queryKey: ['categorzied-blogs', category],
        queryFn: () => templatesApi.handleGetCategorizedBlogs(category as string),
        enabled: !!category,
    });


    const filteredBlogs = category ? categorziedBlogs : blogData;

    const title = pageType === 'all' ? 'All Other Topics' : '';

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    const searchFilteredBlogs = searchValue
        ? filteredBlogs?.filter((blog: Blog) =>
              blog.blog_title.toLowerCase().includes(searchValue.toLowerCase())
          )
        : filteredBlogs;

    const font = `!font-${template?.advanced?.blog_ui_font}`;

    return (
        <>
            <h1 className={cn(font, 'text-5xl text-center py-16')}>{title}</h1>

            <FeaturedBlogSlider blogs={blogData as any || []} isLoading={false} isPreview />

            <div className='flex flex-col md:flex-row sticky top-20 gap-8 mt-8'>
                <div className='md:w-1/4 hidden md:block sticky top-20'>
                    <CategoriesSidebar categories={dummyCategories} />
                </div>

                <div className='md:w-2/4'>
                    <h2 className='text-2xl font-medium mb-6'>All Other Topics</h2>
                    <div className='flex flex-col gap-2'>
                        {isCategorizedBlogsLoading ? (
                            <Skeleton className='h-[500px] w-full' />
                        ) : (
                            searchFilteredBlogs?.map((post: Blog) => (
                                <DetailedBlogCard key={post.blog_id} post={post} isPreview/>
                            ))
                        )}
                    </div>
                </div>

                <div className='md:w-1/4'>
                    <div className='space-y-8'>
                        <SearchBar onSearch={handleSearch} value={searchValue || ''} />
                        <SocialLinks  isPreview/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OtherTopicsPage;
