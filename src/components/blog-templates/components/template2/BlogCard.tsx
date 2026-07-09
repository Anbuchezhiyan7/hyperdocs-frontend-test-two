'use client';
import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import Image from 'next/image';
import { isValidUrl } from '@/utils/format/string';
import { cn } from '@/utils/cn';
import { useTemplateStore } from '@/store/useTemplateStore';
import { getPath } from '@/utils/format/api';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';
interface BlogCardProps {
    post: Blog;
    isPreview?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, isPreview }) => {
    const path = isPreview ? '' : getPath(post?.blog_info?.slug_url || '');
    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData('template');

    // Improved image URL handling with better fallback logic
    const getImageUrl = () => {
        const imageUrl = post?.blog_info?.featured_image?.url;
        if (!imageUrl) return '/images/placeholder/no-image.webp';
        
        // Check if it's a valid URL or starts with '/'
        if (isValidUrl(imageUrl) || imageUrl.startsWith('/')) {
            return imageUrl;
        }
        
        return '/images/placeholder/no-image.webp';
    };

    return (
        <div className='group'>
            <div className='overflow-hidden rounded-md mb-3'>
                <Link href={path}>
                    <Image
                        src={optimizeCloudinaryImage(getImageUrl(), 800)}
                        alt={post.blog_title || 'Blog post'}
                        width={800}
                        height={600}
                        unoptimized={true}
                        className='w-full h-64 object-fill group-hover:scale-105 transition-transform duration-300 rounded-2xl'
                    />
                </Link>
            </div>

            <div>
                <div className='mb-2'>
                    <span className='text-xs text-[#5D5D5D] font-dm-sans font-medium'>{post.category?.category_name}</span>
                    <span className='mx-2 text-[#5D5D5D]'>•</span>
                    <span className='text-xs text-[#5D5D5D] font-dm-sans font-medium'>
                        {dayjs(post.created_at).format('DD MMMM YYYY')}
                    </span>
                </div>

                <Link href={path}>
                    <h3 className='text-2xl font-dm-sans font-semibold text-[#333333] mb-2 group-hover:text-primary transition-colors line-clamp-2'>
                        {post.blog_title}
                    </h3>
                </Link>

                <p className='text-[#5D5D5D] font-dm-sans font-medium text-sm mb-3 line-clamp-2'>{post?.description}</p>

                <div className={cn('flex items-center', template?.seo?.hide_authors && '!hidden')}>
                    <Image
                        src={
                            post.author_details?.author_image?.url &&
                            (isValidUrl(post.author_details?.author_image?.url) ||
                             post.author_details?.author_image?.url.startsWith('/'))
                                ? optimizeCloudinaryImage(post.author_details?.author_image?.url, 96)
                                : '/images/placeholder/no-image.webp'
                        }
                        alt={post.author_details?.author_name || 'Author'}
                        className='md:w-10 md:h-10 w-8 h-8 rounded-full mr-2'
                        width={36}
                        height={36}
                    />
                    <span className='md:text-lg text-sm font-dm-sans font-semibold text-[#5D5D5D]'>
                        {post.author_details?.author_name}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
