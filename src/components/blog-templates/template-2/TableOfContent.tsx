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
                rootMargin: '-10% 0px -85% 0px', // When the heading is in the top 10%
                threshold: 0,
            }
        );

        const observedIds = new Set<string>();

        const attachObservers = () => {
            headingList?.forEach(item => {
                if (!observedIds.has(item.id)) {
                    const element = document.querySelector(`[data-block-id="${item.id}"]`);
                    if (element) {
                        observer.observe(element);
                        observedIds.add(item.id);
                    }
                }
            });
        };

        // Attempt initial attachment
        attachObservers();

        // Retry interval to ensure lazy-loaded content is eventually observed
        const interval = setInterval(() => {
            attachObservers();
            if (headingList && observedIds.size >= headingList.length) {
                clearInterval(interval);
            }
        }, 500);

        // Safety timeout to stop checking after 5 seconds
        const timeout = setTimeout(() => clearInterval(interval), 5000);

        return () => {
            observer.disconnect();
            clearInterval(interval);
            clearTimeout(timeout);
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
        <div className='rounded-lg p-6 sticky top-20'>
            <h3 className='text-base font-dm-sans font-bold text-[#5d5d5d] mb-4'>TABLE OF CONTENTS</h3>
            <nav>
                <ul className='space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto'>
                    {headingList?.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => handleSectionClick(item)}
                                className={clsx(
                                    'text-left w-full py-1 px-2 rounded transition-colors text-sm  font-dm-sans font-bold text-[#5d5d5d]',
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
