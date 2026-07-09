'use client';
import React from 'react';
import { TemplateIcon } from '@/assets/icons';
import ViewBlogButton from '../common/Navbar/ViewBlogButton';

const TemplateNav = () => {
    return (
        <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
                <TemplateIcon className="h-6 w-6" />
                <div className="flex flex-col">
                    <h1 className="text-[20px] font-[700] leading-tight text-[#0F0F0F]">
                        Templates
                    </h1>
                    <p className="text-[13px] font-[500] text-[#8A8A8A]">
                        Choose a layout and personalize how your blog looks
                    </p>
                </div>
            </div>
            <ViewBlogButton />
        </div>
    );
};

export default TemplateNav;
