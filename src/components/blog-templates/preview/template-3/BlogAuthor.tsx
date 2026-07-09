'use client';

/**
 * PREVIEW (dashboard) author page for Template 3.
 * Uses the SHARED preview dummy data (same as templates 1 & 2 previews).
 */

import React from 'react';
import AuthorView from '@/components/settings/tabs/Author/AuthorView';
import { useTemplateStore } from '@/store/useTemplateStore';
import Navbar3 from '../../template-3/components/Navbar';
import Footer3 from '../../template-3/components/Footer';
import RelatedPosts from '../../template-3/components/RelatedPosts';
import { dummyAuthor, blogData } from '../dummyData';
import { useTemplate3Bg } from '../../template-3/useTemplate3Bg';

export const BlogAuthor: React.FC = () => {
    const template = useTemplateStore(state => state.templateData?.['template']);
    const accent = template?.general?.accent_color || '#FF5A1F';
    const bgColor = useTemplate3Bg();
    const font = template?.advanced?.blog_ui_font ? `!font-${template.advanced.blog_ui_font}` : '';

    return (
        <div className={`min-h-screen ${font}`} style={{ ['--accent3' as string]: accent, backgroundColor: bgColor }}>
            <Navbar3 />
            <div className="mx-auto w-full max-w-[1120px] px-5 pb-20 pt-10 md:pt-14">
                <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-[#9A8F7E]">
                    Author
                </h2>
                <div className="rounded-3xl border border-[#E7DECF] bg-white/60 p-6 md:p-8">
                    <AuthorView author={dummyAuthor} isLoading={false} isPreview />
                </div>

                <div className="mt-4">
                    <RelatedPosts posts={blogData as any} />
                </div>
            </div>
            <Footer3 />
        </div>
    );
};

export default BlogAuthor;
