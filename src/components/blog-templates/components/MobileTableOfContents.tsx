'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SlateEditor } from '@udecode/plate';
import { type Heading } from '@udecode/plate-heading';
import { getHeadingList } from '@/components/plate-ui/toc-element-static';
import { cn } from '@/utils/cn';

interface MobileTableOfContentsProps {
    editor: SlateEditor;
}

const MobileTableOfContents: React.FC<MobileTableOfContentsProps> = ({ editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const headingList = getHeadingList(editor);

    if (!headingList || headingList.length === 0) return null;

    const handleSectionClick = (item: Heading) => {
        setIsOpen(false);
        
        // Use requestAnimationFrame or a small timeout to ensure the dropdown 
        // collapse has started before calculating the offset
        setTimeout(() => {
            const element = document.querySelector(`[data-block-id="${item.id}"]`);
            if (element) {
                const yOffset = -20; // 100px offset as requested
                const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 300); // 300ms matches the transition-all duration
    };

    return (
        <div className="my-6 lg:hidden">
            <div className="bg-[#F3F4F6] rounded-2xl overflow-hidden transition-all duration-300 ease-in-out border border-[#E5E7EB]">
                {/* Header Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 text-black hover:bg-[#E5E7EB] transition-colors"
                >
                    <span className="font-jakarta font-semibold text-[17px]">TABLE OF CONTENTS</span>
                    {isOpen ? (
                        <ChevronUp size={20} className="text-black" />
                    ) : (
                        <ChevronDown size={20} className="text-black" />
                    )}
                </button>

                {/* Dropdown Content */}
                <div
                    className={cn(
                        "overflow-auto transition-all duration-300 ease-in-out",
                        isOpen ? "max-h-[50vh] border-t border-[#E5E7EB]" : "max-h-0"
                    )}
                >
                    <nav className="p-4">
                        <ul className="flex flex-col gap-1">
                            {headingList.map((heading) => (
                                <li key={heading.id}>
                                    <button
                                        onClick={() => handleSectionClick(heading)}
                                        className={cn(
                                            "w-full text-left py-2 px-3 rounded-lg hover:bg-[#E5E7EB] transition-colors text-black font-medium leading-snug",
                                            heading.depth === 1 ? "text-base font-semibold" : 
                                            heading.depth === 2 ? "text-[15px] pl-6" : 
                                            "text-sm pl-9"
                                        )}
                                    >
                                        {heading.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default MobileTableOfContents;
