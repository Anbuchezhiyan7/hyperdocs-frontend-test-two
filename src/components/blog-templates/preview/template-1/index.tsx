import { useQueryState } from 'nuqs';
import BlogsPage from './BlogsPage';
import OtherTopicsPage from './OtherTopicsPage';

export const Template1 = () => {
    const [pageType] = useQueryState('page-type');

    return (
        <div className='container-custom'>{!pageType ? <BlogsPage /> : <OtherTopicsPage />}</div>
    );
};
