import { Spinner } from '@/components/plate-ui/spinner';

type Props = {
    loading: boolean;
};

const BlurLoader = (props: Props) => {
    if (!props.loading) return null;
    return (
        <div className='absolute rounded-lg top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-white/50 z-50 flex justify-center items-center'>
            <Spinner className='w-10 h-10' />
        </div>
    );
};

export default BlurLoader;
