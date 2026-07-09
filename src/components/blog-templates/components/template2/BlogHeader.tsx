import Button from '@/components/common/Buttons';
import { Input } from '@/components/common/Input';
import { useTemplateStore } from '@/store/useTemplateStore';
import { cn } from '@/utils/cn';
import { SearchIcon } from '@/assets/icons';
import { useQueryState } from 'nuqs';
import React from 'react';

interface BlogHeaderProps {
    title: string;
    description?: string;
    headerButtonDetails?: {
        label: string;
        link: string;
    };
    isPreview?: boolean;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({
    title,
    description,
    headerButtonDetails,
    isPreview,
}) => {
    const template = useTemplateStore((state) => state.templateData?.['template']);
    const [search, setSearch] = useQueryState('search');
    const className = ` w-[256px] h-12 font-sans font-medium text-base px-6 text-[#E6E6E6]  hover:!text-white hover:!border-none rounded-[32px]`;

    const handleOnClick = () => {
        if (isPreview) return;
        if (headerButtonDetails?.link?.length === 0) return;
        window.open(headerButtonDetails?.link, '_blank');
    };
    const showSearch = template?.seo?.show_searchbar_on_homepage;

    console.log(headerButtonDetails, 'BLOG 2 LABEL');

    return (
        <div className="text-center md:pt-4 py-4 md:py-16 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center w-full">
                <div className="flex w-full items-center justify-center gap-2 relative">
               <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#333333] font-semibold mb-4">
                        {title || 'Header Title'}
                    </h1>
                    {showSearch && (
                        <Input
                            placeholder="Search articles"
                            name="search"
                            inputType="search"
                            value={search || ''}
                            className="!absolute right-0 !w-[200px]"
                            inputClassName="!rounded-2xl "
                            onChange={value => setSearch(value)}
                            prefix={<SearchIcon />}
                        />
                    )}
                </div>
                {description && <p className="text-[#5D5D5D] max-w-2xl mx-auto font-sans font-medium text-xl">{description}</p>}
            </div>
            {headerButtonDetails && headerButtonDetails?.label && (
                <Button
                    hidden={headerButtonDetails?.label?.length <= 0}
                    onClick={handleOnClick}
                    className={cn(className)}
                    title={headerButtonDetails?.label}
                    style={{
                        backgroundColor: template?.general?.accent_color || '#000000',
                    }}
                />
            )}
        </div>
    );
};

export default BlogHeader;
