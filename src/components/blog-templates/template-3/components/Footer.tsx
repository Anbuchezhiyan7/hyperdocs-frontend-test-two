'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTemplateStore } from '@/store/useTemplateStore';
import { getLogoDimensions } from '@/utils/findAspectRatio';
import { useTemplate3Bg } from '../useTemplate3Bg';

interface FooterProps {
    isPreviewMode?: boolean;
}

const Footer3: React.FC<FooterProps> = () => {
    const template = useTemplateStore(state => state.templateData?.['template']);
    const bgColor = useTemplate3Bg();

    const footerData = template?.footer || [];
    const footerLogoDimensions = getLogoDimensions(template?.advanced?.footer_logo?.aspect_ratio);
    const logo = template?.advanced?.footer_logo?.url || '/images/placeholder/no-image.webp';

    return (
        <footer className="border-t border-[#E7DECF] py-10" style={{ backgroundColor: bgColor }}>
            <div className="mx-auto w-full max-w-[1120px] px-5">
                <div className="flex flex-col justify-between gap-10 md:flex-row md:gap-12">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <Link href="/" className="mb-5 inline-block">
                            <div
                                className="flex items-center"
                                style={{ minWidth: '150px', height: `${footerLogoDimensions.height}px` }}
                            >
                                <Image
                                    src={logo}
                                    alt="Footer Logo"
                                    className="object-contain"
                                    width={footerLogoDimensions.width}
                                    height={footerLogoDimensions.height}
                                    priority
                                />
                            </div>
                        </Link>
                        {template?.general?.description && (
                            <p className="mb-5 text-[15px] font-medium leading-relaxed text-[#6B6B6B]">
                                {template.general.description}
                            </p>
                        )}
                        {template?.seo?.privacy_policy_url && (
                            <Link
                                href={template.seo.privacy_policy_url}
                                target="_blank"
                                className="text-sm text-[#6B6B6B] transition-colors hover:text-[#1A1A1A] hover:underline"
                            >
                                Privacy Policy
                            </Link>
                        )}
                    </div>

                    {/* Link columns */}
                    {!template?.seo?.hide_default_menu_items_in_footer && (
                        <div className="flex flex-col gap-12 sm:flex-row sm:gap-20">
                            {footerData.map((item: any, index: number) => (
                                <div key={index} className="min-w-[120px]">
                                    <h3 className="mb-5 text-base font-bold text-[#1A1A1A]">
                                        {item?.menu_name}
                                    </h3>
                                    <ul className="space-y-4">
                                        {item?.menu_link?.map((link: any) => (
                                            <li key={link?.link_name}>
                                                <Link
                                                    href={link?.link_url}
                                                    target="_blank"
                                                    className="text-[15px] font-medium text-[#3A3A3A] transition-colors hover:text-[#1A1A1A]"
                                                >
                                                    {link?.link_name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer3;
