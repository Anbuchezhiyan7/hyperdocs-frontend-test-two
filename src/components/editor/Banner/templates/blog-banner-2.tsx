import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';
import BannerTemplate2 from '@/assets/templates/BannerTemplate2';
import { getPath } from '@/utils/format/api';
import { getLogoDimensions } from '@/utils/findAspectRatio';
import { getAuthorPathByPathname } from '@/utils/format/api';
import { usePathname, useRouter } from 'next/navigation';
import Cookie from 'js-cookie';

// Removed title prop as the text is now static based on the design
interface BlogBannerProps {
    title: string;
    onAuthorClick?: () => void;
    hideButtons?: boolean;
    mockPathname?: string;
    mockRouter?: any;
    blog?: any;
}

const BlogBanner2: React.FC<BlogBannerProps> = ({ title, onAuthorClick, hideButtons, mockPathname, mockRouter, blog: blogProp }) => {
    const { settings, blog: blogStore } = useAppStore();
    const blog = blogProp || blogStore;
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
        <div className="relative bg-banner-plain bg-cover bg-center text-banner-text font-jakarta overflow-hidden rounded-lg">
            <BannerTemplate2
                className="absolute top-0 left-0 bottom-0 right-0 !w-full !h-full"
                colors={colorPalette}
            />
            <div className="relative z-10 flex flex-col items-center justify-between min-h-[400px] md:min-h-[500px] py-8 px-4 sm:px-6 lg:px-8">
                {/* Logo at the top center */}
                <Link href="/" className="mb-auto pt-4">
                    <Image
                        className="w-[80px] h-auto object-cover"
                        src={logo || ''}
                        alt="logo"
                        width={logoDimensions.width}
                        height={logoDimensions.height}
                    />
                </Link>

                {/* Text in the middle center */}
                <div className="text-center my-auto">
                    {/* my-auto centers vertically */}
                    <div className="text-2xl md:text-3xl text-white/75 lg:text-4xl font-semibold leading-tight max-w-3xl">
                        {title}
                    </div>
                </div>

                {/* Buttons at the bottom */}
                {!hideButtons && (
                    <div className="flex max-w-3xl justify-between items-center w-full my-auto">
                        {' '}
                        {/* mt-auto pushes down */}
                        {blog?.author_details &&
                            (isPreview ? (
                                <div className="flex items-center gap-2 text-white/75 ">
                                    <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden">
                                        <Image
                                            src={authorImage || ''}
                                            alt="logo"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex flex-col items-start">
                                            <p className="text-white/75  text-base capitalize font-medium">
                                                {isPreview
                                                    ? 'Jordan Lee'
                                                    : blog?.author_details?.author_name}
                                            </p>
                                            <p className="text-white/75 text-sm font-medium -ml-0.5">
                                                {isPreview
                                                    ? 'Technical SEO at Ahrefs'
                                                    : blog?.author_details.designation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <span onClick={() => handleGetAuthorPath(blog)}>
                                    <div className="flex items-center gap-2 text-white/75 ">
                                        <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden hover:opacity-80 transition-all duration-300">
                                            <Image
                                                src={authorImage || ''}
                                                alt="logo"
                                                width={50}
                                                height={50}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex flex-col items-start">
                                                <p className="text-white/75  text-base capitalize font-medium">
                                                    {isPreview
                                                        ? 'Jordan Lee'
                                                        : blog?.author_details?.author_name}
                                                </p>
                                                <p className="text-white/75 text-sm font-medium -ml-0.5">
                                                    {isPreview
                                                        ? 'Technical SEO at Ahrefs'
                                                        : blog?.author_details.designation}
                                                </p>
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

export default BlogBanner2;
