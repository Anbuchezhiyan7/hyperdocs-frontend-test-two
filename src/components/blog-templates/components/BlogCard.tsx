'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useTemplateService } from '@/services/template.service';
import { getPath } from '@/utils/format/api';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';
interface BlogCardProps {
    post: Blog;
    className?: string;
    isPreview?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, className, isPreview }) => {
    const path = isPreview ? '' : getPath(post?.blog_info?.slug_url || '');
    const { getCachedData } = useTemplateService();
    const template = getCachedData('template');
    const font = `!font-${template?.advanced?.blog_ui_font}`;
    const imageUrl =
        post?.blog_info?.featured_image?.url &&
        (post?.blog_info?.featured_image?.url?.startsWith('/') ||
            post?.blog_info?.featured_image?.url?.includes('https://') ||
            post?.blog_info?.featured_image?.url?.includes('http://'))
            ? post?.blog_info?.featured_image?.url
            : '/images/placeholder/no-image.webp';
    return (
        <Link
            href={path}
            className={cn(
                'group block overflow-hidden rounded bg-white p-6 transition-all duration-300 hover:shadow-md min-h-[400px]',
                className,
                font
            )}
        >
            <div className=' overflow-hidden'>
                <Image
                    width={271}
                    height={227}
                    src={optimizeCloudinaryImage(imageUrl, 600)}
                    alt={post?.blog_title}
                    className='object-fill h-[250px] w-[100%] rounded-sm transition-transform duration-300 group-hover:scale-105'
                />
            </div>
            <div className='p-4 pb-0 pl-0'>
                <h3 className='font-lora font-medium line-clamp-2 text-[#333333] text-xl'>
                    {post?.blog_title}
                </h3>
                <p className='mt-10 font-jakarta text-[#8f8f8f] font-medium text-base'>
                    {dayjs(post.created_at).format('DD MMMM YYYY')}
                </p>
            </div>
        </Link>
    );
};

export default BlogCard;
