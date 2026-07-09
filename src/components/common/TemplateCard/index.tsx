import React from 'react';
import { Button } from 'antd';
import { LuArrowUpRight } from '@/assets/icons';    
import Image, { StaticImageData } from 'next/image';
import { useQueryState } from 'nuqs';
interface TemplateCardProps {
    thumbnail: string | StaticImageData;
    component: React.ReactNode;
    title: string;
    count: number;
    onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
    component,
    title,
    count,
    onClick,
    thumbnail,
}) => {
    const isUpgraded = false;
    const [modelType, setModelType] = useQueryState('model-type');
    const handleUpgrade = (e: any) => {
        e.stopPropagation();
        if (!isUpgraded) {
            setModelType('pricing');
        }
    };

    return (
        <div
            onClick={onClick}
            className='w-full hover:scale-105 transition-all duration-300 h-[180px] relative rounded-lg overflow-hidden'
        >
            <div className='w-full h-full relative bg-gray-300'>
                <Image src={thumbnail} alt={title} fill className='object-fill' />
            </div>
            <div className='absolute bottom-0 left-0 right-0 flex gap-2 h-10 px-3 justify-between items-center flex-shrink-0 border-t-[1px] border-[#E0E0E0)] bg-white/40 backdrop-blur-[12px]'>
                <span className='text-black text-sm font-semibold whitespace-nowrap'>{title}</span>
                <Button
                    onClick={handleUpgrade}
                    className='flex items-center gap-1 text-[10px]  h-fit px-2 text-[#FF4D00] font-medium cursor-pointer bg-[#FFEEE5] text-center  '
                    icon={<LuArrowUpRight />}
                    iconPosition='end'
                >
                    UPGRADE
                </Button>
            </div>
        </div>
    );
};

export default TemplateCard;