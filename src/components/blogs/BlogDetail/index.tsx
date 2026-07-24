import React, { useState } from 'react';
import { BlogDetailTabType } from '@/assets/types';
import BlogNavbar from './BlogNavbar';
import BlogDetailTabs from './BlogDetailTabs';
import BlogSummary from './BlogSummary';
import BlogPolls from './BlogPolls';
import BlogLeads from './BlogLeads';
import ActivityFeed from './ActivityFeed';
import { useParams, useRouter } from 'next/navigation';
import { useQueries } from '@tanstack/react-query';
import blogApi from '@/api/blog.api';
import Loader from '@/components/common/Loader';
import pollsApi from '@/api/polls.api';
import leadMagnetsApi from '@/api/lead-magnet.api';
import { useQueryState } from 'nuqs';
import { buildActivityFeed } from '@/utils/activity';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const BlogDetail: React.FC = () => {
    const [activeTab, setActiveTab] = useState<BlogDetailTabType>('Polls');
    const router = useRouter();
    const params = useParams();
    const blogId = params.id;
    const [search, setSearch] = useQueryState('search');

    const {
        '0': { data: polls, isLoading: isGettingAllPolls },
        '1': { data: blog, isLoading: isGettingBlog },
        '2': { data: leads, isLoading: isGettingAllLeads },
    } = useQueries({
        queries: [
            {
                queryKey: ['polls'],
                queryFn: () => pollsApi.handleGetAllPolls(blogId as string),
                enabled: !!blogId,
            },
            {
                queryKey: ['blog', blogId],
                queryFn: () => blogApi.handleGetBlog(blogId as string)?.then(res => res?.data),
                enabled: !!blogId,
            },
            {
                queryKey: ['leads', blogId, search],
                queryFn: () => leadMagnetsApi.handleGetAllLeads(search as string, blogId as string),
                enabled: !!blogId,
            },
        ],
    });

    // Build activity feed from existing data
    const activityEvents = buildActivityFeed(blog, leads || []);

    const renderContent = () => {
        switch (activeTab) {
            case 'Summary':
                return <BlogSummary blog={blog} />;
            case 'Polls':
                return <BlogPolls polls={polls} />;
            case 'Leads':
                return <BlogLeads leads={leads} isLoading={isGettingAllLeads} />;
            case 'Activity':
                return (
                    <div className="max-w-3xl mx-auto py-6 px-4">
                        <ActivityFeed events={activityEvents} />
                    </div>
                );
            default:
                return <BlogSummary blog={blog} />;
        }
    };

    const onBack = () => {
        router.back();
    };

    if (isGettingBlog || isGettingAllPolls) {
        return <Loader />;
    }

    const csvData =
        leads?.map((lead: any) => ({
            Name: lead.user_name,
            'Email ID': lead.user_email,
            'Blog Title': lead.blog_title,
            Date: lead.created_date,
            Time: lead.created_time,
        })) || [];

    const csvHeaders = [
        { label: 'Name', key: 'Name' },
        { label: 'Email ID', key: 'Email ID' },
        { label: 'Blog Title', key: 'Blog Title' },
        { label: 'Date', key: 'Date' },
        { label: 'Time', key: 'Time' },
    ];

    return (
        <div className='flex flex-col'>
            <BlogNavbar isLoading={isGettingBlog} blog={blog} onBack={onBack} />
            <BlogDetailTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                csvData={csvData}
                csvHeaders={csvHeaders}
                pollsCount={polls?.length || 0}
                leadsCount={leads?.length || 0}
            />
            <div className='flex-1 overflow-y-auto'>{renderContent()}</div>
        </div>
    );
};

export default BlogDetail;
