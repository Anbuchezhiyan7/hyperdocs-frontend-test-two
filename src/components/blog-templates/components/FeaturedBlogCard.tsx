import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import dayjs from 'dayjs';
import Image from 'next/image';
import { getPath } from '@/utils/format/api';
import { isValidUrl } from '@/utils/format/string';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';
interface FeaturedBlogCardProps {
    blog: Blog;
    className?: string;
    isPreview?: boolean;
}

const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({ blog, className, isPreview }) => {
    const path = isPreview ? '' : getPath(blog?.blog_info?.slug_url || '');
    
    const getImageUrl = () => {
        const imageUrl = blog?.blog_info?.featured_image?.url;
        if (!imageUrl) return '/images/placeholder/no-image.webp';
        
        // Check if it's a valid URL or starts with '/'
        if (isValidUrl(imageUrl) || imageUrl.startsWith('/')) {
            return imageUrl;
        }
        
        return '/images/placeholder/no-image.webp';
    };
    return (
        <Link href={path} className={cn('group block overflow-hidden', className)}>
            <div className='aspect-[4/3] overflow-hidden'>
                <Image
                    width={500}
                    height={500}
                    src={optimizeCloudinaryImage(getImageUrl(), 800)}
                    alt={blog.blog_title}
                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
            </div>
            <div className='pt-3'>
                <h3 className='font-medium text-lg text-textPrimary mb-2 line-clamp-2 group-hover:text-primary transition-colors'>
                    {blog.blog_title}
                </h3>
                <p className='text-textTertiary text-sm'>
                    {dayjs(blog.created_at).format('DD MMMM YYYY')}
                </p>
            </div>
        </Link>
    );
};

export default FeaturedBlogCard;
