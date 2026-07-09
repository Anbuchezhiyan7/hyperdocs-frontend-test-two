import React from 'react';
import StatCard from '@/components/ui/StatCard';
import {
    Totalviews,
    UniqueIcon,
    BlogPerformance,
    AverageIcon,
    TopRefferer,
    Bouncerate,
} from '@/assets/icons';
interface BlogSummaryProps {
    blog: Blog;
}

const BlogSummary: React.FC<BlogSummaryProps> = ({ blog }) => {
    return (
        <div className='container mx-auto py-6 px-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                <StatCard
                    title='Total Views'
                    value={320}
                    icon={Totalviews}
                    backgroundColor='bg-[#FEF7F6]'
                    iconBackgroundColor='bg-[#FDEBEC]'
                    iconColor='text-[#D44C47]'
                    border
                    className='border-red-100'
                />

                <StatCard
                    title='Unique Views'
                    value={320}
                    icon={UniqueIcon}
                    backgroundColor='bg-[#F7FBFE]'
                    iconBackgroundColor='bg-[#EAF3FD]'
                    iconColor='text-[#2483E2]'
                    border
                    className='border-blue-100'
                />

                <StatCard
                    title='Blog Performance'
                    value='Average'
                    icon={BlogPerformance}
                    backgroundColor='bg-[#FAFAFA]'
                    iconBackgroundColor='bg-[#F3F3F3]'
                    border
                    className='border-gray-100'
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                <StatCard
                    title='Average Time on Page'
                    value='3:15 minutes'
                    icon={AverageIcon}
                    backgroundColor='bg-[#F7FBFE]'
                    iconBackgroundColor='bg-[#EAF3FD]'
                    iconColor='text-[#2483E2]'
                    border
                    className='border-blue-100'
                />

                <StatCard
                    title='Top Referrer'
                    value='Google'
                    icon={TopRefferer}
                    backgroundColor='bg-[#FCFAF1]'
                    iconBackgroundColor='bg-[#FCFAF1]'
                    borderColor='#FFB10E'
                    border
                    className='border-yellow-100'
                />

                <StatCard
                    title='Bounce Rate'
                    value='45%'
                    icon={Bouncerate}
                    backgroundColor='bg-[#FEF7F6]'
                    iconBackgroundColor='bg-[#FDEBEC]'
                    iconColor='text-[#D44C47]'
                    border
                    className='border-red-100'
                />
            </div>

            {/* Visitors Timeline */}
            <div className='bg-white rounded-lg shadow-sm p-5 mt-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Visitors Timeline</h3>
                <div className='h-64 flex items-center justify-center text-gray-500'>
                    Chart would be displayed here
                </div>
            </div>
        </div>
    );
};

export default BlogSummary;
