'use client';

import { FileDownloadIcon } from '@/assets/icons';
import Navbar from '@/components/common/Navbar';
import Table from '@/components/common/Tables';
import SearchInput from '@/components/common/Input/SearchInput';
import { LeadsIcon } from '@/assets/icons';
import { useQuery } from '@tanstack/react-query';
import leadMagnetsApi from '@/api/lead-magnet.api';
import { useQueryState } from 'nuqs';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Skeleton } from 'antd';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/utils/timezone';
import BlogLeadsFilterModal from '@/components/blogs/modals/LeadFilter';
import LeadScoreBadge from '@/components/leads/LeadScoreBadge';
import BlogEngagementHeatmap from '@/components/leads/BlogEngagementHeatmap';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

import AntTabs from '@/components/common/AntTabs';

interface Lead {
    blog_lead_id: string;
    blog_id: string;
    blog_slug?: string;
    user_name: string;
    user_email: string;
    phone: string;
    blog_title: string;
    lead_type: string;
    created_date: string;
    created_time: string;
}

import useBlogService from '@/services/blog.service';

export default function LeadsPage() {
    const [search, setSearch] = useQueryState('search', { defaultValue: '' });
    const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'lead_magnet' });
    const { settings } = useAppStore();
    const { generatePublishedURL } = useBlogService();

    const columns: TableColumn[] = [
        // Lead Score column — Feature 5a
        {
            key: 'lead_score',
            title: 'SCORE',
            className: 'pl-6',
            render: (row: any) => (
                <LeadScoreBadge
                    lead={{
                        user_name: row.user_name,
                        user_email: row.user_email,
                        phone: row.phone,
                        lead_type: row.lead_type,
                        created_date: row.created_date_raw,
                    }}
                />
            ),
        },
        ...(activeTab !== 'newsletter'
            ? [{ key: 'user_name', title: 'NAME', className: '' }]
            : []),
        {
            key: 'user_email',
            title: 'EMAIL ID',
            className: activeTab === 'newsletter' ? '' : '',
        },
        ...(activeTab !== 'newsletter' ? [{ key: 'phone', title: 'PHONE' }] : []),
        {
            key: 'blog_title',
            title: 'BLOG TITLE',
            className: 'min-w-[250px]',
            render: (row: any) => (
                <div className="truncate max-w-[300px]" title={row.blog_title}>
                    {row.blog_title}
                </div>
            ),
        },
        {
            key: 'created_date',
            title: 'DATE & TIME',
            className: 'pr-6',
            render: row => (
                <div className="flex flex-col">
                    <span className="whitespace-nowrap">{row.created_date || '-'}</span>
                    <span className="text-[10px] text-gray-500 font-normal leading-tight">
                        {row.created_time || '-'}
                    </span>
                </div>
            ),
        },
    ];

    const { data: leads, isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: () => leadMagnetsApi.handleGetAllLeads(),
        // Phase 8: Stale-While-Revalidate — serve cached data instantly,
        // refresh silently in background every 2 minutes.
        staleTime: 2 * 60 * 1000,           // 2 min: data is "fresh" — no spinner on revisit
        gcTime:    30 * 60 * 1000,           // 30 min: keep in memory even when tab is idle
        refetchInterval: 2 * 60 * 1000,      // Background poll every 2 min
        refetchIntervalInBackground: false,   // Pause polling when tab is hidden
        meta: { persist: true },              // Persisted to localStorage across reloads
    });

    const filteredLeads = leads?.filter((lead: Lead) => {
        const leadType = lead.lead_type || 'lead_magnet';
        const matchesTab = leadType === activeTab;
        const searchLower = search?.toLowerCase() || '';
        const matchesSearch = 
            lead.user_name?.toLowerCase().includes(searchLower) ||
            lead.user_email?.toLowerCase().includes(searchLower) ||
            lead.phone?.toLowerCase().includes(searchLower) ||
            lead.blog_title?.toLowerCase().includes(searchLower);
        
        return matchesTab && matchesSearch;
    }) || [];

    const globalCsvData =
        leads?.map((lead: Lead) => {
            return {
                Name: lead.user_name || '-',
                'Email ID': lead.user_email || '-',
                Phone: lead.phone || '-',
                'Blog Title': lead.blog_title || '-',
                'Lead Type': lead.lead_type || '-',
                Date: lead.created_date ? formatDateTime(lead.created_date, settings.general.time_zone, 'DD MMM YYYY') : '-',
                Time: lead.created_time ? formatDateTime(lead.created_time, settings.general.time_zone, 'hh:mm A') : '-',
            };
        }) || [];

    const tabCsvData =
        filteredLeads?.map((lead: Lead) => {
            return {
                Name: lead.user_name || '-',
                'Email ID': lead.user_email || '-',
                Phone: lead.phone || '-',
                'Blog Title': lead.blog_title || '-',
                Date: lead.created_date ? formatDateTime(lead.created_date, settings.general.time_zone, 'DD MMM YYYY') : '-',
                Time: lead.created_time ? formatDateTime(lead.created_time, settings.general.time_zone, 'hh:mm A') : '-',
            };
        }) || [];

    const csvHeaders = [
        { label: 'Name', key: 'Name' },
        { label: 'Email ID', key: 'Email ID' },
        { label: 'Phone', key: 'Phone' },
        { label: 'Blog Title', key: 'Blog Title' },
        { label: 'Date', key: 'Date' },
        { label: 'Time', key: 'Time' },
    ];

    const globalCsvHeaders = [
        ...csvHeaders,
        { label: 'Lead Type', key: 'Lead Type' },
    ];

    const leadsData =
        filteredLeads?.map((lead: Lead) => {
            return {
                id: lead.blog_lead_id,
                blog_id: lead.blog_id,
                blog_slug: lead.blog_slug,
                user_name: lead.user_name,
                user_email: lead.user_email,
                phone: lead.phone,
                blog_title: lead.blog_title,
                lead_type: lead.lead_type,
                // Pass raw date for scoring
                created_date_raw: lead.created_date,
                created_date: lead.created_date ? formatDateTime(
                    lead.created_date,
                    settings.general.time_zone,
                    'DD MMM YYYY'
                ) : '-',
                created_time: lead.created_time ? formatDateTime(
                    lead.created_time,
                    settings.general.time_zone,
                    'hh:mm A'
                ) : '-',
            };
        }) || [];

    const totalLeads = leads?.length || 0;
    const leadsThisMonth = leads?.filter((l: Lead) => dayjs(l.created_date).isAfter(dayjs().startOf('month'))).length || 0;
    const leadsToday = leads?.filter((l: Lead) => dayjs(l.created_date).isSame(dayjs(), 'day')).length || 0;

    const tabsItems = [
        { key: 'lead_magnet', label: 'Lead Magnets' },
        { key: 'lead_form', label: 'Lead Forms' },
        { key: 'newsletter', label: 'Newsletters' },
    ];

    const currentTabLabel = tabsItems.find(t => t.key === activeTab)?.label || 'Contacts';

    return (
        <div className="w-full min-h-screen bg-[#F9FAFB]">
            <Navbar title="Contacts Management" hideSearch titleIcon={<LeadsIcon />} hideBtn />
            
            <div className="p-6 lg:p-8 max-w-6xl mx-auto">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Total Contacts', value: totalLeads, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Contacts This Month', value: leadsThisMonth, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { label: 'New Contacts Today', value: leadsToday, color: 'text-green-600', bg: 'bg-green-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
                            <span className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* Header Actions */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="w-full md:max-w-md">
                            <SearchInput 
                                placeholder={`Search within ${currentTabLabel}...`} 
                                value={search || ''} 
                                onSearch={value => setSearch(value)} 
                                className="!bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 rounded-xl"
                            />
                        </div>
                        <CSVLink
                            data={globalCsvData}
                            headers={globalCsvHeaders}
                            filename="all_leads_export.csv"
                            className="w-full md:w-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all gap-2 shadow-sm"
                        >
                            <FileDownloadIcon className="w-5 h-5 text-gray-500" />
                            <span>Export All Contacts</span>
                        </CSVLink>
                    </div>
                </div>

                {/* Tabs & Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <AntTabs 
                        activeKey={activeTab || 'lead_magnet'}
                        onChange={setActiveTab}
                        items={tabsItems}
                        customClassName="px-6 pt-2 border-b border-gray-100 \
                            [&_.ant-tabs-tab]:!px-5 [&_.ant-tabs-tab]:!py-3 [&_.ant-tabs-tab]:!m-0 [&_.ant-tabs-tab]:!transition-all \
                            [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-primary [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!font-bold \
                            [&_.ant-tabs-ink-bar]:!bg-primary [&_.ant-tabs-ink-bar]:!h-[3px] \
                            [&_.ant-tabs-tab:hover]:!text-primary/80"
                        extraContent={
                            <CSVLink
                                data={tabCsvData}
                                headers={csvHeaders}
                                filename={`${activeTab}_leads.csv`}
                                className="mr-6 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 border border-primary/20"
                            >
                                <FileDownloadIcon className="w-4 h-4" />
                                <span>Export {currentTabLabel}</span>
                            </CSVLink>
                        }
                    />

                    <div className="p-0">
                        {isLoading ? (
                            <div className="p-10">
                                <Skeleton active />
                            </div>
                        ) : (
                            <Table 
                                columns={columns} 
                                data={leadsData} 
                                isLoading={isLoading} 
                            />
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                {!isLoading && (
                    <div className="mt-4 text-sm text-gray-400 text-right font-medium">
                        Showing {filteredLeads.length} of {totalLeads} total contacts
                    </div>
                )}

                {/* ── Blog Engagement Heatmap (Feature 5b) ───────────────────── */}
                {!isLoading && totalLeads > 0 && (
                    <BlogEngagementHeatmap leads={leads || []} />
                )}
            </div>
        </div>
    );
}
