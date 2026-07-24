import React from 'react';
import { BlogDetailTabType } from '@/assets/types';
    import { FileDownloadIcon } from '@/assets/icons';
import { CSVLink } from 'react-csv';
import { SearchInput } from '@/components/common/Input/DefaultFields';
import { useQueryState } from 'nuqs';
import { Activity } from 'lucide-react';

interface BlogDetailTabsProps {
    activeTab: BlogDetailTabType;
    setActiveTab: (tab: BlogDetailTabType) => void;
    csvData: any;
    csvHeaders: any;
    pollsCount?: number;
    leadsCount?: number;
}

const BlogDetailTabs: React.FC<BlogDetailTabsProps> = ({
    activeTab,
    setActiveTab,
    csvData,
    csvHeaders,
    pollsCount = 0,
    leadsCount = 0,
}) => {
    const [search, setSearch] = useQueryState('search');

    return (
        <div className='bg-white  w-full '>
            <div className='container'>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row'>
                        {[
                            // 'Summary',
                            { name: 'Polls', count: pollsCount },
                            { name: 'Leads', count: leadsCount },
                            { name: 'Activity', count: 0 },
                        ].map((tab, index) => (
                            <button
                                key={tab.name}
                                className={`py-4 px-5 font-medium text-[24px] font-700 flex items-center gap-2 ${
                                    activeTab === tab.name
                                        ? 'text-gray-900'
                                        : 'text-[#8F8F8F] hover:text-gray-800'
                                }`}
                                onClick={() => setActiveTab(tab.name as BlogDetailTabType)}
                            >
                                {tab.name === 'Activity' && (
                                    <Activity className="w-5 h-5" />
                                )}
                                <span>{tab.name}</span>
                                {tab.count > 0 && (
                                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                                        activeTab === tab.name
                                            ? 'bg-gray-200 text-gray-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    {activeTab === 'Leads' && (
                        <div className='flex gap-2 pr-10'>
                            <SearchInput
                                name='search'
                                value={search || ''}
                                placeholder='Search by name, email, source, etc.'
                                onChange={e => setSearch(e)}
                                inputType='search'
                                inputClassName='!h-full w-[250px]'
                            />
                            <CSVLink
                                data={csvData}
                                headers={csvHeaders}
                                filename='leads.csv'
                                className='ant-btn rounded-xl bg-primary text-white px-5 whitespace-nowrap flex items-center'
                            >
                                <span className='mr-2'> 

                                <FileDownloadIcon  />
                                </span>
                                Download as CSV
                            </CSVLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetailTabs;
