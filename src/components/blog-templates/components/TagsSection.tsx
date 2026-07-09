import React from 'react';
import SectionTitle from './SectionTitle';
import TagBadge from './TagBadge';
import Shimmer from './Shimmer';

interface TagsSectionProps {
    tags: Tag[];
    isLoading: boolean;
}

const TagsSection: React.FC<TagsSectionProps> = ({ tags, isLoading }) => {
    return (
        <section className='py-8'>
            <SectionTitle title='TAGS' />
            <div className='flex flex-wrap gap-3'>
                {isLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                          <Shimmer key={index} className='w-24 h-8' />
                      ))
                    : tags.map(tag => <TagBadge key={tag.tag_id} tag={tag} />)}
            </div>
        </section>
    );
};

export default TagsSection;
