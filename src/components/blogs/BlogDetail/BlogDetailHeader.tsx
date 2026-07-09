import React from 'react';
import { ArrowLeft, Share2, Edit, MoreVertical } from 'lucide-react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { BlogDetailTabType } from '@/assets/types';

interface BlogDetailHeaderProps {
    blog: Blog;
    activeTab: BlogDetailTabType;
    setActiveTab: (tab: BlogDetailTabType) => void;
    onBack: () => void;
}

const BlogDetailHeader: React.FC<BlogDetailHeaderProps> = ({
    blog,
    activeTab,
    setActiveTab,
    onBack,
}) => {
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Duplicate',
        },
        {
            key: '2',
            label: 'Archive',
        },
        {
            key: '3',
            label: 'Delete',
            danger: true,
        },
    ];

    return (
        <div className='border-b border-gray-200 bg-white'>
            <div className='px-6 py-4 flex items-center'>
                <button
                    title='Back'
                    onClick={onBack}
                    className='flex items-center text-gray-600 hover:text-gray-800 mr-4'
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className='text-xl font-semibold text-gray-800 flex-1'>{blog.blog_title}</h2>

                <div className='flex items-center space-x-3'>
                    <Button
                        icon={<Share2 size={18} />}
                        className='flex items-center border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-300'
                    >
                        Share
                    </Button>

                    <Button
                        icon={<Edit size={18} />}
                        type='primary'
                        className='flex items-center bg-orange-500 hover:bg-orange-600 border-none'
                    >
                        Edit
                    </Button>

                    <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']}>
                        <Button
                            icon={<MoreVertical size={18} />}
                            className='flex items-center border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-300'
                        />
                    </Dropdown>
                </div>
            </div>

            <div className='px-6 flex border-b border-gray-200'>
                <button
                    className={`py-4 px-5 font-medium ${
                        activeTab === 'Summary'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('Summary')}
                >
                    Summary
                </button>
                <button
                    className={`py-4 px-5 font-medium ${
                        activeTab === 'Polls'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('Polls')}
                >
                    Polls
                </button>
                <button
                    className={`py-4 px-5 font-medium ${
                        activeTab === 'Leads'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('Leads')}
                >
                    Leads
                </button>
            </div>
        </div>
    );
};

export default BlogDetailHeader;
