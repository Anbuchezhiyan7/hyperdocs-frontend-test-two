import BannerTemplate1 from '@/assets/templates/BannerTemplate1';
import { useAppStore } from '@/store/useAppStore';
import { getAuthorPathByPathname } from '@/utils/format/api';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getLogoDimensions } from '@/utils/findAspectRatio';
import { getPath } from '@/utils/format/api';
import { usePathname, useRouter } from 'next/navigation';
import Cookie from 'js-cookie';

interface BlogBannerProps {
    title: string;
    onAuthorClick?: () => void;
    hideButtons?: boolean;
    mockPathname?: string;
    mockRouter?: any;
    blog?: any;
}

const BlogBanner1: React.FC<BlogBannerProps> = ({ title, onAuthorClick, hideButtons, mockPathname, mockRouter, blog: blogProp }) => {
    const { settings, blog: blogStore } = useAppStore();
    const blog = blogProp || blogStore;

    // Use mocks if provided (when rendering outside Next.js context), otherwise use Next.js hooks
    const pathname = mockPathname !== undefined ? mockPathname : usePathname();
    const router = mockRouter !== undefined ? mockRouter : useRouter();
    const isPreview = pathname?.includes('template') ?? false;

    const logo = isPreview ? '/images/blogs/DummyLogo.png' : settings?.advanced?.logo?.url;
    const authorImage = isPreview
        ? '/images/blogs/Dummy_Author.png'
        : blog?.author_details?.author_image?.url;
    const logoAspectRatio = settings?.advanced?.logo?.aspect_ratio;
    const logoDimensions = getLogoDimensions(logoAspectRatio);
    const colorPalette = isPreview
        ? ['#fc5c04', '#832f01', '#fcbc84', '#7c8484', '#404040', '#c5c4c5']
        : settings?.advanced?.color_palette;

    const handleGetAuthorPath = (blog: Blog) => {
        Cookie.set('author_id', blog?.author_details?.author_id || '');
        let AuthorName = blog?.author_details?.author_name?.toLowerCase().replace(' ', '_');
        let AuthorDesignation =
            blog?.author_details?.designation?.toLowerCase().replace(' ', '_') || 'no_designation';
        router.push(`/blogs/author/${AuthorName}/${AuthorDesignation}`);
    };

    return (
        <div className="relative w-full h-full rounded-lg overflow-hidden text-bannerText ">
            <BannerTemplate1
                className="absolute top-0 left-0 bottom-0 right-0 !w-full !h-full"
                colors={colorPalette}
            />
            {/* Background image is handled by Tailwind bg-banner-gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>{' '}
            <Link href="/" className="inline-block mb-12 absolute top-10 left-10 z-10">
                {/* Using inline SVG for the logo based on the image */}
                <Image
                    className="object-cover"
                    src={logo || ''}
                    alt="logo"
                    width={logoDimensions.width}
                    height={logoDimensions.height}
                />
            </Link>
            {/* Optional overlay */}
            <div className="relative z-10 container-custom py-16 md:py-24 px-10 lg:py-20">
                {/* Logo */}
                {/* Using inline SVG for the logo based on the image */}
                <div className="w-[80px] h-[80px] inline-block mb-12"></div>

                {/* Title */}
                <div className="text-2xl md:text-3xl lg:text-4xl font-semibold !leading-[1.4] max-w-3xl mb-10">
                    {title}
                </div>

                {/* Buttons */}
                {!hideButtons && (
                    <div className="flex flex-col  items-center justify-between sm:flex-row gap-4">
                        {blog?.author_details &&
                            (isPreview ? (
                                <div className="flex items-center gap-2">
                                    <div className="relative  rounded-full overflow-hidden">
                                        <Image
                                            src={authorImage || ''}
                                            alt="logo"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex flex-col items-start">
                                            <p className="text-bannerButtonText text-base capitalize font-medium">
                                                {isPreview
                                                    ? 'Jordan Lee'
                                                    : blog?.author_details?.author_name}{' '}
                                            </p>
                                            <p className="text-bannerButtonText text-sm font-medium -ml-0.5">
                                                {isPreview
                                                    ? 'Technical SEO at Ahrefs'
                                                    : blog?.author_details.designation}{' '}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <span onClick={() => handleGetAuthorPath(blog)}>
                                    <div className="flex items-center gap-2">
                                        <div className="relative  rounded-full overflow-hidden hover:opacity-80 transition-all duration-300">
                                            <Image
                                                src={authorImage || ''}
                                                alt="logo"
                                                width={50}
                                                height={50}
                                                className='rounded-full'
                                            />
                                        </div>
                                        <div>
                                            <div className="flex flex-col items-start">
                                                <p className="text-bannerButtonText text-base capitalize font-medium my-0">
                                                    {isPreview
                                                        ? 'Jordan Lee'
                                                        : blog?.author_details?.author_name}{' '}
                                                </p>
                                              {(isPreview || (!isPreview && blog?.author_details?.designation)) && (
  <p className="text-bannerButtonText text-sm font-medium -ml-0.5 my-0">
    {isPreview
      ? 'Technical SEO at Ahrefs'
      : blog?.author_details?.designation}
  </p>
)}
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            ))}
                    </div>
                )}
            </div>
        </div>  
    );
};

export default BlogBanner1;
