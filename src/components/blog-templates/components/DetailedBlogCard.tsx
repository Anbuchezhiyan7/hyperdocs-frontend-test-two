import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import dayjs from 'dayjs';
import Image from 'next/image';
import { isValidUrl } from '@/utils/format/string';
import { getPath } from '@/utils/format/api';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';

interface DetailedBlogCardProps {
    post: any; // Ideally use your 'Blog' type here
    className?: string;
    isPreview?: boolean;
}

const DetailedBlogCard: React.FC<DetailedBlogCardProps> = ({ post, className, isPreview }) => {
    const path = isPreview ? '' : getPath(post?.blog_info?.slug_url || '');

    return (
        <div
            className={cn(
                'flex flex-col md:flex-row-reverse rounded-sm gap-6 p-6 justify-between border h-auto min-h-[250px] hover:bg-[#F9F9F9] transition-colors',
                className
            )}
        >
            {/* Image Section */}
            <div className='md:w-[240px] md:flex-shrink-0 h-[200px]'>
                <Link href={path} className='block overflow-hidden h-full'>
                    <Image
                        width={500}
                        height={500}
                        src={
                            post?.blog_info?.featured_image?.url &&
                            (isValidUrl(post?.blog_info?.featured_image?.url) ||
                             post?.blog_info?.featured_image?.url.startsWith('/'))
                                ? optimizeCloudinaryImage(post?.blog_info?.featured_image?.url, 600)
                                : '/images/placeholder/no-image.webp'
                        }
                        alt={post.blog_title || 'Blog Image'}
                        className='w-full h-full object-cover rounded-sm hover:scale-105 transition-transform duration-300'
                    />
                </Link>
            </div>

            {/* Content Section */}
            <div className='md:w-2/3 flex flex-col'>
                {/* Top: Title and Description */}
                <div className='flex-grow'>
                    <Link href={path} className='block'>
                        <h3 className='text-2xl font-medium text-[#333333] font-lora line-clamp-1 mb-2'>
                            {post.blog_title}
                        </h3>
                    </Link>
                    {post?.description && (
                        <p className='font-medium text-[16px] text-[#8F8F8F] line-clamp-2 font-jakarta'>
                            {post?.description}
                        </p>
                    )}
                </div>
                
                <div className='mt-6 flex flex-col gap-3'>
                    {/* Author Row */}
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative border border-gray-100'>
                            <Image
                                fill
                                src={
                                    post?.author_details?.author_image?.url &&
                                    (isValidUrl(post?.author_details?.author_image?.url) ||
                                     post?.author_details?.author_image?.url.startsWith('/'))
                                        ? optimizeCloudinaryImage(post?.author_details?.author_image?.url, 96)
                                        : '/images/placeholder/no-image.webp'
                                }
                                alt={post?.author_details?.author_name || 'Author'}
                                className='object-cover'
                            />
                        </div>
                        <div className='flex flex-col justify-center'>
                            <p className='text-[#333333] text-sm font-semibold font-jakarta'>
                                By {post?.author_details?.author_name || 'Unknown Author'}
                            </p>
                            {post?.author_details?.designation && (
                                <p className='text-xs text-[#8F8F8F] font-jakarta'>
                                    {post.author_details.designation}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Date Row */}
                    {/* <div className='text-xs font-medium text-[#8F8F8F] font-jakarta'>
                        {post?.blog_info?.published_at 
                            ? dayjs(post.blog_info.published_at).format('MMMM DD, YYYY') 
                            : dayjs().format('MMMM DD, YYYY')}
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default DetailedBlogCard;