import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

import { SlateEditor } from '@udecode/plate';
import { type Heading } from '@udecode/plate-heading';
import { getHeadingList } from '@/components/plate-ui/toc-element-static';

const TableOfContents: React.FC<{ editor: SlateEditor }> = ({ editor }) => {
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

    console.log(headingList);
    return (
        <div className='rounded-lg p-6 sticky top-8'>
            <h3 className='text-lg font-semibold text-gray-dark mb-4'>TABLE OF CONTENTS</h3>
            <nav>
                <ul className='space-y-2'>
                    {headingList?.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => handleSectionClick(item)}
                                className={clsx(
                                    'text-left w-full text-sm py-1 px-2 rounded transition-colors cursor-pointer',
                                    'hover:bg-blue-500/10 hover:text-blue-500',
                                    activeSection === item.id && 'bg-blue-500/10 text-blue-500'
                                )}
                            >
                                {item.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default TableOfContents;
