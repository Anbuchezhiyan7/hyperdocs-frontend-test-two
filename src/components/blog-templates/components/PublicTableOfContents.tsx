'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/common/Buttons';
import { useRouter, usePathname } from 'next/navigation';

interface Heading {
    id: string;
    title: string;
    depth: number;
}

const extractHeadings = (content: any[]): Heading[] => {
    if (!content || !Array.isArray(content)) return [];
    const headings: Heading[] = [];
    content.forEach(block => {
        if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
            const depth = parseInt(block.type.replace('h', ''), 10);
            const title = block.children?.map((c: any) => c.text || '').join('') || '';
            if (title.trim()) {
                headings.push({ id: block.id, title, depth });
            }
        }
    });
    return headings;
};

const PublicTableOfContents: React.FC<{ content: any[] }> = ({ content }) => {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const headingList = extractHeadings(content);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('data-block-id');
                        if (id) {
                            setActiveSection(id);
                        }
                    }
                });
            },
            {
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0,
            }
        );

        headingList.forEach(item => {
            const element = document.querySelector(`[data-block-id="${item.id}"]`);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [headingList]);

    const handleSectionClick = (item: Heading) => {
        setActiveSection(item.id);
        const element = document.querySelector(`[data-block-id="${item.id}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const pathname = usePathname();
    const handleGoBack = () => {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length > 1) {
            router.push('/' + segments.slice(0, -1).join('/'));
        } else {
            router.push('/');
        }
    };

    if (headingList.length === 0) return null;

    return (
        <div className='top-8 sticky'>
            <div className='border-t border-b py-4 mr-8'>
                <Button
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 text-white transition-all hover:!bg-slate-800 hover:!text-white hover:!border-color-inherit !border-none hover:shadow-lg sm:w-auto"
                    onClick={handleGoBack}
                >
                    <ArrowLeft size={18} />
                    Go Back
                </Button>
            </div>

            <h3 className='font-jakarta text-sm font-bold text-[#333333] uppercase mt-8 border-b pb-6 pr- tracking-widest'>TABLE OF CONTENTS</h3>

            <nav className="max-h-[calc(100vh-230px)] overflow-y-auto ">
                <ul className='flex flex-col pr-4'>
                    {headingList.map(heading => (
                        <li key={heading.id} className="border-b border-[#E5E5E5] last:border-none">
                            <div
                                onClick={() => handleSectionClick(heading)}
                                className='block py-7 hover:underline font-jakarta font-medium text-[#000000] text-[15px] cursor-pointer leading-snug'
                                style={{ paddingLeft: `${(heading.depth - 1) * 16}px` }}
                            >
                                {heading.title}
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default PublicTableOfContents;
