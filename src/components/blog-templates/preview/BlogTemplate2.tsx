import { useAppStore } from '@/store/useAppStore';
import { templateData } from '@/assets/data/blogs';
import BlogHeader from '../components/template2/BlogHeader';
import Scroller from '@/components/common/Scroller';
import { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import CategoryTabs from '../components/template2/CategoryTabs';
import FeaturedPost from '../components/template2/FeaturedPost';
import BlogCard from '../components/template2/BlogCard';

type Props = {};

const BlogTemplate2 = (props: Props) => {
    const { settings } = useAppStore();
    const template = templateData.template_002;
    const swiperRef = useRef<SwiperType>();
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
            <div className='transition-all duration-300 ease-in-out'>
                <div className='mb-8'>
                    <div className='uppercase border-b border-stroke pb-2 flex items-center justify-between text-[#5D5D5D] mb-4'>
                        <span className='font-bold font-sans text-base'>FEATURED</span>
                        <Scroller
                            handlePrevious={() => swiperRef.current?.slidePrev()}
                            handleNext={() => swiperRef.current?.slideNext()}
                        />
                    </div>

                    <Swiper
                        spaceBetween={10}
                        slidesPerView={1}
                        onBeforeInit={swiper => {
                            swiperRef.current = swiper;
                        }}
                    >
                        {template.blogs?.map((blog: any) => (
                            <SwiperSlide key={blog.blog_id}>
                                <FeaturedPost post={blog} isPreview />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <CategoryTabs categories={template?.advanced?.categories as any} />

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {template.blogs?.map((blog: any) => (
                        <BlogCard key={blog.blog_id} post={blog} isPreview />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogTemplate2;
