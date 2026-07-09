import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from './BlogCard';

interface RelatedArticlesProps {
    blogs: Blog[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ blogs }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const totalPages = Math.ceil((blogs?.length || 0) / itemsPerPage);

    const handlePrevious = () => {
        setCurrentPage(prev => (prev === 0 ? totalPages - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => (prev === totalPages - 1 ? 0 : prev + 1));
    };

    const getVisibleBlogs = () => {
        if (!blogs) return [];
        const start = currentPage * itemsPerPage;
        return blogs.slice(start, start + itemsPerPage) || [];
    };

    return (
        <section className='py-12 border-t border-border mt-12'>
            <div className='flex items-center justify-between mb-8'>
                <h2 className='text-2xl font-lora font-medium'>MORE ARTICLES</h2>
                <div className='flex space-x-2'>
                    <button
                        onClick={handlePrevious}
                        className='p-1 rounded-full border border-border hover:bg-gray-100 transition-colors'
                        aria-label='Previous slide'
                    >
                        <ChevronLeft className='h-5 w-5' />
                    </button>
                    <button
                        onClick={handleNext}
                        className='p-1 rounded-full border border-border hover:bg-gray-100 transition-colors'
                        aria-label='Next slide'
                    >
                        <ChevronRight className='h-5 w-5' />
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {getVisibleBlogs()?.map((blog: Blog) => (
                    <BlogCard key={blog.blog_id} post={blog} />
                ))}
            </div>
        </section>
    );
};

export default RelatedArticles;
