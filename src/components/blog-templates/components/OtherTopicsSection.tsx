import React from 'react';
import SectionTitle from './SectionTitle';
import { ArrowRight } from 'lucide-react';
import { useQueryState } from 'nuqs';

const OtherTopicsSection: React.FC = () => {
    const [pageType, setPageType] = useQueryState('page-type');

    return (
        <section className='py-8'>
            <div className='flex items-center justify-between mb-6'>
                <SectionTitle title='OTHER TOPICS' className='mb-0' />
                <div
                    onClick={() => setPageType('all')}
                    className='text-primary font-medium flex cursor-pointer items-center hover:underline transition-all'
                >
                    See all
                    <ArrowRight className='ml-1 h-4 w-4' />
                </div>
            </div>
            <p className='text-textSecondary'>See other articles and topics covered.</p>
        </section>
    );
};

export default OtherTopicsSection;
