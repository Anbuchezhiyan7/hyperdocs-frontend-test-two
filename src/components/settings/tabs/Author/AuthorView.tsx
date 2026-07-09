import Image from 'next/image';
import Link from 'next/link';
import { FaceBookIcon, LinkedInIcon, GlobeIcon, TwitterIcon } from '@/assets/icons';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import { Button } from 'antd';
import { cn } from '@/utils/cn';
interface AuthorViewProps {
    author: any;
    isLoading: boolean;
    isPreview?: boolean;
}

const AuthorView = ({ author, isLoading, isPreview }: AuthorViewProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full">
                <SpinnerLoader />
            </div>
        );
    }

    const socialLinks = [
        {
            icon: FaceBookIcon,
            href: author?.social_links?.facebook,
        },
        {
            icon: TwitterIcon,
            href: author?.social_links?.twitter,
            className: '!text-black',
        },
        {
            icon: LinkedInIcon,
            href: author?.social_links?.linkedin,
        },
        {
            icon: GlobeIcon,
            href: author?.social_links?.website,
            className: '!text-gray-600',
        },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-8 px-2 h-full">
            <div className="flex-1 flex flex-col gap-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#222]">{author?.author_name}</h1>
                <div className="font-jakarta text-sm font-semibold text-[#5d5d5d] mb-2">{author?.designation}</div>
                <div className="font-jakarta text-base font-medium leading-relaxed text-[#222] ">{author?.short_bio}</div>
            </div>
            <div className="flex sticky top-0 flex-col gap-4 h-fit min-w-[280px]">
                <div className="w-[350px] h-[350px] rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={author?.author_image?.url}
                        alt={author?.author_name || ''}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="flex flex-row gap-3 mt-2">
                {socialLinks.map(link => {
                        const IconComponent = link.icon;
                        return (
                            link?.href && (
                                isPreview ? (
                                    <Button
                                        icon={<IconComponent />}
                                        className="rounded-xl !p-4 hover:bg-gray-100 hover:!text-blue-600"
                                        
                                    />
                                ) : (
                                    <Link
                                        href={link.href || ''}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            icon={<IconComponent />}
                                            className="rounded-xl !p-4 hover:bg-gray-100 hover:!text-blue-600"
                                        />
                                    </Link>
                                )
                            )
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AuthorView;
