'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTemplateStore } from '@/store/useTemplateStore';
import { getLogoDimensions } from '@/utils/findAspectRatio';
import { useQueryState } from 'nuqs';
import { dummyFooter, previewTemplateContent } from '../preview/dummyData';

import { cn } from '@/utils/cn';

interface FooterProps {
    isPreviewMode?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isPreviewMode }) => {
    const [mode, _] = useQueryState('mode');
    const isPreview = mode === 'preview' || isPreviewMode;

    const template = useTemplateStore((state) => state.templateData?.['template']);
    const leadMagnets = useTemplateStore((state) => state.templateData?.['leadMagnets']) as any[];
    const isStickyLeadMagnet = leadMagnets?.some(
        (lm: any) => lm?.details?.cta_placement === 'sticky_sidebar'
    );
    const footerData = template?.footer || [];
    const footerLogoAspectRatio = template?.advanced?.footer_logo?.aspect_ratio;
    const footerLogoDimensions = isPreview ? { width: 178, height: 28 } : getLogoDimensions(footerLogoAspectRatio);
    console.log(footerData, 'FOOTER DATA');
    const path = isPreview ? '#' : '/';
    return (
        <footer className="bg-white border-t border-border md:py-10 py-4">
            <div className="w-[90%] mx-auto">
                <div className="flex flex-col md:flex-row justify-between md:gap-12 gap-1">
                    <div className="max-w-sm">
                        <div className="flex flex-col gap-2">
                            <Link href={path} className="inline-block md:mb-6 mb-4">
                                <div
                                    style={{
                                        width: `${footerLogoDimensions.width}px`,
                                        height: `${footerLogoDimensions.height}px`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth:"150px"
                                    }}
                                >
                                    <Image
                                        src={
                                            isPreview
                                                ? '/images/blogs/DummyLogo.png'
                                                : template?.advanced?.footer_logo?.url ||
                                                  '/images/placeholder/no-image.webp'
                                        }
                                        alt="Footer Logo"
                                        className="object-contain min-w-[150px]"
                                        width={footerLogoDimensions.width}
                                        height={footerLogoDimensions.height}
                                        priority
                                    />
                                </div>
                            </Link>
                            <p className="text-[#8f8f8f] text-[16px] leading-relaxed font-jakarta font-medium mb-6">
                                {isPreview
                                    ? previewTemplateContent.footerDescription
                                    : template?.general?.description}{' '}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                hidden={!template?.seo?.privacy_policy_url}
                                target={'_blank'}
                                href={template?.seo?.privacy_policy_url || ''}
                                className="text-textSecondary hover:text-primary hover:underline transition-colors text-sm "
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                    <div className={cn("flex flex-col sm:flex-row gap-16 md:gap-32", isStickyLeadMagnet && "pb-20")}>
                        {isPreview ? (
                            dummyFooter.map((item: any, index: number) => (
                                <div key={index} className="min-w-[120px]">
                                    <h3 className="font-jakarta font-bold text-xl text-[#333333] mb-8">
                                        {item?.menu_name}
                                    </h3>
                                    <ul className="space-y-6">
                                        {item?.menu_link?.map((link: any) => (
                                            <li key={link?.link_name}>
                                                <span className="text-[#333333] font-jakarta font-semibold text-[16px] cursor-pointer hover:text-primary transition-colors">
                                                    {link?.link_name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <>
                                {!template?.seo?.hide_default_menu_items_in_footer &&
                                    footerData.map((item: any, index: number) => (
                                        <div key={index} className="min-w-[120px]">
                                            <h3 className="font-lora font-bold text-xl text-[#333333] md:mb-8 mb-2">
                                                {item?.menu_name}
                                            </h3>
                                            <ul className="space-y-6">
                                                {item?.menu_link?.map((link: any) => (
                                                    <li key={link?.link_name}>
                                                        <Link
                                                            href={link?.link_url}
                                                            target={'_blank'}
                                                            className="text-[#333333] font-jakarta font-medium text-[16px] hover:text-primary transition-colors"
                                                        >
                                                            {link?.link_name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
