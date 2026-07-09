import { Spinner } from '@/components/plate-ui/spinner';

const BannerSkeleton = () => {
    return (
        <div className='flex bg-gray-200 w-full items-center justify-center min-h-[180px] rounded-lg animate-pulse'>
            <Spinner className='w-10 h-10' />
        </div>
    );
};

export default BannerSkeleton;
