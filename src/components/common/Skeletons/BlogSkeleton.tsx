import { BLOG_GRID } from '@/components/blogs/constants';
import { cn } from '@/utils/cn';

// Body-only skeleton rows. The surrounding card chrome (tabs, search, header)
// stays mounted so search focus and context are preserved during refetch.
const BlogSkeleton = () => {
    return (
        <>
            {Array.from({ length: 8 })?.map((_, index) => (
                <div
                    key={index}
                    className={cn(BLOG_GRID, 'px-5 py-4 border-b border-gray-100 animate-pulse')}
                >
                    <div className="pr-4">
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-1/2 bg-gray-100 rounded" />
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                    <div className="h-9 w-9 bg-gray-200 rounded-lg mx-auto" />
                    <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="flex justify-end gap-1.5">
                        <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                        <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                        <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            ))}
        </>
    );
};

export default BlogSkeleton;
