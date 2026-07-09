"use client";

import React from 'react';
import templates from '../editor/Banner/templates';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';

interface BannerData {
    banner_id: string;
    blog_id: string;
    banner_title: string;
    banner_url: string | null;
    banner_type: string;
    banner_template_id: string;
    alt_text: string;
    created_at: string;
    updated_at: string;
    accepted: boolean;
}

interface BannerProps {
    bannerData: BannerData | null;
    visualMode?: boolean;
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    blog?: any;
}

const Banner = ({ bannerData, visualMode = false, width, align, blog }: BannerProps) => {
    if (!bannerData) return null;

    const currentTemplate = templates.find(template => template.id === bannerData.banner_template_id);
    const TemplateComponent = currentTemplate?.component as any;

    if (visualMode) { 
        return (
            <div className="my-8 w-full overflow-hidden rounded-xl shadow-md bg-gray-50">
                {bannerData.banner_type === 'template' && TemplateComponent ? (
                    <TemplateComponent
                        title={bannerData.banner_title}
                        hideButtons={false}
                        blog={blog}
                    />
                ) : (
                    <div className="relative w-full aspect-[21/9]">
                        {bannerData.banner_url ? (
                            <img
                                src={optimizeCloudinaryImage(bannerData.banner_url)}
                                alt={bannerData.alt_text || bannerData.banner_title}
                                className="w-full h-full object-cover my-0"
                                loading="lazy"
                                decoding="async"
                            />
                        ) : (
                            <div className="p-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white min-h-[200px] flex items-center justify-center">
                                <h2 className="text-3xl font-bold">{bannerData.banner_title}</h2>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // SEO/Schema mode
    return (
        <div className="banner-container my-4" itemScope itemType="https://schema.org/ImageObject">
            {bannerData.banner_url ? (
                <img
                    src={optimizeCloudinaryImage(bannerData.banner_url)}
                    alt={bannerData.alt_text || bannerData.banner_title}
                    itemProp="contentUrl"
                    style={{ width: width || '100%', height: 'auto' }}
                    className="rounded-lg shadow-sm"
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <div className="text-xl font-bold" itemProp="name">{bannerData.banner_title}</div>
            )}
            <meta itemProp="name" content={bannerData.banner_title} />
        </div>
    );
};

export default Banner;
