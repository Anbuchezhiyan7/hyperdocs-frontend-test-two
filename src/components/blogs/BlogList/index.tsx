import React from 'react';
import BlogItem from '@/components/blogs/BlogItem';
import Navbar from '@/components/common/Navbar';

interface BlogList {
    data: Blog[];
}

const BlogList: React.FC<BlogList> = ({ data }) => {
    return (
        <div className='flex flex-col'>
            <Navbar title='My Blogs' />
            <div className='p-6 bg-white'>
                <div className='flex items-center mb-6'>
                    <h3 className='text-lg font-semibold text-gray-800'>My Blogs</h3>
                </div>

                <div className='bg-white rounded-lg shadow-sm'>
                    {data.map(blog => (
                        <BlogItem key={blog.blog_id} blog={blog} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;
