import React from 'react';
import { LeadsTable } from './Leads/LeadsTable';
import dayjs from 'dayjs';
import { Skeleton } from 'antd';

interface BlogLeadsProps {
    leads: any[];
    isLoading: boolean;
}

const BlogLeads: React.FC<BlogLeadsProps> = ({ leads, isLoading }) => {
    const leadsData =
        leads?.map((lead: any) => ({
            user_name: lead.user_name || '-',
            user_email: lead.user_email || '-',
            phone: lead.phone || '-',
            blog_title: lead.blog_title || '-',
            created_date: lead.created_date ? dayjs(lead.created_date).format('DD-MM-YYYY') : '-',
            created_time: lead.created_time ? dayjs(lead.created_time).format('HH:mm') : '-',
        })) || [];

    return (
        <div className='container w-full mx-auto'>
            <div className='flex'>
                {isLoading ? <Skeleton active /> : <LeadsTable leads={leadsData} />}
            </div>
        </div>
    );
};

export default BlogLeads;
