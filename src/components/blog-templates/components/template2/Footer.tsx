'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dummyFooter, previewTemplateContent } from '../../preview/dummyData';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useQueryState } from 'nuqs';
import { getLogoDimensions } from '@/utils/findAspectRatio';
import { cn } from '@/utils/cn';

const Footer: React.FC = () => {
    const [mode] = useQueryState('mode');
    const isPreview = mode === 'preview';
    const template = useTemplateStore((state) => state.templateData?.['template']);
    const leadMagnets = useTemplateStore((state) => state.templateData?.['leadMagnets']) as any[];
    const isStickyLeadMagnet = leadMagnets?.some(
        (lm) => lm?.leadMagnet_id && lm?.config?.placement === 'sticky'
    );

    const footerData = template?.footer || [];
    const footerLogoAspectRatio = template?.advanced?.footer_logo?.aspect_ratio;
    const footerLogoDimensions = isPreview ? { width: 178, height: 28 } : getLogoDimensions(footerLogoAspectRatio);

    const logoUrl = template?.advanced?.footer_logo?.url || '/images/placeholder/no-image.webp';
    const path = '/';

    return (
        <footer className='bg-white border-t border-[#E0E0E0] mt-16 py-12'>
            <div className='w-[90%] mx-auto'>
                <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-8', isStickyLeadMagnet && 'pb-20')}>
                    <div className='col-span-1'>
                        <Link href={path} className='inline-block mb-6'>
                            <div
                                style={{
                                    width: `${footerLogoDimensions.width}px`,
                                    height: `${footerLogoDimensions.height}px`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: "150px"
                                }}
                            >
                                <Image
                                    src={isPreview ? '/images/blogs/DummyLogo.png' : logoUrl}
                                    alt='Footer Logo'
                                    className='object-contain'
                                    width={footerLogoDimensions.width}
                                    height={footerLogoDimensions.height}
                                />
                            </div>
                        </Link>
                        <p className='text-[#5D5D5D] text-sm mb-6 max-w-xs'>
                            {isPreview 
                                ? previewTemplateContent.footerDescription 
                                : (template?.general?.description || template?.advanced?.short_description)}
                        </p>
                    </div>

                    {(isPreview && footerData.length === 0) ? (
                        dummyFooter.map(item => (
                            <div key={item.menu_id} className='col-span-1'>
                                <h3 className='font-semibold text-lg mb-4'>{item.menu_name}</h3>
                                <ul className='space-y-3'>
                                    {item.menu_link.map((link: any) => (
                                        <li key={link.link_name}>
                                            <span className='text-[#5D5D5D] hover:text-[#FF5200] transition-colors cursor-pointer'>
                                                {link.link_name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        !template?.seo?.hide_default_menu_items_in_footer && footerData.map((item: any, index: number) => (
                            <div key={index} className='col-span-1'>
                                <h3 className='font-semibold text-lg mb-4'>{item?.menu_name}</h3>
                                <ul className='space-y-3'>
                                    {item?.menu_link?.map((link: any) => (
                                        <li key={link?.link_name}>
                                            <Link
                                                href={link?.link_url}
                                                target='_blank'
                                                className='text-[#5D5D5D] hover:text-[#FF5200] transition-colors'
                                            >
                                                {link?.link_name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
