import React from 'react';
import { Progress } from 'antd';
interface BlogPollsProps {
    polls: Poll[];
}

const BlogPolls: React.FC<BlogPollsProps> = ({ polls }) => {
    return (
        <div className='py-6 w-full'>
            <div className='container mx-auto'>
                <div className='space-y-6 mx-auto w-full  px-8'>
                    {polls && polls?.length > 0 ? (
                        polls?.map(poll => (
                            <div key={poll.poll_id} className='border-b border-gray-200 pb-6'>
                                <h3 className='text-lg font-[700] text-[#333333] mb-3'>
                                    {poll.poll_title}
                                </h3>
                                <div className='bg-[#FAFAFA] rounded-lg shadow-sm p-5'>
                                    <div className=' pb-4 mb-4'>
                                        <h4 className='text-base  text-[#5D5D5D] font-semibold'>
                                            {poll.poll_question}
                                        </h4>
                                    </div>

                                    <div className='space-y-3'>
                                        {poll?.poll_options?.map(option => {
                                            const percentage = Math.round(
                                                (option.option_votes / poll.total_voters) * 100
                                            );
                                            return (
                                                <div
                                                    key={option.option_id}
                                                    className='mb-3 mx-auto w-full'
                                                >
                                                    <div className='flex justify-between mb-1 '>
                                                        <span className='text-black text-[14px] font-[600]'>
                                                            {option.option_title}
                                                        </span>
                                                        <span className='text-gray-700'>
                                                            {option.option_votes}/
                                                            {poll.total_voters || 0}
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        percent={percentage}
                                                        showInfo={false}
                                                        strokeColor='#FF5200'
                                                        trailColor='#F3F3F3'
                                                        size='small'
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='text-center text-gray-500'>No polls found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPolls;
