import { Typography } from 'antd';

type Props = {
    title: string;
    children: React.ReactNode;
    isRequired?: boolean;
};

const SectionWrapper: React.FC<Props> = ({ title, children, isRequired }) => {
    return (
        <div className='pb-2 mt-0'>
            <Typography.Title level={5} className='flex items-center'>
                {title} 
                {isRequired && <span className='text-red-500 ml-1'>*</span>}
                <span className='flex-grow border-t border-gray-300 ml-2'></span>
            </Typography.Title>
            <div className='space-y-3'>{children}</div>
        </div>
    );
};

export default SectionWrapper;
