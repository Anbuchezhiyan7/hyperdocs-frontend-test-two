import React from 'react';
import BlogCard from '../components/template2/BlogCard';
import { useTemplateStore } from '@/store/useTemplateStore';
import Shimmer from '../components/Shimmer';

interface RelatedPostsProps {
    posts: Blog[];
    title?: string;
    isLoading?: boolean;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts, title = 'READ NEXT', isLoading }) => {
    const { getTemplateData } = useTemplateStore();
    if(posts?.length === 0) return null;
    return (
        <section className='md:pt-12 pt-2 h-fit'>
            <h2 className='text-md font-bold text-gray-700 uppercase mb-8'>{title}</h2>
       <div className='pt-10 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-6'>
                {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                          <div className='col-span-1' key={index}>
                              <Shimmer className='h-[250px]' />
                          </div>
                      ))
                    : posts?.map(post => <BlogCard key={post.blog_id} post={post} />)}
            </div>
        </section>
    );
};

export default RelatedPosts;
