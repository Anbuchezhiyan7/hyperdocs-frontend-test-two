import Button from '@/components/common/Buttons';
import { Input } from '@/components/common/Input';
import { cn } from '@/utils/cn';
import React from 'react';
import { useQueryState } from 'nuqs';
import { useTemplateStore } from '@/store/useTemplateStore';
import { SearchIcon } from '@/assets/icons';

interface BlogHeaderProps {
    title: string;
    description?: string;
    headerButtonDetails?: {
        label: string;
        link: string;
    };
    isPreview?: boolean;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ title, description, headerButtonDetails }) => {
    const { getTemplateData } = useTemplateStore();
    const [mode, _] = useQueryState('mode');
    const isPreview = mode === 'preview';
    const template = getTemplateData('template');
    const className = ` w-fit min-w-[256px] h-[48px] text-[#E6E6E6] hover:!border-inherit hover:!text-[#E6E6E6] mt-3 !rounded-sm font-dm-sans font-medium`;
    const [search, setSearch] = useQueryState('search');
    
    const handleOnClick = () => {
        if (isPreview) {
            return;
        }
        if (headerButtonDetails?.link?.length === 0) return;
        window.open(headerButtonDetails?.link, '_blank');
    };
    const showSearch = template?.seo?.show_searchbar_on_homepage || isPreview;

    return (
        <div className="text-center pt-4 md:pt-8 py-4 md:py-8 flex flex-col gap-2 items-center">
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
                            inputClassName="!rounded-none !border-b !border-t-0 !border-l-0 !border-r-0"
                            onChange={value => setSearch(value)}
                            suffix={<SearchIcon />}
                        />
                    )}
                </div>
                {description && (
                    <p className="text-textSecondary max-w-2xl mx-auto font-medium">{description}</p>
                )}
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
