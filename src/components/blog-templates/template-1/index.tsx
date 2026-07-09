import { useQueryState } from 'nuqs';
import BlogsPage from './BlogsPage';
import OtherTopicsPage from './OtherTopicsPage';

interface Template1Props {
    initialCategoryBlogsMap?: Record<string, Blog[]>;
}

export const Template1 = ({ initialCategoryBlogsMap }: Template1Props) => {
    const [pageType] = useQueryState('page-type');

    return (
        <div className='container-custom'>
            {!pageType
                ? <BlogsPage initialCategoryBlogsMap={initialCategoryBlogsMap} />
                : <OtherTopicsPage />
            }
        </div>
    );
};
