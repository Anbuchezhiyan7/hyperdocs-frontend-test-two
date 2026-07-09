import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SlateEditor } from '@udecode/plate';
import { type Heading } from '@udecode/plate-heading';
import { getHeadingList } from '@/components/plate-ui/toc-element-static';
import Button from '@/components/common/Buttons';
import { useRouter, usePathname } from 'next/navigation';

const TableOfContents: React.FC<{ editor: SlateEditor, isPreview?: boolean }> = ({ editor, isPreview }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const headingList = getHeadingList(editor);
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
                rootMargin: '-20% 0px -80% 0px', // Adjust these values to control when a section is considered "active"
                threshold: 0,
            }
        );

        // Observe all heading elements
        headingList?.forEach(item => {
            const element = document.querySelector(`[data-block-id="${item.id}"]`);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            // Cleanup: disconnect observer when component unmounts
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

    console.log('Heading List', headingList);

    const handleGoBack = () => {
        router.back();

        // if (isPreview) {
        //     router.back();
        // };
        // // If pathname contains "preview", go back to previous page
        // if (pathname?.includes('preview')) {
        //     router.back();
        // } else {
        //     // Navigate to the root domain using Next.js router
        //     router.push('/');
        // }
    };

    return (
        <div className='top-8 sticky'>
             <div className='border-t border-b py-4 mr-8'>
            
                <Button
                                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 text-white transition-all hover:!bg-slate-800 hover:!text-white hover:!border-color-inherit !border-none hover:shadow-lg sm:w-auto"
                                        onClick={handleGoBack}
                                    >
                                        <ArrowLeft size={18} />
                                        Go Back
                                    </Button></div>

            <h3 className='font-jakarta text-sm font-bold text-[#333333] uppercase mt-8 border-b pb-6 pr- tracking-widest'>TABLE OF CONTENTS</h3>

            <nav className="max-h-[calc(100vh-230px)] overflow-y-auto ">
                <ul className='flex flex-col pr-4'>
                    {headingList.map(heading => (
                        <li key={heading.id} className="border-b border-[#E5E5E5] last:border-none">
                            <div
                                onClick={() => handleSectionClick(heading)}
                                className='block py-7 hover:underline font-jakarta font-medium text-[#000000] text-[15px] cursor-pointer leading-snug'
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

export default TableOfContents;
