import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { isValidUrl } from '@/utils/format/string';
import { useTemplateStore } from '@/store/useTemplateStore';
import { getPath } from '@/utils/format/api';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';

interface FeaturedPostProps {
    post: Blog;
    isPreview?: boolean;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post, isPreview }) => {
    const path = isPreview
        ? `/admin/template/template_002/${post?.blog_info?.slug_url}`
        : getPath(post?.blog_info?.slug_url || '');

    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData('template');

    const getImageUrl = () => {
        const imageUrl = post?.blog_info?.featured_image?.url;
        if (!imageUrl) return '/images/placeholder/no-image.webp';

        if (isValidUrl(imageUrl) || imageUrl.startsWith('/')) {
            return imageUrl;
        }

        return '/images/placeholder/no-image.webp';
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-10 gap-6 xl:gap-10 mb-6 md:mb-10'>
            
            {/* IMAGE */}
            <div className='relative w-full h-[260px] md:h-[380px] xl:h-[460px] 2xl:h-[520px] overflow-hidden  xl:col-span-6'>
                <Link href={path} className='flex w-full h-full'>
                    <Image
                        src={optimizeCloudinaryImage(getImageUrl(), 1200)}
                        alt={post?.blog_title || 'Blog post'}
                        fill
                        priority
                        unoptimized
                        className='object-cover transition-transform duration-300 hover:scale-105 !h-auto rounded-2xl'
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 60vw"
                    />
                </Link>
            </div>

            {/* CONTENT */}
<div className='flex flex-col justify-start xl:col-span-4'>                
                <div className='mb-2 text-sm text-[#5d5d5d] font-medium'>
                    <span>{post?.category?.category_name}</span>
                    <span className='mx-2'>•</span>
                    <span>{dayjs(post?.created_at).format('DD MMMM YYYY')}</span>
                </div>

                <Link href={path}>
                    <h2 className='text-lg md:text-xl xl:text-2xl font-semibold text-[#333] mb-3 hover:text-primary transition-colors'>
                        {post?.blog_title}
                    </h2>
                </Link>

                <p className='text-[#5D5D5D] text-sm md:text-base mb-4 line-clamp-3'>
                    {post?.description || ''}
                </p>

                <div
                    className={cn(
                        post?.author_details || !template?.seo?.hide_authors
                            ? 'flex items-center gap-2'
                            : 'hidden'
                    )}
                >
                    <Image
                        width={40}
                        height={40}
                        src={
                            post.author_details?.author_image?.url &&
                            (isValidUrl(post.author_details?.author_image?.url) ||
                                post.author_details?.author_image?.url.startsWith('/'))
                                ? optimizeCloudinaryImage(post.author_details?.author_image?.url, 96)
                                : '/images/placeholder/no-image.webp'
                        }
                        alt={post.author_details?.author_name || 'Author'}
                        className='w-8 h-8 md:w-10 md:h-10 rounded-full'
                    />
                    <span className='text-sm md:text-base font-semibold text-[#5D5D5D]'>
                        {post.author_details?.author_name}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FeaturedPost;