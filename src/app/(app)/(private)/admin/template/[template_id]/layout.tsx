'use client';

import Footer from '@/components/blog-templates/components/Footer';
import Navbar from '@/components/blog-templates/components/Navbar';
import Navbar3 from '@/components/blog-templates/template-3/components/Navbar';
import Footer3 from '@/components/blog-templates/template-3/components/Footer';
import { useParams } from 'next/navigation';

export default function TemplatePreviewLayout ({ children }: { children: React.ReactNode }) {
    const { id, template_id } = useParams();
    const isTemplate3 = template_id === 'template_003';

    return (
        <>
            {!id && (isTemplate3 ? <Navbar3 isPreviewMode/> : <Navbar isPreviewMode/>)}
            {children}
            {!id && (isTemplate3 ? <Footer3 isPreviewMode/> : <Footer isPreviewMode/>)}
        </>
    );
}
