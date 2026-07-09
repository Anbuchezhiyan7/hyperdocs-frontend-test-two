import { useAppStore } from '@/store/useAppStore';
import BlogHeader from '../components/BlogHeader';
import { templateData } from '@/assets/data/blogs';
import FeaturedBlogSlider from '../components/FeaturedBlogSlider';
import BlogSection from '../components/BlogSection';
import OtherTopicsSection from '../components/OtherTopicsSection';
import TagsSection from '../components/TagsSection';

type Props = {};

const BlogTemplate1 = (props: Props) => {
    const { settings } = useAppStore();
    const template = templateData.template_001;
    return (
        <div
            className={`!font-${settings?.advanced?.blog_ui_font} w-[95%] h-full flex flex-col gap-4`}
        >
            <BlogHeader
                title={template?.advanced?.header_title}
                description={template?.advanced?.header_caption}
                headerButtonDetails={{
                    label: template?.advanced?.header_cta_button?.label,
                    link: template?.advanced?.header_cta_button?.url,
                }}
            />
            <BlogSection
                showSeeAll={false}
                title='FEATURED'
                blogs={template.blogs?.slice(0, 4) as any}
                pageType='featured'
                isPreview
            />

            {template?.advanced?.categories?.map((category: any) => (
                <FeaturedBlogSlider
                    key={category?.category_id}
                    id={category?.category_id}
                    title={category?.category_name}
                    isLoading={false}
                    blogs={template.blogs?.slice(0, 4) as any}
                    isPreview
                />
            ))}
            <OtherTopicsSection />
            <TagsSection tags={template?.tags || []} isLoading={false} />
        </div>
    );
};

export default BlogTemplate1;
