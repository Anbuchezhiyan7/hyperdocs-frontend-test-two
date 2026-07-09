'use client';

import React from 'react';
import TemplateNav from './TemplateNav';
import TemplateInfo from '@/components/template/TemplateInfo';
import TemplateInfoSkeleton from '@/components/template/TemplateInfo/Skeleton';
import { useQuery } from '@tanstack/react-query';
import templatesApi from '@/api/templates.api';

const Templates: React.FC = () => {
    const { data: templates, isLoading } = useQuery({
        queryKey: ['templates'],
        queryFn: () => templatesApi.handleGetTemplates(),
    });

    return (
        <div className='relative h-full overflow-y-auto bg-[#FAFAFA]'>
            <div className='sticky top-0 z-10 border-b border-[#ECECEC] bg-white px-8 py-5'>
                <TemplateNav />
            </div>
            <div className='mx-auto flex w-full max-w-[860px] flex-col gap-8 px-8 py-8'>
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => <TemplateInfoSkeleton key={i} />)
                    : (templates as any)?.map((template: any) => (
                          <TemplateInfo key={template.template_id} data={template} />
                      ))}
            </div>
        </div>
    );
};

export default Templates;
