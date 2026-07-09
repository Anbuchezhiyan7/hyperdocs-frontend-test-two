import React from 'react';
import { Template1 } from '@/assets/images';
import TemplateCard from '@/components/common/TemplateCard';
import Upload from '@/components/common/Input/Upload';
interface TabModelContentProps {
    content: React.ReactNode;
}

const TabModelContent: React.FC<TabModelContentProps> = ({ content }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full place-items-center">
         
            </div>
        </div>
    );
};

export default TabModelContent;
