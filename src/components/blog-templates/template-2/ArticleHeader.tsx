import { AuthorSettings } from '@/interface/settings';
import Image from 'next/image';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTemplateStore } from '@/store/useTemplateStore';

interface ArticleHeaderProps {
    category: string;
    date: string;
    // readTime: string;
    title: string;
    // excerpt: string;
    author: AuthorSettings;
    description?: string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
    category,
    date,
    // readTime,
    title,
    // excerpt,
    author,
    description
}) => {
    const router = useRouter();
    const { getTemplateData } = useTemplateStore();
    const template = getTemplateData('template');

    const handleGetAuthorPath = () => {
        Cookie.set('author_id', author.author_id || '');
        let AuthorName = (author.author_name || '').toLowerCase().replace(" ", "_");
        let AuthorDesignation = (author.designation || '').toLowerCase().replace(" ", "_") || 'no_designation';
        router.push(
            `/blogs/author/${AuthorName}/${AuthorDesignation}`
        );
    };

    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4'>
            <div className='mb-6'>
                <div className='flex items-center gap-2 font-dm-sans font-medium text-[#5D5D5D] text-base mb-4'>
                    <span className='font-medium text-[#5D5D5D]'>{category}</span>
                </div>

              <div className='flex justify-between gap-6 flex-col lg:flex-row'>
  <h1 className={`text-4xl font-dm-sans md:text-4xl lg:text-5xl font-semibold text-[#333333] md:mb-6 mb-2 leading-tight ${description ? 'lg:max-w-[50%] lg:min-w-[50%]' : 'w-full'}`}>
    {title} 
  </h1>

  {description && (
    <p className='text-lg font-dm-sans font-medium text-[#5d5d5d] leading-relaxed mb-8 max-w-2xl'>
      {description}
    </p>
  )}
</div>
            </div>

            <div className='flex justify-between items-center'>
                <div hidden={template?.seo?.hide_authors}>
                    <span className='flex items-center gap-3 cursor-pointer' onClick={handleGetAuthorPath}>
                        {author.author_image?.url && (
                            <Image
                                src={author.author_image?.url || ''}
                                alt={author?.author_name || 'Author'}
                                width={40}
                                height={40}
                                className='md:w-10 md:h-10 w-8 h-8 rounded-full object-cover'
                            />
                        )}
                        <span className='text-lg font-semibold text-[#5d5d5d] font-dm-sans hover:underline underline'>{author.author_name}</span>
                    </span>
                </div>
                <div hidden={template?.seo?.hide_post_dates}>
                    <span className='font-dm-sans font-medium text-[#5D5D5D] text-base'>{date}</span>
                </div>
            </div>
        </div>
    );
};

export default ArticleHeader;
